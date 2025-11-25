# IA4 - React Authentication với JWT (Access + Refresh)

[cite_start]Dự án này là một ứng dụng web React (client-side) và NestJS (server-side) hoàn chỉnh, triển khai luồng xác thực an toàn sửT dụng JWT, bao gồm Access Token và Refresh Token[cite: 1, 4].

[cite_start]Ứng dụng sử dụng Axios cho các yêu cầu HTTP, React Query để quản lý trạng thái máy chủ, và React Hook Form để xử lý biểu mẫu[cite: 5].

## Tính năng chính

- **Đăng ký người dùng:** Tạo tài khoản mới.
- [cite_start]**Đăng nhập người dùng:** Lấy Access Token (lưu trong memory) và Refresh Token (lưu trong `localStorage`)[cite: 17, 21, 22].
- [cite_start]**Tự động Refresh Token:** Tự động lấy Access Token mới khi hết hạn bằng cách sử dụng Refresh Token mà không làm gián đoạn người dùng[cite: 19, 26].
- [cite_start]**Đăng xuất:** Xóa tất cả token và trạng thái đăng nhập[cite: 22].
- [cite_start]**Protected Routes:** Bảo vệ các trang dashboard, tự động chuyển hướng người dùng chưa đăng nhập về trang Sign In[cite: 45, 46].
- [cite_start]**Dashboard:** Trang được bảo vệ, hiển thị thông tin người dùng (ví dụ: email) bằng cách gọi API `/user/me`[cite: 48].

## 🛠️ Công nghệ sử dụng

- **Frontend:**
  - React (Vite)
  - [cite_start]React Query (TanStack Query) [cite: 5]
  - [cite_start]React Hook Form [cite: 5]
  - Zod (Validation)
  - [cite_start]Axios [cite: 5]
  - ShadCN UI (hoặc thư viện UI của bạn)
- **Backend:**
  - NestJS
  - MongoDB (Mongoose)
  - Passport.js (JWT Strategy)
  - bcrypt (Hashing mật khẩu)

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### A. Đăng ký MongoDB (Lấy Connection String)

Dự án này yêu cầu một cơ sở dữ liệu MongoDB.

1.  **Tạo tài khoản:**
    - Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
    - Đăng ký một tài khoản miễn phí.
2.  **Tạo Cluster miễn phí:**
    - Sau khi đăng nhập, chọn "Build a Database".
    - Chọn gói **M0 (Free)**, chọn nhà cung cấp đám mây và khu vực (ví dụ: AWS, Singapore).
    - Đặt tên cho cluster (ví dụ: `ia4-cluster`) và nhấn "Create".
3.  **Cấu hình bảo mật:**
    - Trong khi cluster đang được tạo (mất vài phút), vào mục "Network Access" ở menu bên trái.
    - Nhấn "Add IP Address" -> "Allow Access From Anywhere" (Địa chỉ IP: `0.0.0.0/0`). Nhấn "Confirm". _(Lưu ý: Chỉ dùng cách này cho development. Trong thực tế, bạn nên giới hạn IP của mình)._
    - Tiếp theo, vào "Database Access". Nhấn "Add New Database User". Tạo một user (ví dụ: `user: ia4` | `password: yourpassword123`). Ghi nhớ user/password này.
4.  **Lấy Connection String:**
    - Quay lại trang "Databases", khi cluster đã sẵn sàng, nhấn "Connect".
    - Chọn "Drivers" (hoặc "Connect your application").
    - Chọn "Node.js" và phiên bản mới nhất.
    - Bạn sẽ thấy một chuỗi kết nối (Connection String) giống như sau:
      `mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority`
    - Sao chép chuỗi này. Bạn sẽ cần nó cho biến `DATABASE_URL` của backend.

### B. Cài đặt Backend (NestJS)

1.  **Clone dự án (nếu có) và di chuyển vào thư mục backend:**
    ```bash
    git clone ...
    cd be-ia03 # (Hoặc tên thư mục backend của bạn)
    ```
2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```
3.  **Tạo file `.env`:**
    Tạo một file tên `.env` trong thư mục gốc của backend và sao chép nội dung từ `.env.sample` (nếu có) hoặc dùng mẫu dưới đây:

    **File: `be-ia03/.env`**

    ```env
    # 1. MongoDB
    # Thay <username>, <password>, và <cluster-name> bằng thông tin của bạn
    # Thêm tên database (ví dụ: "ia4") vào sau dấu /
    DATABASE_URI="mongodb+srv://<username>:<password>@management.g3iks.mongodb.net/?appName=<cluster-name>"
    FRONTEND_URL=http://localhost:5173

    # 2. JWT Secrets (Rất quan trọng)
    # Tạo 2 chuỗi ngẫu nhiên, phức tạp (ví dụ: dùng trang web tạo password)
    JWT_SECRET="YOUR_RANDOM_ACCESS_TOKEN_SECRET_KEY_HERE"
    JWT_REFRESH_SECRET="YOUR_RANDOM_REFRESH_TOKEN_SECRET_KEY_HERE"

    # 3. Token Expiration (Thời hạn token)
    ACCESS_TOKEN_EXPIRATION="15m"  # (15 phút)
    REFRESH_TOKEN_EXPIRATION="7d"   # (7 ngày)
    ```

4.  **Chạy server backend:**
    ```bash
    npm run start:dev
    ```
    Server sẽ chạy tại `http://localhost:3000` (hoặc port bạn cấu hình).

### C. Cài đặt Frontend (React)

1.  **Mở terminal mới và di chuyển vào thư mục frontend:**
    ```bash
    cd fe-ia03 # (Hoặc tên thư mục frontend của bạn)
    ```
2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```
3.  **Tạo file `.env`:**
    Tạo một file tên `.env` (hoặc `.env.local`) trong thư mục gốc của frontend:

    **File: `fe-ia03/.env`**

    ```env
    # URL trỏ đến server backend NestJS của bạn
    VITE_API_URL="http://localhost:3000"
    ```

4.  **Chạy server frontend:**
    ```bash
    npm run dev
    ```
    Ứng dụng React sẽ chạy tại `http://localhost:5173` (hoặc port Vite chọn). Bạn có thể truy cập trang này để bắt đầu.
