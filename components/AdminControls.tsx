import React from "react";
import {
  StarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowUturnDownIcon,
} from "@heroicons/react/20/solid";
import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { currency } from "../constants";
import toast from "react-hot-toast";

const AdminControls = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );
  const { data: operatorTotalCommission } = useContractRead(
    contract,
    "operatorTotalCommission"
  );
  const { mutateAsync: DrawWinnerTicket } = useContractWrite(
    contract,
    "DrawWinnerTicket"
  );
  const drawWinnerTicket = async () => {
    const notiication = toast.loading("Draw Winner...");
    try {
      const data = await DrawWinnerTicket([{}]);
      toast.success("Winner withdrawn successfully", {
        id: notiication,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notiication,
      });
    }
  };
  const { mutateAsync: WithdrawCommission } = useContractWrite(
    contract,
    "WithdrawCommission"
  );
  const withdrawCommission = async () => {
    const notiication = toast.loading("withdraw commission...");
    try {
      const data = await WithdrawCommission([{}]);
      toast.success("Commission withdrawn successfully", {
        id: notiication,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notiication,
      });
    }
  };
  const { mutateAsync: restartDraw } = useContractWrite(
    contract,
    "restartDraw"
  );
  const handlerestartDraw = async () => {
    const notiication = toast.loading("Restart Draw...");
    try {
      const data = await restartDraw([{}]);
      toast.success("Draw Restarted successfully", {
        id: notiication,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notiication,
      });
    }
  };
  const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll");
  const refundAll = async () => {
    const notiication = toast.loading("Refund All...");
    try {
      const data = await RefundAll([{}]);
      toast.success("Refunded successfully", {
        id: notiication,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notiication,
      });
    }
  };
  return (
    <div className="text-center px-4 p-3 rounded-md text-white border border-emerald-300/20">
      <h4 className="font-bold">Admin Controls</h4>
      <p className="mb-2">
        Total Commission to be withdrawn:{" "}
        {operatorTotalCommission &&
          ethers.utils.formatEther(operatorTotalCommission?.toString())}{" "}
        {currency}
      </p>

      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <button onClick={drawWinnerTicket} className="admin-buttons">
          <StarIcon className="h-6 mx-auto mb-2" />
          Draw Winner
        </button>
        <button onClick={withdrawCommission} className="admin-buttons">
          <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
          Withdraw Commission
        </button>
        <button onClick={handlerestartDraw} className="admin-buttons">
          <ArrowPathIcon className="h-6 mx-auto mb-2" />
          Restart Draw
        </button>
        <button onClick={refundAll} className="admin-buttons">
          <ArrowUturnDownIcon className="h-6 mx-auto mb-2" />
          Refund All
        </button>
      </div>
    </div>
  );
};

export default AdminControls;
