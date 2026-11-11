# LASER LAB – Grade 9

Website học tập tương tác cho chủ đề Thiết kế và cắt laser, gồm 8 tiết (4 buổi × 2 tiết × 40 phút), bám sát khung chương trình năm học 2026–2027 của Trường THCS và THPT Đinh Thiện Lý.

## Chạy trên máy

Yêu cầu Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Kiểm tra trước khi phát hành:

```bash
npm test
npm run build
```

## Cập nhật nội dung

- `src/data/lessons.ts`: nội dung, KUD, lab, practice và ngân hàng 8 câu/bài.
- `src/config/canvasAssignments.ts`: URL bài tập Canvas. Để chuỗi rỗng nếu giáo viên chưa cung cấp.
- `src/config/siteConfig.ts`: tên trường, năm học, lớp và ngưỡng đạt.
- `src/lib/certificate.ts`: bố cục và nội dung chứng nhận PDF.

## Tiến trình học sinh

Hồ sơ và tiến trình chỉ lưu trong `localStorage` của trình duyệt. Trang Thông tin và tiến trình cho phép xuất/nhập JSON có kiểm tra schema. Chứng nhận xác nhận hoàn thành nội dung trực tuyến, không thay thế điểm chính thức hoặc đánh giá sản phẩm trên Canvas.

## GitHub Pages

1. Đưa mã nguồn lên nhánh `main` của GitHub repository.
2. Trong **Settings → Pages**, chọn **GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` tự kiểm tra, build và phát hành thư mục `dist`.

Vite dùng `base: './'` và ứng dụng không phụ thuộc route phía máy chủ, vì vậy hoạt động trong repository path và không lỗi 404 khi tải lại.
