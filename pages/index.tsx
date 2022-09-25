import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Login from "../components/Login";
import { currency } from "../constants";
import CountdownTimer from "../components/CountdownTimer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "../components/AdminControls";

const Home: NextPage = () => {
  const address = useAddress();
  const [quantity, setQuantity] = useState<number>(1);
  const [userTickets, setUserTickets] = useState<number>(0);
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );
  const { data: remainigTickets } = useContractRead(
    contract,
    "RemainingTickets"
  );
  const { data: currentWinningReward } = useContractRead(
    contract,
    "CurrentWinningReward"
  );
  const { data: ticketCommission } = useContractRead(
    contract,
    "ticketCommission"
  );
  const { data: winnings } = useContractRead(
    contract,
    "getWinningsForAddress",
    address
  );
  const { mutateAsync: WithdrawWinnings } = useContractWrite(
    contract,
    "WithdrawWinnings"
  );
  const { data: lotteryOperator } = useContractRead(
    contract,
    "lotteryOperator"
  );
  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractRead(
    contract,
    "lastWinnerAmount"
  );
  const { data: tickets } = useContractRead(contract, "getTickets");
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");
  const { data: expiration } = useContractRead(contract, "expiration");
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  useEffect(() => {
    if (!tickets) return;
    const totalTickets: string[] = tickets;
    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );
    console.log("Yo", noOfUserTickets);
    setUserTickets(noOfUserTickets);
  }, [tickets, address]);
  const handleClick = async () => {
    if (!ticketPrice) return;
    const notiication = toast.loading("Buying Your tickets...");
    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ]);

      toast.success("Tickets bought successfully", {
        id: notiication,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notiication,
      });
    }
  };
  const handleWithdrawWinnings = async () => {
    const notiication = toast.loading("Withdraw Your winnings...");
    try {
      const data = await WithdrawWinnings([{}]);
      toast.success("Withdrawn successfully?", {
        id: notiication,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notiication,
      });
    }
  };
  if (!address) return <Login />;
  if (isLoading) return <Loading />;
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Crypto Lottery</title>
      </Head>
      <div className="flex-1">
        <Header />
        <Marquee className="bg-[#0A1F1C] p-4 mb-5" gradient={false} speed={100}>
          <div className="flex space-x-4 mx-10">
            <h4 className="text-white font-bold">
              Last Winner: {lastWinner?.toString()}
            </h4>
            <h4 className="text-white font-bold">
              Previous winnings:{" "}
              {lastWinnerAmount &&
                ethers.utils.formatEther(lastWinnerAmount.toString())}{" "}
              {currency}
            </h4>
          </div>
        </Marquee>

        {lotteryOperator === address && (
          <div className="flex justify-center">
            <AdminControls />
          </div>
        )}
        {winnings > 0 && (
          <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
            <button
              onClick={handleWithdrawWinnings}
              className="animate-pulse p-5 bg-gradient-to-b from-orange-400 to-emerald-500 text-center rounded-xl w-full"
            >
              <p>Winner Winner Chicken Dinner</p>
              <p>
                Total winnings: {ethers.utils.formatEther(winnings.toString())}{" "}
                {currency}
              </p>
              <br />
              <p className="font-semibold">Click here to withdraw</p>
            </button>
          </div>
        )}
        <div className="items-start space-y-5 justify-center m-5 md:flex  md:space-x-5  md:flex-row  md:space-y-0">
          <div className="stats-container">
            <h1 className="text-5xl text-white text-center font-semibold">
              The Next Draw
            </h1>
            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                {/* custom css  */}
                <h2 className="text-sm">Total Pool</h2>
                <p className="text-xl">
                  {currentWinningReward &&
                    ethers.utils.formatEther(
                      currentWinningReward.toString()
                    )}{" "}
                  {currency}
                </p>
              </div>
              <div className="stats">
                <h2 className="text-sm">Tickets Remaining</h2>
                <p className="text-xl">{remainigTickets?.toNumber()}</p>
              </div>
            </div>
            <div className="m-5 mb-3">
              <CountdownTimer />
            </div>
          </div>
          <div className="stats-container space-y-2">
            <div className="stats-container ">
              <div className=" text-white items-center flex justify-between pb-2">
                <h1>Price per ticket</h1>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice.toString())}{" "}
                  {currency}
                </p>
              </div>
              <div className="text-white flex items-center space-x-2 bg-[#091B18]  border-[#004337] border p-4">
                <p>TICKETS</p>
                <input
                  className="flex w-full bg-transparent outline-none text-right"
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between mt-2 font-semibold italic  text-emerald-300">
                  <p>Total Cost of Tickets</p>
                  <p>
                    {ticketPrice &&
                      Number(ethers.utils.formatEther(ticketPrice.toString())) *
                        quantity}{" "}
                    {currency}
                  </p>
                </div>
                <div className="flex justify-between items-center text-emerald-300 mt-2 font-semibold italic text-sm">
                  <p>Service Fees</p>
                  <p>
                    {ticketCommission &&
                      ethers.utils.formatEther(
                        ticketCommission?.toString()
                      )}{" "}
                    {currency}
                  </p>
                </div>
                <div className="flex justify-between  text-emerald-300 items-center mt-2 font-semibold italic text-sm">
                  <p>+ Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>
              <button
                onClick={handleClick}
                disabled={
                  expiration?.toString() < Date.now().toString() ||
                  remainigTickets?.toNumber() === 0
                }
                className="w-full rounded-md text-white shadow-xl font-bold px-10 py-4  bg-gradient-to-br mt-5 from-orange-500 to-emerald-500 disabled:from-slate-600 disabled:text-gray-800 disabled:to-slate-500 disabled:cursor-not-allowed"
              >
                Buy {quantity} tickets for{" "}
                {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) *
                    quantity}{" "}
                {currency}
              </button>
            </div>
            {userTickets > 0 && (
              <div className="stats">
                <p className="mb-2">
                  You have {userTickets} Tickets in this draw
                </p>
                <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                  {Array(userTickets)
                    .fill("")
                    .map((_, index) => (
                      <p className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex-shrink-0 flex items-center justify-center italic text-sm">
                        {index + 1}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
