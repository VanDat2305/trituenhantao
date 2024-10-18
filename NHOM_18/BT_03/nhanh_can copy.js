const fs = require('fs');

// Hàm đọc tệp và phân tích dữ liệu
function readFile(inputFile) {
    const lines = fs.readFileSync(inputFile, 'utf8').replace(/\r/g, ' ').split('\n'); // Đọc tệp và tách thành từng dòng
    let [start, end] = lines[0].split(' '); // Dòng đầu tiên chứa điểm bắt đầu và kết thúc
    const edges = lines.slice(1).map((line) => { // Dòng còn lại chứa các cạnh của đồ thị
        const [a, b, C] = line.split(' '); 
        return [a.substring(0, 1), b, C]; // Trả về mảng chứa đỉnh bắt đầu, kết thúc và trọng số
    });
    return { start, end, edges }; // Trả về đối tượng chứa start, end, và các cạnh edges
}

// Hàm xử lý đồ thị và tính toán đường đi
function processGraph(start, end, edges) {
    // Hàm tạo đồ thị có hướng từ danh sách cạnh
    function createDirectedGraph(edges) {
        let graph = {};
        for (let edge of edges) {
            let [a, b, c] = edge;
            if (!graph[a]) graph[a] = []; // Nếu đỉnh chưa tồn tại trong graph, khởi tạo mảng rỗng
            graph[a].push([b, c]); // Thêm cạnh vào danh sách cạnh của đỉnh a
        }
        return graph; // Trả về đồ thị có hướng
    }

    let graph = createDirectedGraph(edges); // Tạo đồ thị từ danh sách các cạnh
    let result = []; // Lưu trữ kết quả cuối cùng
    let Q = []; // Hàng đợi các trạng thái cần duyệt
    let L = []; // Danh sách các đỉnh tạm thời được chọn để xử lý
    let currentPath = []; // Lưu trữ đường đi hiện tại
    let minRoad = 0; // Biến lưu chi phí nhỏ nhất đến thời điểm hiện tại
    let cost = Infinity; // Khởi tạo biến lưu chi phí với giá trị vô cùng lớn
    let visited = new Set(); // Tập hợp các đỉnh đã thăm

    Q.push(start); // Đưa điểm bắt đầu vào hàng đợi
    L.push(start); // Đưa điểm bắt đầu vào danh sách L

    // Vòng lặp xử lý các đỉnh trong danh sách L
    while (L.length > 0) {
        let LList = [];
        let LList1 = [];
        currentPath.push(L[0]?.split(',').map(point => point.substring(0, 1))); // Lưu trạng thái hiện tại vào đường đi

        let u = L.shift().substring(0, 1); // Lấy đỉnh đầu tiên trong L để xử lý

        if (visited.has(u)) continue; // Nếu đỉnh đã thăm rồi thì bỏ qua
        visited.add(u); // Đánh dấu đỉnh này đã được thăm

        // Nếu đã đến đỉnh kết thúc và có chi phí nhỏ hơn hoặc bằng chi phí hiện tại
        if (u === end.substring(0, 1) && minRoad <= cost) {
            cost = minRoad; // Cập nhật chi phí nhỏ nhất
            let path = currentPath.reverse().join("<-"); // Tạo đường đi ngược lại từ kết thúc về bắt đầu

            result.push({
                'TT': u,
                'KE': `TTKT- Dung duong tong la `,
                'k(u,v)': '',
                'h(v)': '',
                'g(v)': '',
                'f(v)': '',
                'LList1': LList1.join(","),
                'LList': LList.join(",")
            });

            result.push({
                'TT': '',
                'KE': `${path} tổng chi phí là ${cost}`, // Thêm thông tin chi phí tổng cộng
                'k(u,v)': '',
                'h(v)': '',
                'g(v)': '',
                'f(v)': '',
                'LList1': '',
                'LList': ''
            });
            break; // Thoát vòng lặp sau khi tìm được đường đi ngắn nhất
        }

        let nextStates = [];
        let K = [], H = [], G = [], F = [];

        // Kiểm tra nếu đỉnh u có các đỉnh kề
        if (graph[u]) {
            for (let [v, k] of graph[u]) {
                let h = parseInt(v.substring(1)); // Tính hàm heuristic h(v)
                let g = minRoad + parseInt(k); // Tính g(v) = g(u) + k(u, v)
                let f = g + h; // Tính f(v) = g(v) + h(v)

                if (!visited.has(v.substring(0, 1))) { // Nếu đỉnh v chưa được thăm
                    nextStates.push(v.substring(0, 1)); // Thêm v vào danh sách các trạng thái tiếp theo
                    LList1.push(`${v.substring(0, 1)}${f}`); // Thêm v và f(v) vào LList1
                    K.push(k); // Lưu trọng số k(u, v)
                    H.push(h); // Lưu h(v)
                    G.push(g); // Lưu g(v)
                    F.push(f); // Lưu f(v)

                    L.push(`${v.substring(0, 1)}${f}`); // Thêm v vào danh sách L với f(v)
                }
            }
        }

        // Sắp xếp danh sách L theo giá trị f(v) tăng dần
        L.sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)));

        // Cập nhật giá trị minRoad (chi phí nhỏ nhất đến thời điểm hiện tại)
        if (L.length > 0) {
            minRoad = parseInt(L[0]?.substring(1));
        }

        // Lưu thông tin của đỉnh hiện tại vào kết quả
        result.push({
            'TT': u,
            'KE': nextStates.join(","), // Các đỉnh kề với u
            'k(u,v)': K.join(","), // Trọng số các cạnh k(u, v)
            'h(v)': H.join(","), // Heuristic của các đỉnh kề
            'g(v)': G.join(","), // g(v) của các đỉnh kề
            'f(v)': F.join(","), // f(v) của các đỉnh kề
            'LList1': LList1.join(","), // Danh sách đỉnh kề và f(v)
            'LList': LList1.join(",") // Danh sách đỉnh kề
        });
    }

    return result; // Trả về danh sách kết quả
}

// Hàm ghi kết quả ra tệp tin
function writeFile(outputFile, result) {
    // Định dạng bảng kết quả
    const tableFormat = [
        { name: 'TT', alignment: 'center', width: 5 },
        { name: 'KE', alignment: 'center', width: 50 },
        { name: 'k(u,v)', alignment: 'center', width: 15 },
        { name: 'h(v)', alignment: 'center', width: 15 },
        { name: 'g(v)', alignment: 'center', width: 15 },
        { name: 'f(v)', alignment: 'center', width: 15 },
        { name: 'LList', alignment: 'left', width: 30 },
        { name: 'LList1', alignment: 'left', width: 30 },
    ];

    // Tạo tiêu đề bảng
    const tableHeader = tableFormat.map((col) => col.name.padEnd(col.width)).join('|');
    // Tạo nội dung bảng
    const tableBody = result
        .map((object) => tableFormat.map((col) => (object[col.name] || '').padEnd(col.width)).join('|'))
        .join('\n');

    // Ghi kết quả vào tệp tin
    fs.writeFileSync(outputFile, `${tableHeader}\n${tableBody}`, { flag: 'w' });
    console.log('Bảng kết quả đã được ghi vào file', outputFile); // Thông báo khi hoàn thành
}

const { start, end, edges } = readFile('input.txt'); // Đọc tệp đầu vào
const result = processGraph(start, end, edges); // Xử lý đồ thị và tìm đường đi
writeFile('output.txt', result); // Ghi kết quả ra tệp đầu ra
