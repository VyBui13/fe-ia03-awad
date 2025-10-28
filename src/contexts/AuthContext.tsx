import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo Provider (component bao bọc)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Kiểm tra localStorage khi app mới tải
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (e) {
      console.error("Failed to load token", e);
    } finally {
      setIsLoading(false); // 2. Dù thành công hay thất bại, cũng tắt loading
    }
  }, []);

  // 2. Hàm Login
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("accessToken", newToken); // Lưu vào localStorage
  };

  // 3. Hàm Logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem("accessToken"); // Xóa khỏi localStorage
  };

  // 4. Trạng thái đã xác thực
  const isAuthenticated = !!token; // Nếu có token -> true

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 5. Tạo một custom Hook để dễ dàng sử dụng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
