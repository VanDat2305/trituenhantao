class Nut {
    constructor(ten, hamUocLuong) {
        this.ten = ten; // Tên của nút
        this.hamUocLuong = hamUocLuong; // Hàm ước lượng chi phí từ nút hiện tại đến đích
        this.ketNoi = []; // Danh sách các nút kề
    }

    themKetNoi(nut) {
        this.ketNoi.push(nut);
    }
}

function timKiemTotNhat(start, goal) {
    let danhSachChoXet = []; // Danh sách các nút cần khám phá
    let danhSachDaXet = new Set(); // Danh sách các nút đã khám phá
    let chaCuaNut = new Map(); // Lưu trữ nút cha của mỗi nút

    danhSachChoXet.push(start);
    chaCuaNut.set(start, null); // Nút bắt đầu không có nút cha

    while (danhSachChoXet.length > 0) {
        // Sắp xếp danhSachChoXet dựa trên giá trị hàm ước lượng tăng dần
        danhSachChoXet.sort((a, b) => a.hamUocLuong - b.hamUocLuong);

        // Lấy nút có giá trị hàm ước lượng thấp nhất
        let nutHienTai = danhSachChoXet.shift();
        console.log('Xet nut: ' + nutHienTai.ten);

        // Kiểm tra xem đã đến đích chưa
        if (nutHienTai.ten === goal.ten) {
            console.log('Da tim thay dich: ' + nutHienTai.ten);
            // Vẽ lại đường đi
            veDuongDi(start, nutHienTai, chaCuaNut);
            return;
        }

        // Thêm nút hiện tại vào danh sách đã khám phá
        danhSachDaXet.add(nutHienTai);

        // Duyệt qua các nút kề
        for (let ketNoi of nutHienTai.ketNoi) {
            if (!danhSachDaXet.has(ketNoi) && !danhSachChoXet.includes(ketNoi)) {
                danhSachChoXet.push(ketNoi);
                // Lưu thông tin nút cha
                chaCuaNut.set(ketNoi, nutHienTai);
            }
        }
    }

    console.log('Khong tim thay duong di den dich.');
}

function veDuongDi(start, goal, chaCuaNut) {
    let duongDi = [];
    let nutHienTai = goal;

    // Xây dựng đường đi từ đích về điểm bắt đầu
    while (nutHienTai !== null) {
        duongDi.unshift(nutHienTai.ten); // Thêm nút vào đầu mảng
        nutHienTai = chaCuaNut.get(nutHienTai);
    }

    console.log('Duong di tu ' + start.ten + ' den ' + goal.ten + ': ' + duongDi.join(' -> '));
}

// Tạo đồ thị
let A = new Nut('A', 10);
let B = new Nut('B', 6);
let C = new Nut('C', 5);
let D = new Nut('L', 7);
let E = new Nut('E', 3);
let F = new Nut('I', 20);
let G = new Nut('G', 0); // Đích

// Kết nối các nút
A.themKetNoi(B);
A.themKetNoi(C);
B.themKetNoi(D);
B.themKetNoi(E);
C.themKetNoi(F);
D.themKetNoi(G);
E.themKetNoi(G);
F.themKetNoi(G);

// Gọi hàm tìm kiếm Tốt Nhất từ A đến G
timKiemTotNhat(A, G);
