import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin, faTwitter, faYoutube, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { faBullhorn, faGlobe, faLink, faMinus, faMinusCircle, faPlusCircle, faQuestion, faSpaceShuttle } from "@fortawesome/free-solid-svg-icons";
import DefaultLayout from "../layouts/Default";
import Fuel from "@fuel-js/wallet";
import { ethAddressToDID, showNoAccountErrorNotification } from "../util";
import { createHash } from "crypto"
import { useParams, Link } from "react-router-dom";
import ConnectorModal from "../components//ConnectorModal";
import { useHistory } from "react-router-dom"

import { store } from "react-notifications-component";

import { useBox, useFuelBalance, useFuelWallet } from "../hooks";

import { useState, useEffect, useContext } from 'react';

import Box from "3box";
import { useWeb3React } from "@web3-react/core";
import BoxContext from "../contexts/box";
import { useRouter } from "next/router";
import { Client, PublicKey, ThreadID } from "@textile/hub";

const getSocialIcon = (name: string): IconDefinition => {
  switch (name) {
    case "twitter":
      return faTwitter
    case "instagram":
      return faInstagram
    case "youtube":
      return faYoutube
    case "facebook":
      return faFacebook
    case "linkedin":
      return faLinkedin
    case "website":
      return faGlobe
    case "other":
      return faLink
    default:
      return faQuestion
  }
}

const getSocialLink = (social: string, name: string): string => {
  switch (social) {
    case "twitter":
      return `https://twitter.com/${name}`
    case "instagram":
      return `https://instagram.com/${name}`
    case "youtube":
      return `https://youtube.com/user/${name}`
    case "facebook":
      return `https:/facebook.com/${name}`
    case "linkedin":
      return `https://linkedin.com/in/${name}`
    case "website":
      return name
    case "other":
      return name
    default:
      return ""
  }
}

const ProfilePage: React.FC = (props) => {
  const router = useRouter();
  const history = useHistory();
  const { id } = useParams<any>();
  const [message, setMessage] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<any>();
  const {
    account
  } = useWeb3React();
  const { box, space: ourSpace, idx, ceramic, identity, threadClient } = useContext(BoxContext);
  const fuelWallet = useFuelWallet();
  const { data: daiBalance } = useFuelBalance("0x6b175474e89094c44da98b954eedeac495271d0f");
  const [showingDeposit, setShowingDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [connectorVisible, setConnectorVisible] = useState(false);
  const [pledgePayment, setPledgePayment] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [profile, setProfile] = useState<any>();

  const [space, setSpace] = useState<any>();

  useEffect(() => {
    (async () => {
      const did = await ethAddressToDID(id);
      const profile = await idx.get("ssProfile", did);
      setProfile(profile);
    })()
  }, [idx]);

  if (!profile) {
    return <>Loading</>
  }

  const changePackage = (e: any) => {
    setSelectedPackage(JSON.parse(e.target.value));
  };

  const sendMessage = async (message: string, packageInfo: any) => {
    setIsSending(true);
      let hash;
      if (packageInfo.amount > 0) {
        if (pledgePayment) {
          hash = await fuelWallet.transfer("0x6b175474e89094c44da98b954eedeac495271d0f", id, Fuel.utils.parseEther(packageInfo.amount.toString()));
          store.addNotification({
            title: "Successfully pledged to gitcoin",
            message: "Thanks so much for pledging to the gitcoin matching pool.",
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
              pauseOnHover: true,
            },
          });
        } else {
          hash = await fuelWallet.transfer("0x6b175474e89094c44da98b954eedeac495271d0f", id, Fuel.utils.parseEther(packageInfo.amount.toString()));
        }
      } else {
        hash = undefined;
      }


      console.log("identity", identity)
      console.log("profilePublicKey", profile["publicKey"])
      console.log("threadClient", threadClient);

      const client = await Client.withKeyInfo({ key: process.env.NEXT_PUBLIC_TEXTILE_KEY });
      await client.getToken(identity);
      const thread: ThreadID = await client.newDB();

      const payload = {
        message,
        package: packageInfo.name,
        transaction: hash?.transactionId,
        threadInfo: await client.getDBInfo(thread),
      }

      const encoded = new TextEncoder().encode(JSON.stringify(payload));

      try {
        await threadClient.sendMessage(identity, PublicKey.fromString(profile["publicKey"]), encoded);
        console.log("sent!");
        setIsSending(false);
      } catch (e) {
        console.error(e)
        setIsSending(false);
      }

  }

  const postToWall = async (message: string, packageInfo: any) => {
    try {
      setIsSending(true);
      const theirConfig = await Box.getConfig(id as string);

      // from, to, amount, type
      let hash;
      if (packageInfo.amount > 0) {
        if (pledgePayment) {
          hash = await fuelWallet.transfer("0x6b175474e89094c44da98b954eedeac495271d0f", id, Fuel.utils.parseEther(packageInfo.amount.toString()));
          store.addNotification({
            title: "Successfully pledged to gitcoin",
            message: "Thanks so much for pledging to the gitcoin matching pool.",
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
              pauseOnHover: true,
            },
          });
        } else {
          hash = await fuelWallet.transfer("0x6b175474e89094c44da98b954eedeac495271d0f", id, Fuel.utils.parseEther(packageInfo.amount.toString()));
        }
      } else {
        hash = undefined;
      }



      const threadName = `${id}-${account}`;

      const inboxAddress = space.inbox;
      const outboxAddress = (await ourSpace.public.get("outbox")).trim();

      console.log(`inbox ${inboxAddress}`);
      console.log(`outbox ${outboxAddress}`);

      //@ts-ignore
      const theirInbox = await ourSpace.joinThreadByAddress(inboxAddress);
      //@ts-ignore
      const ourOutbox = await ourSpace.joinThreadByAddress(outboxAddress);

      console.log(`Message: ${message}`);
      console.log(`package: ${JSON.stringify(packageInfo)}`);
      console.log(`TxId: ${hash?.transactionId}`);
      console.log(`Address: ${thread._address}`);

      const theirInboxPost = JSON.stringify({
        address: box["_3id"]["_subDIDs"][process.env.NEXT_PUBLIC_3BOX_SPACE_NAME],
        message,
        package: packageInfo.name,
        transaction: hash?.transactionId,
        threadAddress: thread._address,
      });
      console.log(theirInboxPost);
      await theirInbox.post(theirInboxPost);

      const ourOutboxPost = JSON.stringify({
      });

      await ourOutbox.post(ourOutboxPost);
      console.log(ourOutboxPost);

      //@ts-ignore
      console.log(ourSpace)

      store.addNotification({
        title: "Sent Message!",
        message: message,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
          pauseOnHover: true,
        },
      });
      setIsSending(false);
    } catch (e) {
      setIsSending(false);
      store.addNotification({
        title: "An error occured",
        message: e.message,
        type: "error",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
          pauseOnHover: true,
        },
      });
      console.error(e);
    }
  };

	const deposit = async (amount: string) => {
		await fuelWallet.deposit("0x6b175474e89094c44da98b954eedeac495271d0f", Fuel.utils.parseEther(amount));
	};

  return profile && (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto">
        {/* COVER */}
        <div>
          <img
            className="w-full object-cover h-64 rounded-b-lg"
            src={`https://ipfs.io/ipfs/${profile.coverPicHash}`}
          />
          <div className="flex flex-row justify-left -mt-24 mb-8 ml-8">
            <img
              className="border-4 border-white block text-center w-48 h-48 top-12 object-cover rounded-full"
              src={`https://ipfs.io/ipfs/${profile.profilePicHash}`}
            />
          </div>
        </div>
        {/* CONTENT */}
        <div>
          <h1 className="text-2xl text-left pl-8">
            <span className="font-bold">{profile.name}</span> is {profile.status}
          </h1>
          <div className="lg:grid lg:grid-cols-2 gap-4 mt-12 px-5">
            <div className="border rounded-lg bg-white p-5">
              <div className="whitespace-pre-line">
                {profile.bio}
              </div>
{/*               <div className="mt-3">
                <h5 className="font-bold text-sm text-gray-400">TOPICS OF INTEREST</h4>
                <div className="flex flex-row flex-wrap mt-1 items-center">
                  {
                    profile.interests.map((pill) => (
                      <span className="noselect hover:bg-gray hover:text-white px-2 py-1 text-sm m-1 rounded-full bg-gray-200 text-gray-500">{pill}</span>
                    ))
                  }
                </div>
              </div> */}
              <div className="mt-4">
                <h4 className="font-bold text-sm text-gray-400">I'M PRETTY SOCIAL</h4>
                <div className="flex flex-row flex-wrap mt-2 items-center">
                  {
                    Object.keys(profile.socials).map((key) => (
                      <>
                      {
                        (profile.socials[key]) && (
                          <a href={getSocialLink(key, profile.socials[key])} target="_blank" className="m-2 transition text-gray-500 hover:text-gray-600">
                            <FontAwesomeIcon size="lg" icon={getSocialIcon(key)} />
                          </a>
                        )
                      }
                      </>
                    ))
                  }
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl mt-4">Connect with me!</h2>
              <div className="border rounded-lg bg-white p-5 my-4">
                {
                  profile.goal === 0 && (
                    <div>
                      <div className="flex mb-5">
                        <div className="flex-initial rounded-full py-1 px-3 bg-blue-500 text-white w-36 h-8 mr-3">
                          <FontAwesomeIcon size="1x" icon={faBullhorn}/> Goal
                        </div>
                        <span className="text-sm">
                          All proceeds from SuperSonic are pledged to the <a href="https://gitcoin.com/grants" target="_blank">Gitcoin Grants</a> matching pool.
                        </span>
                      </div>
                    </div>
                  )
                }
                <div>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Subject: Say something nice..."
                    className="h-32 rounded-lg p-5 bg-gray-100 w-full form-group mb-4"
                  />
                  <div className="form-group">
                    <label htmlFor="amount" className="font-bold"  data-tip="React-tooltip">Pick your package</label>
                    <span className="text-sm ml-2">
                      This includes the main topic you want to explore in the chat.
                    </span>
                    <div className="flex flex-row flex-wrap items-center mt-2">
                      {
                        profile.packages.map((product) => (
                          <div onChange={changePackage} className="my-3 mr-3">
                            <label className="px-3.5 py-1 font-semibold border transition rounded-full bg-gray-100 hover:bg-gray-200">
                              <input
                                type="radio"
                                name="amount"
                                value={
                                  JSON.stringify({ name: product.name, amount: product.amount > 0 ? product.amount : 0 })
                                }
                              />
                              <span className="ml-2">
                                {
                                  product.name
                                }{
                                  product.amount > 0 ? ` $${product.amount.toFixed(2)}` : " Free"
                                }
                              </span>
                            </label>
                          </div>
                        ))
                      }
                    </div>
                    <div className="mt-4 text-center">
                      {
                        !account && (
                          <button
                            onClick={
                              () => {
                                setConnectorVisible(true);
                              }
                            }
                            className="transition px-5 py-2 bg-green-500 text-white rounded-full cursor-default">Please Login to Send</button>
                        )
                      }
                      {
                        connectorVisible && (
                          <ConnectorModal 
                            onClose={() => setConnectorVisible(false)}
                          />
                        )
                      }
                      {
                        !idx.authenticated && account && (
                          <button
                            disabled
                            className="flex items-center px-5 py-2 bg-black text-white rounded-full cursor-default">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Loading your account
                          </button>
                        )
                      }
                      {
                        idx.authenticated && account && (
                          <div className="">
                              <div className="mb-4 cursor-pointer" onClick={() => setShowingDeposit(!showingDeposit)}>
                                <span>Balance: <span className="font-bold">${daiBalance}</span></span>
                                <button className="p-2 text-indigo-500 rounded-lg">
                                  <FontAwesomeIcon icon={showingDeposit ? faMinusCircle : faPlusCircle} />
                                </button>
                              </div>
                              {
                                showingDeposit && (
                                  <div className="mb-4">
                                    <div className="flex flex-col space-y-5 px-5 pb-5 text-left">
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
                                    </div>
                                  </div>
                                )
                              }
                            <button
                              disabled={isSending}
                              onClick={e => {
                                e.preventDefault();
                                sendMessage(message, selectedPackage);
                              }}
                              className="transition px-5 py-2 bg-black text-white rounded-full hover:bg-red-500">
                                <div className="flex flex-row items-center">
                                {
                                  isSending && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  )
                                }
                                Send Message
                                </div>
                              </button>
                          </div>
                        )
                      }
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-xs text-gray-500">By submitting, you agree to our <a href="#" className="text-indigo-600">Terms & Conditions</a></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
{/*             <div className="col-span-1">
              <div className="space-y-3 my-3">
                {
                  ["", ""].map(() => (
                    <div className="flex flex-row rounded-lg p-5 bg-green-50 items-center justify-between">
                      <div className="flex flex-row items-center">
                        <img
                          className="rounded-full object-cover w-12 h-12 mr-2"
                          src="https://dmuh4ir5y2w98.cloudfront.net/profile-pics/srivatsa/IMG_20190920_174123%20%282%292004019621.jpg"
                          alt=""
                        />
                        <span>Srivatsa</span>
                      </div>
                      <div>
                        $ 100
                    </div>
                    </div>
                  ))
                }
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProfilePage;
