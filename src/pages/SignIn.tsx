import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";

// 1. Schema Validation (tương tự SignUp)
const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ." }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu." }), // Chỉ cần không trống
});

const loginUser = async (values: z.infer<typeof formSchema>) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/user/login`,
    values
  );
  return data; // data này sẽ chứa { accessToken: "..." }
};

export default function SignInPage() {
  // 2. Setup React Hook Form
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // 4. ĐĂNG NHẬP THÀNH CÔNG
      login(data.accessToken); // Lưu token vào Context và localStorage

      toast.success("Đăng nhập thành công!");
      navigate("/"); // Chuyển hướng về trang chủ
    },
    onError: (error: AxiosError) => {
      console.log("Lỗi đăng nhập:", error);
      // Xử lý lỗi (ví dụ: sai mật khẩu)
      toast.error(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu."
      );
    },
  });

  // 3. Hàm Submit (Mô phỏng) [cite: 41]

  // 5. Hàm Submit
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values); // Gọi API thật
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-sm p-8 border rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center">Đăng Nhập</h2>
          {/* Email field [cite: 40] */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Password field [cite: 40] */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Đang xử lý..." : "Đăng Nhập"}
          </Button>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-muted-foreground text-sm">Chưa có tài khoản?</p>
            <Button
              variant="link"
              onClick={() => navigate("/signup")}
              className="cursor-pointer text-blue-600"
            >
              Đăng ký
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
