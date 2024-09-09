const fs = require('fs')
const lines = fs.readFileSync('input.txt', 'utf8').replace(/\r/g, ' ').split('\n');
let [state, end] = lines[0].split(' ');
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
let result = [];
let Q = [];
let L = [];
Q.push(state);
L.push(state);
let uniqueL = new Set();
uniqueL.add(state);
let currentPath = [];
while (L.length > 0 && state !== end) {
  currentPath.push(L[0]);
  state = L.shift();
  let nextStates = [];
  if (graph[state]) {
    console.log(graph[state]);
    for (let neighbor of graph[state]) {
      nextStates.push(neighbor);
      if (!Q.includes(neighbor)) {
        Q.push(neighbor);
      }
    }
    nextStates.sort();
    for (let neighbor of nextStates) {
      if (!uniqueL.has(neighbor)) {
        L.push(neighbor);
        uniqueL.add(neighbor);
      }
    }
  }
  result.push({
    TT: state,
    KE: state !== end ? nextStates.join(",") : `TTKT-Dung duong di la ${currentPath.reverse().join('<--')} `,
    QList: state !== end ? Q.join(",") : '',
    LList: state !== end ? L.join(",") : ''
  });

}
const tableFormat = [
  { name: 'TT', alignment: 'center' },
  { name: 'KE', alignment: 'center' },
  { name: 'LList', alignment: 'left' },
];
console.table(result);
// Tạo đầu bảng
const tableHeader = tableFormat.map((col) => col.name).join('\t|');
// Tạo nội dung bảng
const tableBody = result
  .map((object) => tableFormat.map((col) => object[col.name] || '').join('\t|'))
  .join('\n');
// Ghi vào file result.txt
fs.writeFileSync('result.txt', `${tableHeader}\n${tableBody}`, { flag: 'w' });