import { usePathname } from "next/navigation";
import { useMemo } from "react";

const useRoutePage = () => {
  const pathName = usePathname();

  //*ใช้ UseMemo เพื่อจดจำค่าล่าสุดไว้ เพื่อประหยัดการคำนวณที่ไม่จำเป็น
  const routes = useMemo(
    () => [
      {
        active: pathName === "/",
        Header: "ลงชื่อเข้าใช้",
        paragraph: "เพื่อไปยัง Profile ของคุณ",
      },
      {
        active: pathName === "/register",
        Header: "สร้างบัญชี Google",
        paragraph: "ป้อนชื่อของคุณ",
      },
    ],
    [pathName]
  );
  return routes.filter((route) => route.active);
};
export default useRoutePage;
