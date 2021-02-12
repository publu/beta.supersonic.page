import Box, { Space, Thread } from "3box";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import BoxContext from "../contexts/box"
import { store } from "react-notifications-component";
import { ethAddressToDID, resetSpace, resetSSProfile } from "../util";

// Ceramic 
import Ceramic from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import { aliases } from "../ceramic";

import { ThreeIdConnect,  EthereumAuthProvider } from '3id-connect'
import { PrivateKey, Users, UserAuth, Client, createUserAuth } from "@textile/hub";


const BoxProvider: React.FC = (props) => {
  const [box, setBox] = useState<Box>();
  const [space, setSpace] = useState<Space>();
  const [identity, setIdentity] = useState<PrivateKey>();
  const [ceramic, setCeramic] = useState<Ceramic>(new Ceramic(process.env.NEXT_PUBLIC_CERAMIC_NODE));
  const [idx, setIdx] = useState<IDX>(new IDX({ ceramic, aliases }));
  const [threadClient, setThreadClient] = useState<Users>();
  const [authenticated, setAuthenticated] = useState(false);
  const [latestMessageId, setLatestMessageId] = useState("")

  const {
    library,
    account,
  } = useWeb3React();

  useEffect(() => {
    if (!authenticated && library) {
      (async () => {
        const threeIdConnect = new ThreeIdConnect();

        const authProvider = new EthereumAuthProvider(library.provider, account);
        await threeIdConnect.connect(authProvider);

        const provider = await threeIdConnect.getDidProvider()
        //@ts-ignore
        await ceramic.setDIDProvider(provider);

        const profile = await idx.get("ssProfile");
        if (!profile) {
          await resetSSProfile(idx);
        }
        console.log("profile", profile);

        let tempIdentity: PrivateKey
        try {
          const jwe: any = await idx.get("ed25519-identity")
          var storedIdent = await ceramic.did.decryptDagJWE(jwe);
          if (storedIdent === null) {
            throw new Error('No identity')
          }
          tempIdentity = await PrivateKey.fromString(storedIdent["identity"]);
        } catch (e) {
          try {
            tempIdentity = await PrivateKey.fromRandom()
            const jwe = await ceramic.did.createDagJWE({"identity": identity.toString()}, [ceramic.did.id]);
            await idx.set("ed25519-identity", jwe);
          } catch (err) {
            console.error(err);
            return err.message
          }
        }

        setIdentity(tempIdentity);

        const tempClient = await Users.withKeyInfo({ key: process.env.NEXT_PUBLIC_TEXTILE_KEY })
        await tempClient.getToken(tempIdentity);
        const mailboxID = await tempClient.setupMailbox();

        setThreadClient(tempClient);
        setAuthenticated(true)
      })();
    }
  }, [authenticated, library]);

  useEffect(() => {
    setAuthenticated(false);
  }, [account])

  useEffect(() => {
    if (space) {
      (async () => {
        //@ts-ignore
        const { inbox, outbox } = await space.public.all();

        const inboxThreads = await Box.getThreadByAddress(inbox);
        const validInboxThreads = inboxThreads.filter(thread => {
          try {
            JSON.parse(thread.message);
            return true;
          } catch (e) {
            return false;
          }
        }).map(element => {
          const msg = JSON.parse(element.message);
          return {
            ...msg,
            timestamp: element.timestamp,
          }
        });

        const outboxThreads = await Box.getThreadByAddress(outbox);
        console.log("outbox", outboxThreads);
        const validOutboxThreads = outboxThreads.filter(thread => {
          try {
            JSON.parse(thread.message);
            return true;
          } catch (e) {
            return false;
          }
        }).map(element => {
          const msg = JSON.parse(element.message);
          return {
            ...msg,
            timestamp: element.timestamp,
          }
        });

        const threadAddresses = [...validInboxThreads.map((iThread) => iThread.threadAddress), ...validOutboxThreads.map((oThread) => oThread.threadAddress) ]
        console.log("threads", threadAddresses);
        setupThreadNotifications(threadAddresses);
      })()
    }
  }, [space])

  const createBox = async (library) => {
    const box = await Box.create(library.provider);
    await box.auth([ process.env.NEXT_PUBLIC_3BOX_SPACE_NAME ], { address: account });
    await box.syncDone
    return box;
  };

  const setupThreadNotifications = async (threadAddresses) => {
    for (let i = 0; i < threadAddresses.length; i ++) {
      //@ts-ignore
      const thread: Thread = await space.joinThreadByAddress(threadAddresses[i]);
      thread.onUpdate(async () => {
        const posts = await thread.getPosts();
        const lastPost = posts[posts.length - 1];
        if(lastPost.author !== space["_3id"]["_subDIDs"][process.env.NEXT_PUBLIC_3BOX_SPACE_NAME] && lastPost.postId != latestMessageId) {
          setLatestMessageId(lastPost.postId);
          store.addNotification({
            title: "New Message!",
            message: lastPost.message,
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
        }
      });
    };
  }

  return (
    <BoxContext.Provider value={{ box, space, ceramic, idx, identity, threadClient }}>
      {
        props.children
      }
    </BoxContext.Provider>
  )
}

export default BoxProvider;
