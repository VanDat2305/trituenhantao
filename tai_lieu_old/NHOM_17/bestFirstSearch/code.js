const fs = require('fs')
const lines = fs.readFileSync('bestFirstSearch/input.txt', 'utf8').replace(/\r/g, ' ').split('\n');
let [start, end] = lines[0].split(' ');
const edges = lines.slice(1).map((line) => {
    const [a, b] = line.split(' ');
    return [a, b];
});
function createDirectedGraph(edges) {
    let graph = {};
    for (let edge of edges) {
        let [a, b] = edge;
        if (!graph[a]) graph[a] = [];
        graph[a].push(b);
    }
    return graph;
}
let graph = createDirectedGraph(edges);
let result = []
let L = []
let currentPath = [];
L.push(start);
while (L.length > 0 && start !== end) {
    
    currentPath.push(L[0]);
    start = L.shift();
    let nextStates = [];
    if(graph[start]){
        for (let neighbor of graph[start]) {
            nextStates.push(neighbor);
            L.push(neighbor);
        }
    }
        result.push({
        'TT': start,
        'KE': start !== end ? nextStates.join(","): `TTKT-Dung duong di la ${currentPath.reverse().join('<--')} `,
        'LList': start !== end ? L.sort(function(a, b) {
            return parseInt(a.substring(1)) - parseInt(b.substring(1));
        }).join(",") : ''
    });
}


console.table(result);
const tableFormat = [
    { name: 'TT', alignment: 'center' },
    { name: 'KE', alignment: 'center' },
    { name: 'LList', alignment: 'left' },
];
// Tạo đầu bảng
const tableHeader = tableFormat.map((col) => col.name).join('\t|');
// Tạo nội dung bảng
const tableBody = result
.map((object) => tableFormat.map((col) => object[col.name]  || '').join('\t|'))
.join('\n');
// Ghi vào file result.txt
fs.writeFileSync('bestFirstSearch/result.txt', `${tableHeader}\n${tableBody}`, { flag: 'w' });