const fs = require('fs');
const lines = fs.readFileSync('input.txt', 'utf8').replace(/\r/g, ' ').split('\n');

let [start, end] = lines[0].split(' ');
const edges = lines.slice(1).map((line) => {
    const [a, b, C] = line.split(' ');
    return [a.substring(0, 1), b, C];
});

// Hàm tạo đồ thị có hướng
function createDirectedGraph(edges) {
    let graph = {};
    for (let edge of edges) {
        let [a, b, c] = edge;
        if (!graph[a]) graph[a] = [];
        graph[a].push([b, c]);
    }
    return graph;
}

let graph = createDirectedGraph(edges);
let result = [];
let Q = [];
let L = [];
let currentPath = [];
let minRoad = 0;
let cost = Infinity; // Khởi tạo cost ban đầu với giá trị lớn
let visited = new Set(); // Để theo dõi các đỉnh đã thăm

Q.push(start);
L.push(start);

while (L.length > 0) {
    let LList = [];
    let LList1 = [];
    currentPath.push(L[0]?.split(',').map(point => point.substring(0, 1)));
    
    // Lấy trạng thái đầu tiên trong danh sách L
    let u = L.shift().substring(0, 1);
    
    // Kiểm tra nếu đã thăm
    if (visited.has(u)) continue; 
    visited.add(u); // Đánh dấu đã thăm
    
    if (u === end.substring(0, 1) && minRoad <= cost) {
        cost = minRoad;
        let path = currentPath.reverse().join("<-"); // Lưu đường đi
        
        result.push({
            'TT': u,
            'KE': `TTKT- Dung duong tong la `,
            'k(u,v)': '',
            'h(v)': '',
            'g(v)': '',
            'f(v)': '',
            'LList1': LList1.sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1))).join(","),
            'LList': LList.join(",")
        });
        
        // // Thêm dòng cuối với thông tin yêu cầu
        // result.push({
        //     'TT': '',// end.substring(0, 1)
        //     'KE': ``,
        //     'k(u,v)': '',
        //     'h(v)': '',
        //     'g(v)': '',
        //     'f(v)': '',
        //     'LList1': '',
        //     'LList': ''
        // });
         // Thêm dòng cuối với thông tin yêu cầu
         result.push({
            'TT': '',// end.substring(0, 1)
            'KE': `${path} tổng chi phí là ${cost}`,
            'k(u,v)': '',
            'h(v)': '',
            'g(v)': '',
            'f(v)': '',
            'LList1': '',
            'LList': ''
        });
        
        break;
    }
    
    let nextStates = [];
    let K = [], H = [], G = [], F = [];
    
    if (graph[u]) {
        for (let [v, k] of graph[u]) {
            let h = parseInt(v.substring(1)); // Hàm heuristic h(v)
            let g = minRoad + parseInt(k); // g(v) = g(u) + k(u, v)
            let f = g + h; // f(v) = g(v) + h(v)
            
            if (!visited.has(v.substring(0, 1))) { // Kiểm tra nếu chưa thăm
                nextStates.push(v.substring(0, 1));
                LList1.push(`${v.substring(0, 1)}${f}`);
                K.push(k);
                H.push(h);
                G.push(g);
                F.push(f);
                
                L.push(`${v.substring(0, 1)}${f}`);
            }
        }
    }

    // Sắp xếp danh sách L theo thứ tự tăng dần của f
    L.sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)));
    
    // Cập nhật minRoad
    if (L.length > 0) {
        minRoad = parseInt(L[0]?.substring(1));
    }
    
    result.push({
        'TT': u,
        'KE': nextStates.join(","),
        'k(u,v)': K.join(","),
        'h(v)': H.join(","),
        'g(v)': G.join(","),
        'f(v)': F.join(","),
        'LList1': LList1.join(","),
        'LList': LList1.join(",")
    });
}

// Hiển thị kết quả dưới dạng bảng
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

// Tạo đầu bảng
const tableHeader = tableFormat.map((col) => col.name.padEnd(col.width)).join('|');
const tableBody = result
    .map((object) => tableFormat.map((col) => (object[col.name] || '').padEnd(col.width)).join('|'))
    .join('\n');

// Ghi vào file output.txt
fs.writeFileSync('output.txt', `${tableHeader}\n${tableBody}`, { flag: 'w' });

console.log('Bảng kết quả đã được ghi vào file output.txt');
