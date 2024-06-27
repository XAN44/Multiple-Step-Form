import * as z from "zod";

interface DaysInMonth {
  [key: string]: number;
}

const daysInMonth: DaysInMonth = {
  "01": 31,
  "02": 28,
  "03": 31,
  "04": 30,
  "05": 31,
  "06": 30,
  "07": 31,
  "08": 31,
  "09": 30,
  "10": 31,
  "11": 30,
  "12": 31,
};

export const CheckForm = z
  .object({
    name: z.string().nonempty({ message: "โปรดกรอกชื่อ" }),
    lastname: z.string().nonempty({ message: "โปรดกรอกนามสกุล" }),
    day: z
      .string()
      .nonempty({ message: "โปรดระบุวันที่" })
      .regex(/^([1-9]|[12][0-9]|3[01])$/, {
        message: "โปรดระบุวันที่ให้ถูกต้อง",
      }),
    mouth: z
      .string()
      .nonempty({ message: "โปรดระบุเดือน" })
      .regex(/^(0[1-9]|1[0-2])$/, { message: "โปรดระบุเดือนให้ถูกต้อง" }),
    year: z
      .string()
      .nonempty({ message: "โปรดระบุปีเกิด" })
      .regex(/^(19|20)\d{2}$/, {
        message: "โปรดระบุปีเกิดให้ถูกต้อง (ระหว่าง 1900 ถึง 2099)",
      }),

    sex: z.string().nonempty({ message: "โปรดเลือกเพศ" }),
    email: z
      .string()
      .nonempty({ message: "โปรดระบุ Email" })
      .email("โปรดกรอกรูปแบบ Email ให้ถูกต้อง"),
    password: z
      .string()
      .nonempty({ message: "ระบุรหัสผ่าน" })
      .min(8, "รหัสผ่านต้องมีมากกว่า 8 ตัวอักษร"),
    confirmPw: z
      .string()
      .nonempty({ message: "ระบุรหัสผ่าน" })
      .min(8, "รหัสผ่านต้องมีมากกว่า 8 ตัวอักษร"),
  })
  .refine(
    (data) => {
      const month = data.mouth;
      const day = parseInt(data.day, 10);

      // Check if the day is valid for the selected month
      return day <= daysInMonth[month];
    },
    {
      path: ["day"],
      message: "โปรดระบุวันที่ให้ถูกต้องตามเดือนที่เลือก",
    }
  )
  .refine((data) => data.password === data.confirmPw, {
    path: ["confirmPw"],
    message: "รหัสผ่านไม่ตรงกัน",
  });
