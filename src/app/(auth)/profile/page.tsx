import React from "react";
import { GetData } from "../../lib/actions/getData";

async function Page() {
  const data = await GetData();

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className=" flex text-start items-center justify-center w-full h-full">
      <div className="text-black font-bold">
        <h1>เลขประจำตัว : {data?.id}</h1>
        <h1>ชื่อ : {data?.name}</h1>
        <h1>นามสกุล:{data?.lastname}</h1>
        <div> เพศ : {data?.sex}</div>
        {data?.Birthday.map((d, index) => (
          <div className="font-bold text-black grid " key={index}>
            <p className="">เกิดวันที่ {d.day}</p>
            <p>เดือน {d.mouth}</p>
            <p>ค.ศ {d.year}</p>
            <p>อายุ: {calculateAge(`${d.year}-${d.mouth}-${d.day}`)} ปี</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
