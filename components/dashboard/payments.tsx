import Fuel from "@fuel-js/wallet";
import { useFuelBalance, useFuelWallet } from "../../hooks";
import { useContext, useEffect, useState } from "react";
import BoxContext from "../../contexts/box";

enum WalletTab {
	DEPOSIT,
	WITHDRAW,
};

const PaymentsTab: React.FC = () => {
	const [currentTab, setCurrentTab] = useState<WalletTab>(WalletTab.DEPOSIT);
	const [depositAmount, setDepositAmount] = useState("");
	const [withdrawAmount,setWithdrawAmount] = useState("");
	const [pledgePayment, setPledgePayment] = useState(false);
	const { data: daiBalance } = useFuelBalance("0x6b175474e89094c44da98b954eedeac495271d0f");
	const fuelWallet = useFuelWallet();
	const { space } = useContext(BoxContext);
	const [savedProfile, setSavedProfile] = useState({});
	const [newProfile, setNewProfile] = useState({});

	const deposit = async (amount: string) => {
		await fuelWallet.deposit("0x6b175474e89094c44da98b954eedeac495271d0f", Fuel.utils.parseEther(amount));
	};

	const withdraw = async (amount: string) => {
		await fuelWallet.withdraw("0x6b175474e89094c44da98b954eedeac495271d0f", Fuel.utils.parseEther(amount));
	};
	
	useEffect(() => {
		(async () => {
			const savedProfile = await space.public.get("profile");
			setSavedProfile(savedProfile);
			setNewProfile(savedProfile);
			console.log(savedProfile);
			setPledgePayment(savedProfile.goal === 0);
		})()
	}, []);

	useEffect(() => {
		(async () => {
			if (newProfile !== savedProfile) {
				const savedProfile = await space.public.get("profile");
				setSavedProfile(savedProfile);
			}
		})()
	}, [newProfile])

	const togglePledge = async () => {
		const updatedPledge = !pledgePayment;

		const updatedProfile = {
			...newProfile,
			goal: updatedPledge ? 0 : 1,
		}
		console.log("updatedProfile", updatedProfile);

		setNewProfile(updatedProfile);
		setPledgePayment(updatedPledge);
	};

	const saveProfile = async () => {
		await space.public.set("profile", newProfile);
		const savedProfile = await space.public.get("profile");
		setSavedProfile(savedProfile);
	}

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
    <>
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
			<h2 className="text-2xl my-4 mt-8">Gitcoin Pledge Stats</h2>
			<div className="space-y-4 p-4 border rounded">
				<div>
					<div className="space-y-2">
						<p>+ <span className="font-bold">${321.22}</span> by your fans</p>
						<p>+ <span className="font-bold">${33.99}</span> by you</p>
						<p>= <span className="font-bold">${(321.22 + 33.99).toFixed(2)}</span> total pledged ❤️</p>
					</div>
				</div>
				<label className="flex flex-row justify-between p-4 bg-gray-100 rounded items-center border select-none">
					Pledge future payments to gitcoin grant pool?
					<input 
						type="checkbox"
						checked={pledgePayment}
						onChange={togglePledge}
					/>
				</label>
				{
					savedProfile !== newProfile && (
						<button 
							className="px-2 py-1 bg-indigo-500 text-white hover:bg-indigo-600 rounded text-sm"
							onClick={saveProfile}>
							Save
						</button>
					)
				}
			</div>
    </>
  );
}

export default PaymentsTab;