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

// 1. Schema Validation (tương tự SignUp)
const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ." }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu." }), // Chỉ cần không trống
});

export default function SignInPage() {
  // 2. Setup React Hook Form
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Hàm Submit (Mô phỏng) [cite: 41]
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Dữ liệu Login (mô phỏng):", values);

    // Mô phỏng feedback thành công [cite: 41]
    toast.success("Đăng nhập thành công!");
    // Hoặc có thể mô phỏng chuyển hướng
    navigate("/");
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
          <Button type="submit" className="w-full">
            Đăng Nhập
          </Button>
        </form>
      </Form>
    </div>
  );
}
