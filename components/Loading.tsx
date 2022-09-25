import React from "react";
import Adi from "../assets/Adi.jpeg";
import PropagateLoader from "react-spinners/PropagateLoader";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center mb-10">
        <Image
          src={Adi}
          height={150}
          width={140}
          className="mb-10 rounded-full"
        />
        <h1 className="text-3xl mb-10 font-bold text-white mt-5">
          Loading the CRYPTO LOTTERY
        </h1>
        <PropagateLoader color="white" size={30} />
      </div>
    </div>
  );
};

export default Loading;
