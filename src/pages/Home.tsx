// src/pages/HomePage.tsx
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query"; // <-- Import useQuery
import { fetchUserProfile } from "@/services/apiService"; // <-- Import hàm mới

export default function HomePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 1. Dùng useQuery để fetch dữ liệu user (Req 33)
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/signin"); // Chuyển hướng về signin (thay vì /login)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>

      {/* 2. Hiển thị thông tin user (Req 48) */}
      <div className="mt-6 p-4 border rounded-lg shadow-md">
        {isLoading && <p>Loading user data...</p>}
        {isError && <p className="text-red-500">Failed to load user data.</p>}
        {user && (
          <div>
            <p className="text-lg">
              Welcome, <span className="font-semibold">{user.email}</span>!
            </p>
            <p className="text-sm text-gray-600">User ID: {user._id}</p>
          </div>
        )}
      </div>

      <Button
        variant="default"
        className="mt-6 bg-red-500 text-white hover:bg-red-900 cursor-pointer"
        onClick={handleLogout}
      >
        Logout
        {/* Icon của bạn bị thiếu, tôi tạm bỏ qua */}
      </Button>
    </div>
  );
}
