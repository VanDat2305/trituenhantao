const fs = require('fs');

// Hàm đọc tệp và phân tích dữ liệu
function readFile(inputFile) {
    const lines = fs.readFileSync(inputFile, 'utf8').replace(/\r/g, ' ').split('\n'); // Đọc tệp và tách thành từng dòng
    let [start, end] = lines[0].trim().split(' '); // Dòng đầu tiên chứa điểm bắt đầu và kết thúc
    if (!start || !end) {
        console.error('Dòng 1 không hợp lệ: Cần nhập điểm bắt đầu và điểm kết thúc.');
        process.exit(1);
    }
    
    const edges = lines.slice(1).map((line) => {
        const parts = line.trim().split(' ');
        // Kiểm tra xem dòng có đúng 3 thành phần hay không
        
        if (parts.length !== 3) {
            console.error(`Dòng không hợp lệ: "${line}". Vui lòng kiểm tra lại.`);
            return null; // Trả về null để bỏ qua dòng này hoặc có thể đưa ra lỗi
        }
        
        let [a, b, C] = parts;
    
        // Kiểm tra các điều kiện bổ sung, ví dụ kiểm tra xem trọng số có phải là số không
        if (isNaN(C)) {
            console.error(`Trọng số không hợp lệ ở dòng: "${line}". Vui lòng nhập số.`);
            return null; // Bỏ qua dòng hoặc có thể đưa ra lỗi
        }
    
        // Trả về mảng chứa đỉnh bắt đầu, đỉnh kết thúc và trọng số
        return [a.charAt(0), b, parseFloat(C)]; // Ép trọng số thành kiểu số
    }).filter(edge => edge !== null); // Loại bỏ các dòng không hợp lệ
    
    return { start, end, edges }; // Trả về đối tượng chứa start, end, và các cạnh edges
}

// tạo đồ thi tu danh sách cạnh
function createDirectedGraph(edges) {
    let graph = {};
    for (let edge of edges) {
        let [a, b, c] = edge;
        if (!graph[a]) graph[a] = []; // Nếu đỉnh chưa tồn tại trong graph, khởi tạo mảng rỗng
        graph[a].push([b, c]); // Thêm cạnh vào danh sách cạnh của đỉnh a
    }
    return graph; // Trả về đồ thị có hướng
}
// Hàm xử lý đồ thị và tính toán đường đi
function processGraph(start, end, edges) {
    let graph = createDirectedGraph(edges); // Tạo đồ thị từ danh sách các cạnh
    let result = []; // Lưu trữ kết quả cuối cùng
    let LList = [start]; // Danh sách các đỉnh tạm thời để xử lý
    let minRoad = 0; // Biến lưu chi phí nhỏ nhất đến thời điểm hiện tại
    let gValues = { [start]: 0 }; // Khởi tạo giá trị g cho đỉnh bắt đầu
    let gU = 0; // Khởi tạo gU

    while (LList.length > 0) {
        let LList1 = [];
        let u = LList.shift().charAt(0); // Lấy đỉnh đầu tiên trong L để xử lý

        if (u === end.charAt(0)) {
            result.push(
                { 
                    'TT': u,
                    'KE': `TTKT, tìm được đường đi tạm thời đội dài ${minRoad}`,
                    'LList1': LList1.join(","),
                    'LList': LList.join(",")
                },
 
            );
            var x = false;
            if (LList.some(item => parseInt(item.slice(1)) < minRoad)) {
                continue; // Nếu có ít nhất một phần tử thỏa mãn, tiếp tục vòng lặp
            } else {
                break; // Nếu không có phần tử nào thỏa mãn, thoát khỏi vòng lặp
            }
            
        }

        let nextStates = [], K = [], H = [], G = [], F = [];
        
        console.log(u, graph[u]);
        
        if (graph[u]) {
            for (let [v, k] of graph[u]) {
                let vKey = v.charAt(0); // Lấy ký tự đầu của v
                let h = parseInt(v.slice(1)); // Tính heuristic h(v)
                let g = (gValues[u] || 0) + parseInt(k); // Tính g(v) = g(u) + k(u, v)
                let f = g + h; // Tính f(v) = g(v) + h(v)

                // Nếu g nhỏ hơn giá trị đã lưu cho v, cập nhật
                if (!gValues[vKey] || g < gValues[vKey]) {
                    gValues[vKey] = g; // Cập nhật g cho đỉnh v
                    if (gU === 0 || g < gU) gU = g; // Cập nhật gU nếu g nhỏ hơn
                }
                nextStates.push(vKey); 
                LList1.push(`${vKey}${f}`); // Thêm v và f(v) vào LList1
                K.push(k); H.push(h); G.push(g); F.push(f);
            }
        }

        // Sắp xếp `LList1` theo `f(v)` và thêm vào đầu `L`
        LList1.sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
        LList.unshift(...LList1);

        // Cập nhật minRoad
        if (LList.length > 0) minRoad = parseInt(LList[0].slice(1));

        // Lưu thông tin của đỉnh hiện tại vào kết quả
        result.push({
            'TT': u,
            'KE': nextStates.join(","),
            'k(u,v)': K.join(","), 
            'h(v)': H.join(","),
            'g(v)': G.join(","),
            'f(v)': F.join(","),
            'LList1': LList1.join(","),
            'LList': LList.join(",")
        });
    }

    return result;
}



// Hàm ghi kết quả ra tệp tin
function writeFile(outputFile, result) {
    
    const tableFormat = [
        { name: 'TT', alignment: 'center', width: 3 },
        { name: 'KE', alignment: 'center', width: 55 },
        { name: 'k(u,v)', alignment: 'center', width: 15 },
        { name: 'h(v)', alignment: 'center', width: 15 },
        { name: 'g(v)', alignment: 'center', width: 15 },
        { name: 'f(v)', alignment: 'center', width: 15 },
        { name: 'LList1', alignment: 'left', width: 30 },
        { name: 'LList', alignment: 'left', width: 30 },
    ];

    // Tạo tiêu đề bảng
    const tableHeader = tableFormat.map((col) => col.name.padEnd(col.width)).join('|');
    // Tạo nội dung bảng
    const tableBody = result
        .map((object) => tableFormat.map((col) => (object[col.name] || '').padEnd(col.width)).join('|'))
        .join('\n');

    // Ghi kết quả vào tệp tin
    fs.writeFileSync(outputFile, `${tableHeader}\n${tableBody}`, { flag: 'w' });

    const green = "\x1b[32m";
    const reset = "\x1b[0m";
    console.log(`${green}Bảng kết quả đã được ghi vào file`, outputFile , `${reset}`);
}



const { start, end, edges } = readFile('input2.txt');
const result = processGraph(start, end, edges);
writeFile('output.txt', result); 
