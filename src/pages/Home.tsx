import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CircleFadingArrowUpIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function HomePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <Button
        variant="default"
        className="mt-6 bg-red-500 text-white hover:bg-red-900 cursor-pointer"
        onClick={handleLogout}
      >
        Logout
        <CircleFadingArrowUpIcon />
      </Button>
    </div>
  );
}
