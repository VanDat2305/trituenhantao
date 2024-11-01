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
    if (dong === '' || dong.startsWith('#')) continue; // Bỏ qua dòng trống hoặc dòng comment

    const phanTu = dong.split(' ');
    
    // Phân tích dòng START và FINISH
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
      doThi[tu].push(den); // Đồ thị có hướng
    }
  }
  
  return { doThi, batDau, ketThuc };
}

// Hàm dfs để tìm đường đi từ start đến finish
function dfs(doThi, batDau, ketThuc) {
  let L = [batDau]; // Danh sách lưu các trạng thái cần khám phá
  let visited = new Set(); // Tập các đỉnh đã được duyệt
  let parent = {}; // Để lưu lại các bước trước đó
  let result = []; // Danh sách lưu kết quả từng bước

  // Khởi tạo trạng thái bắt đầu
  visited.add(batDau);
  
  while (L.length > 0) {
    
    let u = L.pop(); // Loại bỏ trạng thái u ở đầu danh sách L
    
    // Kiểm tra nếu u là trạng thái kết thúc
    if (u === ketThuc) {
      let path = buildPath(parent, batDau, ketThuc);
      result.push({
        TTPT: u,
        TTKE: `TTKT-Dung duong di la ${path.join(' -> ')}`, // Đường đi từ đỉnh bắt đầu đến đỉnh kết thúc
        danhSachL: '', // Danh sách các đỉnh còn lại trong L
        danhSachQ: ''
      });
      break;
    }
    // Đối với mỗi trạng thái v kề với u
    let nextStates = doThi[u] || [];
    let remainingL = [...L]; // Tạo bản sao của L để giữ danh sách các đỉnh còn lại
    
    // Kết hợp L với nextStates, loại bỏ các đỉnh đã được duyệt
    let danhSachL = [...new Set([...remainingL, ...nextStates.filter(v => !visited.has(v))])];
    
    

    result.push({
      TTPT: u,
      TTKE: nextStates.sort().join(', '), // Các đỉnh kề
      danhSachL: danhSachL.reverse().join(', '), // Danh sách các đỉnh còn lại trong L
      danhSachQ:  [...new Set([...Array.from(visited), ...danhSachL])].join(', ')
    });
    

    for (let v of nextStates) {
      if (!visited.has(v)) {
        L.push(v); // Đặt v vào danh sách L
        visited.add(v); // Đánh dấu v đã duyệt
        parent[v] = u; // Ghi lại cha của đỉnh v
      }
    }
  }

  // Nếu không tìm thấy đường
  if (result.length === 0) {
    result.push({
      TTPT: batDau,
      TTKE: `TTKT-Khong tim thay duong di tu ${batDau} den ${ketThuc}`,
      danhSachL: danhSachL.join(', '),
      danhSachQ: ''
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
  path.reverse(); // Đảo ngược mảng để có đường đi từ start đến goal
  return path;
}

// Chạy chương trình với file input
const tenFile = 'input.txt';
const { doThi, batDau, ketThuc } = docDoThiTuFile(tenFile);
const result = dfs(doThi, batDau, ketThuc);

// Định dạng bảng kết quả
const tableFormat = [
  { name: 'TTPT', alignment: 'left' },
  { name: 'TTKE', alignment: 'left' },
  { name: 'danhSachL', alignment: 'left' },
  { name: 'danhSachQ', alignment: 'left' },
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
