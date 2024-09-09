class Nut {
    constructor(ten, giaTriHeuristic) {
        this.ten = ten; // Tên của nút
        this.giaTriHeuristic = giaTriHeuristic; // Giá trị heuristic của nút
        this.ketNoi = []; // Danh sách các nút kề
    }

    themKetNoi(nut) {
        this.ketNoi.push(nut);
    }
}

function leoDoi(start, mucTieu) {
    let hienTai = start;
    let duongDi = [hienTai.ten]; // Mảng lưu trữ đường đi
    console.log('Bắt đầu từ: ' + hienTai.ten);

    while (true) {
        // Tìm trạng thái kề tốt nhất
        let keTiep = null;
        let giaTriHeuristicToiUu = -Infinity; // Khởi tạo giá trị tốt nhất

        for (let ketNoi of hienTai.ketNoi) {
            // Xem xét các trạng thái kề
            if (ketNoi.giaTriHeuristic > giaTriHeuristicToiUu) {
                keTiep = ketNoi;
                giaTriHeuristicToiUu = ketNoi.giaTriHeuristic;
            }
        }

        // Nếu không có trạng thái kề tốt hơn, kết thúc thuật toán
        if (keTiep === null || keTiep.giaTriHeuristic <= hienTai.giaTriHeuristic) {
            console.log('Kết thúc. Trạng thái hiện tại: ' + hienTai.ten);
            // Vẽ lại đường đi
            veDuongDi(duongDi);
            return;
        }

        // Di chuyển đến trạng thái tốt nhất
        hienTai = keTiep;
        duongDi.push(hienTai.ten); // Thêm trạng thái vào đường đi
        console.log('Di chuyển đến: ' + hienTai.ten);

        // Kiểm tra xem có đạt được mục tiêu không
        if (hienTai.ten === mucTieu.ten) {
            console.log('Đã tìm thấy mục tiêu: ' + hienTai.ten);
            // Vẽ lại đường đi
            veDuongDi(duongDi);
            return;
        }
    }
}

function veDuongDi(duongDi) {
    console.log('Đường đi từ điểm bắt đầu đến mục tiêu: ' + duongDi.join(' -> '));
}

// Tạo các trạng thái
let A = new Nut('A', 7);
let B = new Nut('B', 12);
let C = new Nut('C', 14);
let D = new Nut('D', 9);
let E = new Nut('E', 18);
let F = new Nut('F', 11);
let G = new Nut('G', 16);
let H = new Nut('H', 13);
let I = new Nut('I', 21); // Mục tiêu

// Kết nối các nút
A.themKetNoi(B);
A.themKetNoi(C);
A.themKetNoi(D);
B.themKetNoi(E);
B.themKetNoi(F);
C.themKetNoi(G);
D.themKetNoi(H);
E.themKetNoi(I);
F.themKetNoi(I);
G.themKetNoi(I);
H.themKetNoi(I);

// Gọi hàm leo đồi từ A đến I
leoDoi(A, I);
