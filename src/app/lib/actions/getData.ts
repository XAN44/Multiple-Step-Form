"use server";
import { getCurrentUser } from "../../components/session";
import { db } from "../db";

export async function GetData() {
  // * ใช้ session ตรวจสอบกับข้อมูลใน database หากมีตรงกัน แสดงว่าผู้ใช้คนนั้นได้ทำการเข้าสู่ระบบมาแล้ว
  const session = await getCurrentUser();
  if (!session) {
    return null;
  }

  try {
    const dataUser = await db.user.findFirst({
      where: {
        email: session.email || "",
      },
      include: {
        Birthday: true,
      },
    });
    return dataUser;
  } catch (error) {}
}
