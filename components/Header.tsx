import React from "react";
import Adi from "../assets/Adi.jpeg";
import Image from "next/image";
import NavButton from "./NavButton";
import { Bars3BottomRightIcon } from "@heroicons/react/20/solid";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
const Header = () => {
  const address = useAddress();
  const disconnect = useDisconnect();
  return (
    <header className="grid grid-cols-2 justify-between md:grid-cols-5 items-center m-3">
      <div className="flex items-center space-x-2">
        <Image className="rounded-full" src={Adi} width={60} height={70} />
        <div>
          <h1 className="text-l text-white font-bold">CRYPTO LOTTERY</h1>
          <p className="text-xs text-emerald-500 truncate">
            User :{address?.substring(0, 5)}...
            {address?.substring(address.length - 5)}
          </p>
        </div>
      </div>
      <div className="hidden md:flex justify-center items-center rounded-m md:col-span-3">
        <div className="bg-[#0A1F1C] p-4 space-x-2">
          <NavButton isActive title="Buy Tickets" />
          <NavButton title="Logout" onClick={disconnect} />
        </div>
      </div>
      <div className="ml-auto flex flex-col text-right">
        <Bars3BottomRightIcon className="h-8 w-8 cursor-pointer mx-auto text-white" />
        <div className="md:hidden">
          <NavButton title="Logout" onClick={disconnect} />
        </div>
      </div>
    </header>
  );
};

export default Header;
