import Fuel from "@fuel-js/wallet";
import { useEagerConnect, useInactiveListener, useFuelBalance, useFuelWallet } from "../hooks";
import { useEffect, useState } from "react";
import DefaultLayout from "../layouts/Default";

import Aside from "../components/Aside";

enum WalletTab {
	DEPOSIT,
	WITHDRAW,
};

const Payments: React.FC = () => {
	const [currentTab, setCurrentTab] = useState<WalletTab>(WalletTab.DEPOSIT);
	const [depositAmount, setDepositAmount] = useState("");
	const [withdrawAmount,setWithdrawAmount] = useState("");
	const { data: daiBalance } = useFuelBalance("0x6b175474e89094c44da98b954eedeac495271d0f");
	const fuelWallet = useFuelWallet();

	const deposit = async (amount: string) => {
		await fuelWallet.deposit("0x6b175474e89094c44da98b954eedeac495271d0f", Fuel.utils.parseEther(amount));
	};

	const withdraw = async (amount: string) => {
		await fuelWallet.withdraw("0x6b175474e89094c44da98b954eedeac495271d0f", Fuel.utils.parseEther(amount));
	};

	const renderCurrentTab = () => {
		return (
			<>
				<div style={{ display: currentTab === WalletTab.DEPOSIT ? 'block' : 'none' }}>
					<form className="flex flex-col space-y-5 p-5">
						<div>
							<label
								className="block text-sm font-semibold text-gray-600 mb-2"
								htmlFor="depositAmount">Amount</label>
							<div className="flex flex-row border border-gray-100 rounded">
								<div className="bg-white flex items-center px-5 text-sm font-semibold text-gray-600">
									DAI
						</div>
								<input
									value={depositAmount}
									onChange={e => setDepositAmount(e.target.value)}
									className="p-4 bg-gray-100 rounded-r w-full flex-grow"
									placeholder="0"
									name="depositAmount"
									type="number"
								/>
							</div>
						</div>
						<button
							className="p-5 bg-indigo-500 text-white text-lg rounded shadow-lg transition hover:bg-indigo-600 focus:outline-none"
							onClick={async (e) => {
								e.preventDefault()
								await deposit(depositAmount);
							}}>Deposit</button>
					</form>
				</div>
				<div style={{ display: currentTab === WalletTab.WITHDRAW ? 'block' : 'none' }}>
					<form className="flex flex-col space-y-5 p-5">
						<div>
							<label
								className="block text-sm font-semibold text-gray-600 mb-2"
								htmlFor="withdrawAmount">Amount</label>
							<div className="flex flex-row border border-gray-100 rounded">
								<div className="bg-white flex items-center px-5 text-sm font-semibold text-gray-600">
									DAI
						</div>
								<input
									value={withdrawAmount}
									onChange={e => setWithdrawAmount(e.target.value)}
									className="p-4 bg-gray-100 rounded-r w-full flex-grow"
									placeholder="0"
									name="withdrawAmount"
									type="number"
								/>
							</div>
						</div>
						<button
							className="p-5 bg-indigo-500 text-white text-lg rounded shadow-lg transition hover:bg-indigo-600 focus:outline-none"
							onClick={async (e) => {
								e.preventDefault()
								await withdraw(withdrawAmount);
							}}>Withdraw</button>
					</form>
				</div>
			</>
		);
	}


	return (
		<DefaultLayout>
		<div className="max-w-5xl mx-auto lg:grid lg:grid-cols-12 gap-5 my-5">
        	<Aside activePage={"payments"} />
        	<div className="lg:grid lg:col-span-8">
				<h1 className="text-lg text-center p-12">Your Balance: <span className="text-2xl font-bold">{daiBalance || "Loading..."} DAI</span></h1>
				<div className="border shadow rounded mx-auto bg-white">
					<div className="grid grid-cols-2">
						<button className={`border-b border-r border-transparent py-4 focus:outline-none ${currentTab === WalletTab.DEPOSIT ? "text-indigo-500" : "text-gray-400 border-gray-200 bg-gray-50"}`}
							onClick={() => setCurrentTab(WalletTab.DEPOSIT)}
						>
							Deposit
								</button>
						<button
							className={`border-b border-l border-transparent py-4 focus:outline-none ${currentTab === WalletTab.WITHDRAW ? "text-indigo-500" : "text-gray-400 border-gray-200 bg-gray-50"}`}
							onClick={() => setCurrentTab(WalletTab.WITHDRAW)}
						>
							Withdraw
								</button>
					</div>
					{
						renderCurrentTab()
					}
				</div>
			</div>
		</div>
		</DefaultLayout>
	);
}

export default Payments;