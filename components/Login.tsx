import { useMetamask } from "@thirdweb-dev/react";
import Image from "next/image";
import React from "react";
import Adi from "../assets/Adi.jpeg";

const Login = () => {
  const connectWithMetamask = useMetamask();
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center mb-10">
        <Image
          src={Adi}
          height={130}
          width={120}
          className="mb-10 rounded-full"
        />
        <h1 className="text-6xl text-white font-bold">THE CRYPTO LOTTERY</h1>
        <h2 className="text-white mb-10">
          Get started By logging in with your MetaMask
        </h2>
        <button
          onClick={connectWithMetamask}
          className="bg-white p-3 rounded-xl font-bold shadow-lg"
        >
          Login with MetaMask
        </button>
      </div>
    </div>
  );
};

export default Login;
