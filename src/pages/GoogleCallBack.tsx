import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth(); // Lấy thêm isAuthenticated
    const isCalled = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");
        if (code && !isCalled.current) {
            isCalled.current = true;
            const handleLogin = async () => {
                try {
                    const res = await axios.post("http://localhost:8080/api/auth/google", { code });
                    login(res.data.accessToken, res.data.refreshToken);
                } catch (error) {
                    navigate("/signin");
                }
            };
            handleLogin();
        }
    }, [searchParams]);

    // Khi hàm login chạy xong -> State update -> isAuthenticated thành true -> Effect này chạy
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return <div>Đang xử lý đăng nhập...</div>;
};

export default GoogleCallback;