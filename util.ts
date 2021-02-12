import Box, { Space } from "3box";
import { DateTime } from "luxon";
import { DefaultPreferences } from "./helpers/defaultPreferences";
import { formatUnits } from "@ethersproject/units";
import { Console } from "console";
import { store } from 'react-notifications-component';
import Ceramic from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";
import { Client, PrivateKey } from "@textile/hub";

const defaultSettings = {
  profile: {
    name: "Christian Holman",
    status: "playing with pixels",
    bio: "I'm a fungi!",
    profilePicHash: "QmcTxpt5ww5sKumXeie8vDatZEzeRAv2t5V2NydA9V3cFx",
    coverPicHash: "QmR1YJfjhS15cURYajpibNZLyWW6ACUJGCW2pEnoZYmgyb",
    interests: [
    ],
    socials: {
      "twitter": "",
      "instagram": "",
      "youtube": "",
      "facebook": "",
      "linkedin": "",
      "website": "",
      "other": "",
    },
    goal: 0,
    packages: [],
  },
};

export function shortenHex(hex, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

export const resetSpacePreferences = async (box: Box) => {
  const space = await box.openSpace(process.env.NEXT_PUBLIC_3BOX_SPACE_NAME);
  await space.public.set("preferences", { ...DefaultPreferences, timezone: DateTime.fromJSDate(new Date()).zoneName });
}

export const parseBalance = (balance, decimals = 18, decimalsToDisplay = 3) => Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay);

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const resetSpace = async (box: Box) => {
  const space = await box.openSpace(process.env.NEXT_PUBLIC_3BOX_SPACE_NAME);
  await space.public.set("profile", defaultSettings.profile);

  const inbox = await space.joinThread(`${makeid(10)}_inbox`);
  const outbox = await space.joinThread(`${makeid(10)}_outbox`);

  //@ts-ignore
  await space.public.set("inbox", inbox._address);
  //@ts-ignore
  await space.public.set("outbox", outbox._address);

  console.log(await space.public.all());
}

export const resetSSProfile = async (idx: IDX) => {
  console.log("1")
  let identity = await PrivateKey.fromRandom()
  console.log("2")
  const jwe = await idx.ceramic.did.createDagJWE({"identity": identity.toString()}, [idx.ceramic.did.id]);
  console.log("3")
  await idx.set("ed25519-identity", jwe);
  console.log("4")

  const docID = await idx.set("ssProfile", {
    publicKey: identity.public.toString(),
    ...defaultSettings.profile
  });

  console.log("5")
  return docID;
};

export const getThreads = async(space: Space) => {
  const allSpaceData = await space.public.all();
  const threadIndexes = Object.keys(allSpaceData).filter(key => key.startsWith("thread-"));
  let threads = [];
  threadIndexes.forEach(index => {
    threads.push(allSpaceData[index]);
  });
  return threads;
}

export const removePublic = async (box: Box)  => {
  const space = await box.openSpace(process.env.NEXT_PUBLIC_3BOX_SPACE_NAME);
  Object.keys(space.public.all()).forEach(async key => {
    console.log(key);
    await space.public.remove(key);
  })
}

export const showNoAccountErrorNotification = () => {
  store.addNotification({
    title: "Not signed in",
    message: "You need to sign in to use this feature.",
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true
    }
  });
}

export const ethAddressToDID = async (address: string): Promise<string> => {
  const ceramic = new Ceramic(process.env.NEXT_PUBLIC_CERAMIC_NODE)
  const caip10Doc = await ceramic.createDocument('caip10-link', {
    metadata: {
      family: 'caip10-link',
      controllers: [address + '@eip155:1']
    }
  });

  return caip10Doc.content;
};