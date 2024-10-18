const fs = require('fs');

// Hàm đọc dữ liệu từ file và xử lý đầu vào
function docDoThiTuFile(filename) {
  const duLieu = fs.readFileSync(filename, 'utf8').split('\n');
  const doThi = {};
  let batDau = null;
  let ketThuc = null;

  // Đọc từng dòng của tệp
  for (let i = 0; i < duLieu.length; i++) {
    const dong = duLieu[i].trim();
    if (dong === '' || dong.startsWith('#')) continue;

    const phanTu = dong.split(' ');
    
    if (phanTu[0] === 'START') {
      batDau = phanTu[1];
    } else if (phanTu[0] === 'FINISH') {
      ketThuc = phanTu[1];
    } else if (phanTu.length === 2) {
      // Đọc các cạnh
      const [tu, den] = phanTu;
      if (!doThi[tu]) {
        doThi[tu] = [];
      }
      doThi[tu].push(den);
    }
  }
  
  return { doThi, batDau, ketThuc };
}

// Hàm dfs để tìm đường đi từ start đến finish
function dfs(doThi, batDau, ketThuc) {
  let L = [batDau];
  let visited = new Set();
  let parent = {};
  let result = [];

  // Khởi tạo trạng thái bắt đầu
  visited.add(batDau);
  
  while (L.length > 0) {
    
    let u = L.pop();
    
    // Kiểm tra nếu u là trạng thái kết thúc
    if (u === ketThuc) {
      let path = buildPath(parent, batDau, ketThuc);
      result.push({
        TTPT: u,
        TTKE: `TTKT-Dung duong di la ${path.join(' -> ')}`,
        danhSachL: ''
      });
      break;
    }
    // Đối với mỗi trạng thái v kề với u
    let nextStates = doThi[u] || [];
    let remainingL = [...L];
    
    // Kết hợp L với nextStates, loại bỏ các đỉnh đã được duyệt
    let danhSachL = [...new Set([...remainingL, ...nextStates.filter(v => !visited.has(v))])];
    
    result.push({
      TTPT: u,
      TTKE: nextStates.sort().join(', '), // Các đỉnh kề
      danhSachL: danhSachL.join(', ') 
    });
    

    for (let v of nextStates) {
      if (!visited.has(v)) {
        L.push(v); 
        visited.add(v);
        parent[v] = u;
      }
    }
  }

  // Nếu không tìm thấy đường
  if (result.length === 0) {
    result.push({
      TTPT: batDau,
      TTKE: `TTKT-Khong tim thay duong di tu ${batDau} den ${ketThuc}`,
      danhSachL: danhSachL.join(', ')
    });
  }

  return result;
}

// Hàm để xây dựng đường đi từ start đến goal
function buildPath(parent, start, goal) {
  let path = [goal];
  while (path[path.length - 1] !== start) {
    path.push(parent[path[path.length - 1]]);
  }
  path.reverse();
  return path;
}

// Chạy chương trình với file input
const tenFile = 'input.txt';
const { doThi, batDau, ketThuc } = docDoThiTuFile(tenFile);
const result = bfs(doThi, batDau, ketThuc);

// Định dạng bảng kết quả
const tableFormat = [
  { name: 'TTPT', alignment: 'left' },
  { name: 'TTKE', alignment: 'left' },
  { name: 'danhSachL', alignment: 'left' },
];

// Tạo tiêu đề bảng
const maxLengths = result.reduce((acc, obj) => {
  tableFormat.forEach(col => {
    const length = obj[col.name] ? obj[col.name].length : 0;
    acc[col.name] = Math.max(acc[col.name] || 0, length, col.name.length);
  });
  return acc;
}, {});

// Tạo tiêu đề bảng với độ dài tối đa đã tính
const tableHeader = tableFormat.map(col => col.name.padEnd(maxLengths[col.name])).join(' | ');

// Tạo thân bảng từ dữ liệu kết quả
const tableBody = result.map(object =>
  tableFormat.map(col => (object[col.name] || '').padEnd(maxLengths[col.name])).join(' | ')
).join('\n');

// Ghi kết quả vào tệp tin result.txt
fs.writeFileSync('output.txt', `${tableHeader}\n${tableBody}`, { flag: 'w' });
