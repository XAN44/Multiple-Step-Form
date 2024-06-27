import React from "react";
import MainLeft from "../components/mainAPP/mainLeft";
import MainRight from "../components/mainAPP/mainRight";

import FormTs from "./components/formTs";

export default function Page() {
  return (
    <main className="w-screen h-screen flex items-center justify-center  space-x-36 ">
      <FormTs />
    </main>
  );
}
