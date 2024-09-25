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
    } else if (phanTu.length === 3) {
      // Đọc các cạnh với trọng số (tu, den, trongSo)
      const [tu, den, trongSo] = phanTu;
      if (!doThi[tu]) {
        doThi[tu] = [];
      }
      doThi[tu].push({ den, trongSo: parseInt(trongSo, 10) }); // Lưu đỉnh và trọng số
    }
  }
  
  return { doThi, batDau, ketThuc };
}

// Hàm leo đồi với trọng số, bổ sung sắp xếp danh sách L1
function hillClimbing(doThi, batDau, ketThuc) {
  
  let L = [batDau]; // Danh sách L ban đầu
  let visited = new Set();
  let result = [];
  let duongDi = [];
  let TT = 1; // Đếm số thứ tự

  while (L.length > 0) {
    let u = L.shift(); // Loại bỏ trạng thái đầu tiên trong L
    visited.add(u);
    duongDi.push(u);

    if (u === ketThuc) {
      result.push({
        TT: TT++,
        TTPT: u,
        TTKE: `TTKT-Den dich ${ketThuc}`,
        L1: '',
        L: L.join(', ') || 'None'
      });
      break;
    }
    // console.log(doThi[u]);
    
    const neighbors = doThi[u] || [];
    
    let L1 = [];

    // Thêm các trạng thái kề vào L1, không trùng với các trạng thái đã thăm
    for (const { den, trongSo } of neighbors) {
      if (!visited.has(den)) {
        L1.push({ den, trongSo });
      }
    }
    
    // Sắp xếp L1 theo thứ tự tăng dần của trọng số
    L1.sort((a, b) => a.trongSo - b.trongSo);
    
    
    // Cập nhật L1 thành chỉ các đỉnh
    let L1_dinh = L1.map(n => n.den);

    // Thêm các đỉnh trong L1 vào đầu danh sách L (sau khi sắp xếp)
    L = [...L1_dinh, ...L];

    // Lưu kết quả từng bước
    result.push({
      TT: TT++,
      TTPT: u,
      TTKE: neighbors.map(n => `${n.den} (${n.trongSo})`).join(', '),
      L1: L1_dinh.join(', ') || 'None',
      L: L.join(', ') || 'None'
    });
  }

  // Nếu không tìm thấy đường
  if (L.length === 0 && result.length === 0) {
    result.push({
      TT: TT,
      TTPT: batDau,
      TTKE: `TTKT-Khong tim thay duong di tu ${batDau} den ${ketThuc}`,
      L1: '',
      L: 'None'
    });
  }

  return { result, duongDi };
}
// Hàm ghi kết quả ra file
function ghiKetQuaRaFile(filename, result, duongDi) {
  const noiDung = [];
  noiDung.push("TT | TTPT   | TTKE                         | L1                | L");
  noiDung.push("------------------------------------------------------------------");

  result.forEach(row => {
    noiDung.push(`${row.TT.toString().padEnd(3)}| ${row.TTPT.padEnd(7)}| ${row.TTKE.padEnd(28)}| ${row.L1.padEnd(18)}| ${row.L}`);
  });

  // Thêm đường đi vào cuối file
  noiDung.push("\nĐường đi tìm được:");
  noiDung.push(duongDi.join(' -> ') || 'Không tìm thấy đường');

  // Ghi dữ liệu ra file
  fs.writeFileSync(filename, noiDung.join('\n'), 'utf8');
}

// Chạy chương trình với file input
const tenFileInput = 'input.txt';
const tenFileOutput = 'output.txt';
const { doThi, batDau, ketThuc } = docDoThiTuFile(tenFileInput);
const { result, duongDi } = hillClimbing(doThi, batDau, ketThuc);

// Ghi kết quả ra file output.txt
ghiKetQuaRaFile(tenFileOutput, result, duongDi);