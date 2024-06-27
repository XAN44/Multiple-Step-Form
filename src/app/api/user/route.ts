import { NextResponse } from "next/server";
import { db } from "../../lib/db";

import * as z from "zod";
import { hash } from "bcrypt";

export const CheckForm = z.object({
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
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, name, lastname, password, day, mouth, year, sex } =
      CheckForm.parse(body);

    // * ตรวจสอบว่าอีเมลล์ที่ผู้ใช้ได้สมัคร ซ้ำกับในฐานข้อมูลหรือไม่
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    // ! หากซ้ำ ให้ Return เป็นข้อความดังนี้
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          error: "อีเมล์นี้มีการใช้งานแล้ว!!",
        },
        { status: 400 }
      );
    }

    const hashPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name: name,
        email: email,
        lastname: lastname,
        password: hashPassword,
        sex: sex,
        Birthday: {
          create: {
            day: day,
            mouth: mouth,
            year: year,
          },
        },
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({ user: rest }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดบางอย่าง" },
      { status: 401 }
    );
  }
}
