import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// 1. Định nghĩa Schema Validation bằng Zod
const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Vui lòng nhập email." })
      .email({ message: "Email không hợp lệ." }),
    password: z
      .string()
      .min(1, { message: "Vui lòng nhập mật khẩu." })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng nhập lại mật khẩu." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"], // Thêm 'path' để lỗi hiển thị đúng ô confirmPassword
  });

// 2. Định nghĩa kiểu dữ liệu cho API response (để xử lý lỗi)
interface ApiErrorResponse {
  message: string;
}

// 3. Logic gọi API đăng ký
const registerUser = async (values: z.infer<typeof formSchema>) => {
  const { email, password } = values;
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/user/register`, // [cite: 35]
    { email, password }
  );
  return data;
};

export default function SignUpPage() {
  const navigate = useNavigate();

  // 4. Setup React Query Mutation [cite: 45]
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Đăng ký thành công (mô phỏng):", data);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/signin"); // Chuyển hướng sang trang Login
    },
    onError: (error: AxiosError) => {
      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = (error.response.data as ApiErrorResponse).message;
      }
      toast.error(errorMessage);
    },
  });

  // 5. Setup React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 6. Hàm Submit
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values); // Gọi mutation của React Query
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-sm p-8 border rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center">Đăng Ký</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage /> {/* Hiển thị lỗi validation [cite: 49] */}
              </FormItem>
            )}
          />
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận Mật khẩu</FormLabel>
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
            {mutation.isPending ? "Đang xử lý..." : "Đăng Ký"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
