"use client";
import { z } from "zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from "../../lib/validation/validLogin";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Inputs = z.infer<typeof LoginSchema>;

const step = [
  {
    id: "Step 1",
    name: "Login",
    fields: ["email"],
  },
  {
    id: "Step 2",
    name: "password",
    fields: "password",
  },
];

export default function Formlogin() {
  const router = useRouter();
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
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = step[currentStep].fields;
    const output = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });
    if (!output) return;
    if (currentStep < step.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep(currentStep - 1);
    }
  };

  const processForm: SubmitHandler<Inputs> = async (data) => {
    const signInData = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInData?.error) {
      if (signInData.error === "401 Unauthorized") {
        setSubmitStatus({
          status: signInData.status,
          message: signInData.error,
        });
      } else {
        setSubmitStatus({
          status: signInData.status,
          message: "เกิดปัญหาบางอย่าง โปรดลองใหม่อีกครั้ง",
        });
      }
    } else {
      router.push(`/profile`);
    }
  };

  return (
    <main className="grid items-center h-full w-full space-x-36 p-96">
      <form onSubmit={handleSubmit(processForm)} className="flex w-full">
        {currentStep === 0 && (
          <>
            <div className="basis-1/2">
              <div className="grid grid-cols-1 items-center justify-center text-start space-y-7">
                <h1 className="text-5xl">ลงชื่อเข้าใช้</h1>
                <p className="text-lg">เพื่อพาไปยังหน้า Profile ของคุณ</p>
              </div>
            </div>
            <div className="basis-1/2">
              <div className="grid grid-cols-1 text-center items-center justify-center space-y-6">
                <input
                  id="email"
                  type="text"
                  className="input ring-1 ring-black bg-slate-100 input-bordered focus:ring-1 focus:ring-blue-600 w-full h-20 text-2xl"
                  placeholder="อีเมลล์"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-800">{errors.email.message}</p>
                )}
              </div>
            </div>
          </>
        )}
        {currentStep === 1 && (
          <>
            <div className="basis-1/2">
              <div className="grid grid-cols-1 items-center justify-center text-start space-y-7">
                <h1 className="text-5xl">รหัสผ่าน</h1>
                <p className="text-lg">โปรดกรอกรหัสผ่านอันรัดกุมของคุณ</p>
              </div>
            </div>
            <div className="basis-1/2">
              <div className="grid grid-cols-1 text-center items-center justify-center space-y-6">
                <input
                  id="password"
                  type="password"
                  className="input ring-1 ring-black bg-slate-100 input-bordered focus:ring-1 focus:ring-blue-600 w-full h-20 text-2xl"
                  placeholder="รหัสผ่าน"
                  {...register("password")}
                />

                {submitStatus.message && (
                  <div className="text-center mt-3 text-red-900 text-lg">
                    {submitStatus.message}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </form>
      <div className="flex justify-end pt-6 space-x-5">
        {currentStep > 0 && (
          <button
            className="btn btn-primary rounded-full text-md text-white w-24"
            onClick={prev}>
            Back
          </button>
        )}
        {currentStep === step.length - 1 && (
          <button
            type="submit"
            className="btn btn-primary rounded-full text-md text-white w-24"
            onClick={handleSubmit(processForm)}>
            เข้าสู่ระบบ
          </button>
        )}
        {currentStep < step.length - 1 && (
          <div className="flex items-center justify-center space-x-3">
            <Link href="/register">
              <button type="button" className="text-md text-blue-800 w-24">
                สร้างบัญชี
              </button>
            </Link>
            <button
              type="button"
              className="btn btn-primary rounded-full text-md text-white w-24"
              onClick={next}>
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
