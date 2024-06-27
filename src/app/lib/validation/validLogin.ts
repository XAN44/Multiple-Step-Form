import * as z from "zod";

const LoginSchema = z.object({
  email: z.string().email("กรุณากรอกรูปแบบ Email ให้ถูกต้อง"),
  password: z.string(),
});

export default LoginSchema;
