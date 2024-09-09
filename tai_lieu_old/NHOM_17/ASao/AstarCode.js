const fs = require('fs')
const lines = fs.readFileSync('input.txt', 'utf8').replace(/\r/g, ' ').split('\n');
let [start, end] = lines[0].split(' ');
const edges = lines.slice(1).map((line) => {
    const [a, b, C] = line.split(' ');
    return [a.substring(0,1), b, C];
});
function createDirectedGraph(edges) {
    let graph = {};
    for (let edge of edges) {
        let [a, b, c] = edge;
        if (!graph[a]) graph[a] = [];
        graph[a].push([b,c]);
    }
    return graph;
}
let graph = createDirectedGraph(edges);
let result = []
let Q = []
let L = []
let currentPath = [];
let minRoad = 0;
Q.push(start);
L.push(start);
let process =[]
process.push(start)
while (L.length > 0 && start.substring(0,1) !== end.substring(0,1)) {
    currentPath.push(L[0]?.split(',').map(point => point.substring(0, 1)));
    start = L.shift().substring(0,1);
    process.shift().substring(0,1);
    let nextStates = [];
    let K =[]
    let H =[]
    let G =[]
    let F = []
    let k =0
    let h = 0
    let g = 0
    let f = 0
    if(start.substring(0,1) === end.substring(0,1)){
        result.push({
            'TT': start,
            'KE': start.substring(0,1) === end.substring(0,1) ?  `TTKT-Dung duong tong la ${currentPath.reverse().join('<-')} tổng là ${minRoad}`: nextStates.join(","),
            'k(u,v)': K.join(","),
            'h(v)': H.join(","),
            'g(v)':G.join(","),
            'f(v)': F.join(","),
            'LList': start.substring(0,1) !== end.substring(0,1) ? L.join(",") : ''
        });
        break;
    }
    if(graph[start]){
        for (let neighbor of graph[start]) {
            const [a,b] = neighbor;
            k=parseInt(b)
            h = parseInt(a.substring(1))
            g = parseInt(b) + minRoad
            f = g+h
            nextStates.push(a.substring(0,1));
            L.push(`${a.substring(0,1)}${f}`);
            process.push(`${a.substring(0,1)}${f}-${g}`)
            K.push(k)
            H.push(h)
            G.push(g)
            F.push(f)
        }
    }
    L.sort(function(a, b) {
        return parseInt(a.substring(1)) - parseInt(b.substring(1));
    })
    process.sort(function(a, b) {
        return parseInt(a.substring(1)) - parseInt(b.substring(1));
    })
    process[0]? minRoad = parseInt(process[0]?.substring(3).replace('-','')): minRoad = 0
    result.push({
        'TT': start,
        'KE': nextStates.join(","),
        'k(u,v)': K.join(","),
        'h(v)': H.join(","),
        'g(v)':G.join(","),
        'f(v)': F.join(","),
        'LList': start.substring(0,1) !== end.substring(0,1) ? L.join(",") : ''
    });
    
}
console.table(result);
const tableFormat = [
    { name: 'TT', alignment: 'center' },
    { name: 'KE', alignment: 'center' },
    { name: 'k(u,v)', alignment: 'center' },
    { name: 'h(v)', alignment: 'center' },
    { name: 'g(v)', alignment: 'center' },
    { name: 'f(v)', alignment: 'center' },
    { name: 'LList', alignment: 'left' },
];

// Tạo đầu bảng
const tableHeader = tableFormat.map((col) => col.name).join('\t|');
// Tạo nội dung bảng
const tableBody = result
.map((object) => tableFormat.map((col) => object[col.name]  || '').join('\t|'))
.join('\n');
// Ghi vào file result.txt
fs.writeFileSync('result.txt', `${tableHeader}\n${tableBody}`, { flag: 'w' });