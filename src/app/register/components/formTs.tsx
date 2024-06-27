"use client";
import { useState } from "react";
import { useForm, SubmitHandler, FieldName } from "react-hook-form";
import { z } from "zod";
import { CheckForm } from "../../lib/validation/ValidForm";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "postcss";

type inputs = z.infer<typeof CheckForm>;

const step = [
  {
    id: "Step 1",
    name: "Name",
    fields: ["name", "lastname"],
  },
  {
    id: "Step 2",
    name: "birthday",
    fields: ["day", "mouth", "year", "sex"],
  },
  {
    id: "Step 3",
    name: "email",
    fields: "email",
  },
  {
    id: "Step 4",
    name: "password",
    fields: ["password", "confirmPassword"],
  },
  {
    id: "Step 5",
    name: "Complete",
  },
];

export default function FormTs() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<{
    status: number;
    message: string | null;
  }>({
    status: 0,
    message: null,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<inputs>({
    resolver: zodResolver(CheckForm),
    defaultValues: {
      name: "",
      lastname: "",
      day: "",
      mouth: "",
      year: "",
      sex: "",
      email: "",
      password: "",
      confirmPw: "",
    },
  });

  type FieldName = keyof inputs;
  const next = async () => {
    const fields = step[currentStep].fields;
    const output = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < step.length - 1) {
      if (currentStep === step.length - 2) {
        const isValidPassword = await trigger(["password", "confirmPw"]);
        if (!isValidPassword) return;
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };
  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };
  const processForm: SubmitHandler<inputs> = async (data) => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        sex: data.sex,
        day: data.day,
        mouth: data.mouth,
        year: data.year,
      }),
    });

    if (response.ok) {
      reset();
      setSubmitStatus({ status: response.status, message: null });
    } else {
      const errorData = await response.json();
      setSubmitStatus({ status: response.status, message: errorData.error });
      console.error("เกิดข้อผิดพลาดบางอย่าง", response.statusText);
    }
  };

  return (
    <main className="grid items-center  h-full w-full space-x-36 p-96 ">
      <form onSubmit={handleSubmit(processForm)} className="flex w-full">
        {currentStep === 0 && (
          <>
            <div className="basis-1/2">
              <div className=" grid grid-cols-1 items-center justify-center text-start space-y-7">
                <h1 className="text-5xl">สร้างบัญชี</h1>
                <p className="text-lg">ป้อนชื่อของคุณ</p>
              </div>{" "}
            </div>
            <div className="basis-1/2">
              <div className="grid grid-cols-1 text-center items-center justify-center space-y-6">
                <input
                  id="name"
                  type="text"
                  className="
          input ring-1 ring-black bg-slate-100 
          input-bordered focus:ring-1 focus:ring-blue-600 
          w-full h-20 text-2xl
           "
                  placeholder="ชื่อ"
                  {...register("name")}
                />
                {errors.name?.message && (
                  <p className="text-red-800">{errors.name.message}</p>
                )}
                <input
                  id="lastname"
                  type="text"
                  className="
          input ring-1 ring-black bg-slate-100 
          input-bordered focus:ring-1 focus:ring-blue-600 
          w-full h-20 text-2xl
           "
                  placeholder="นามสกุล"
                  {...register("lastname")}
                />
                {errors.lastname?.message && (
                  <p className="text-red-800">{errors.lastname.message}</p>
                )}
              </div>
            </div>
          </>
        )}
        {currentStep === 1 && (
          <>
            <div className="basis-1/2">
              <div className=" grid grid-cols-1 items-center justify-center text-start space-y-7">
                <h1 className="text-5xl">ข้อมูลพื้นฐาน</h1>
                <p className="text-lg">ป้อนวันเกิดและเพศของคุณ</p>
              </div>
            </div>
            <div className="basis-1/2">
              <div
                className="
            grid grid-cols-3 
            text-center items-center justify-center  
            space-x-4
            ">
                <div className="">
                  <input
                    id="day"
                    type="text"
                    className="
                input ring-1 ring-black bg-slate-100 
                input-bordered focus:ring-1 focus:ring-blue-600 
                w-full h-20 text-2xl
                "
                    placeholder="วัน"
                    {...register("day")}
                  />
                  {errors.day?.message && (
                    <p className="text-red-800">{errors.day.message}</p>
                  )}
                </div>
                <div className="">
                  <select
                    className="
            input ring-1 ring-black bg-slate-100 
            input-bordered focus:ring-1 focus:ring-blue-600 
            w-full h-20 text-2xl text-start
            select 
          "
                    id="mouth"
                    {...register("mouth")}>
                    <option value="" disabled>
                      เดือน
                    </option>
                    <option value="01">มกราคม</option>
                    <option value="02">กุมภาพันธ์</option>
                    <option value="03">มีนาคม</option>
                    <option value="04">เมษายน</option>
                    <option value="05">พฤษภาคม</option>
                    <option value="06">มิถุนายน</option>
                    <option value="07">กรกฎาคม</option>
                    <option value="08">สิงหาคม</option>
                    <option value="09">กันยายน</option>
                    <option value="10">ตุลาคม</option>
                    <option value="11">พฤศจิกายน</option>
                    <option value="12">ธันวาคม</option>
                  </select>
                  {errors.mouth?.message && (
                    <p className="text-red-800">{errors.mouth.message}</p>
                  )}
                </div>
                <div className="">
                  <input
                    type="text"
                    className="
                input ring-1 ring-black bg-slate-100 
                input-bordered focus:ring-1 focus:ring-blue-600 
                w-full h-20 text-2xl
                "
                    id="year"
                    placeholder="ปี"
                    {...register("year")}
                  />
                  {errors.year?.message && (
                    <p className="text-red-800">{errors.year.message}</p>
                  )}
                </div>
              </div>
              <select
                className=" 
                 input ring-1 ring-black bg-slate-100 
                 input-bordered focus:ring-1 focus:ring-blue-600 
                 w-full h-20 text-2xl text-start mt-3 col-span-3 row-span-3
                 select"
                id="sex"
                {...register("sex")}>
                <option value="ชาย">เพศชาย</option>
                <option value="หญิง">เพศหญิง</option>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
              </select>
              {errors.sex?.message && (
                <p className="text-red-800">{errors.sex.message}</p>
              )}
            </div>
          </>
        )}
        {currentStep === 2 && (
          <>
            <div className="basis-1/2">
              <div className=" grid grid-cols-1 items-center justify-center text-start space-y-7">
                <h1 className="text-5xl">สร้างอีเมล</h1>
                <p className="text-lg">ป้อนอีเมลของคุณ</p>
              </div>{" "}
            </div>
            <div className="basis-1/2">
              <div className="grid grid-cols-1 text-center items-center justify-center space-y-6">
                <input
                  type="email"
                  id="email"
                  className="
          input ring-1 ring-black bg-slate-100 
          input-bordered focus:ring-1 focus:ring-blue-600 
          w-full h-20 text-2xl
           "
                  placeholder="อีเมล"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="text-red-800">{errors.email.message}</p>
                )}
              </div>
            </div>
          </>
        )}
        {currentStep === 3 && (
          <>
            <div className="basis-1/2">
              <div className=" grid grid-cols-1 items-center justify-center text-start space-y-10">
                <h1 className="text-5xl">สร้างรหัสผ่านที่รัดกุม</h1>
                <p className="text-lg">
                  สร้างรหัสผ่านที่รัดกุมซึ่งมีทั้งตัวอักษร ตัวเลข และสัญลักษณ์
                </p>
              </div>
            </div>
            <div className="basis-1/2">
              <div className="grid grid-cols-1 text-center items-center justify-center space-y-7">
                <input
                  id="password"
                  type="password"
                  className="
          input ring-1 ring-black bg-slate-100 
          input-bordered focus:ring-1 focus:ring-blue-600 
          w-full h-20 text-2xl
           "
                  placeholder="รหัสผ่าน"
                  {...register("password")}
                />
                {errors.password?.message && (
                  <p className="text-red-800">{errors.password.message}</p>
                )}
                <input
                  id="confirmPassword"
                  type="password"
                  className="
          input ring-1 ring-black bg-slate-100 
          input-bordered focus:ring-1 focus:ring-blue-600 
          w-full h-20 text-2xl
           "
                  placeholder="ยืนยันรหัสผ่าน"
                  {...register("confirmPw")}
                />
                {errors.confirmPw?.message && (
                  <p className="text-red-800">{errors.confirmPw.message}</p>
                )}
              </div>
            </div>
          </>
        )}
      </form>
      {currentStep === 4 && (
        <>
          {submitStatus.message ? (
            <>
              <div className="basis-1/2">
                <div className=" grid grid-cols-1 items-center justify-center text-start  ">
                  <h1 className="text-5xl text-red-800">เกิดข้อผิดพลาด !!</h1>
                  <p className="text-lg text-red-700">{submitStatus.message}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="basis-1/2">
                <div className="grid grid-cols-1 items-center justify-center text-start space-y-10">
                  <h1 className="text-5xl text-green-500">สมัครสมาชิกสำเร็จ</h1>
                  <p className="text-lg">
                    คลิกที่ปุ่มเข้าสู่ระบบ เพื่อเข้าสู่หน้าโปรไฟล์ของคุณ
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}
      <div className="flex justify-end pt-6 space-x-5">
        {currentStep > 0 && (
          <button
            className="btn btn-primary rounded-full text-md text-white w-24"
            onClick={prev}>
            Back
          </button>
        )}
        {currentStep < 4 ? (
          <button
            type="button"
            className="btn btn-primary rounded-full text-md text-white w-24"
            onClick={next}>
            Next
          </button>
        ) : (
          <Link href="/">
            <p className="btn btn-primary rounded-full text-md text-white w-24">
              Login
            </p>
          </Link>
        )}
      </div>
    </main>
  );
}
