import Box, { getThread, Space, Thread } from "3box";
import { useWeb3React } from "@web3-react/core";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import BoxContext from "../../contexts/box";
import MessagePreview from "../MessagePreview";
import { ethAddressToDID, getThreads } from "../../util";
import { Console } from "console";
import { store } from 'react-notifications-component';
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEnvelopeOpen, faInbox } from "@fortawesome/free-solid-svg-icons";

enum MessagesTab {
  INBOX,
  OUTBOX,
}

type MessagesProps = {
}

const Messages: React.FC<MessagesProps> = (props) => {
  const { box, space, idx, threadClient, identity} = useContext(BoxContext);

  const [iThreads, setIThreads] = useState([]);
  const [oThreads, setOThreads] = useState([]);
  const [currentTab, setCurrentTab] = useState<MessagesTab>(MessagesTab.INBOX)

  const [userSpaces, setUserSpaces] = useState({});
  const history = useHistory();

  const {
    account
  } = useWeb3React();

  useEffect(() => {
    if (threadClient) {
      (async () => {
        console.log("threads", await threadClient.listThreads());
        console.log("sentbox", await threadClient.listSentboxMessages());
      })()
    }
  }, [threadClient])

  useEffect(() => {
    if (account && threadClient) {
      (async () => {
        const inbox = await threadClient.listInboxMessages();
        const outbox = await threadClient.listInboxMessages();

        const validInboxThreads = inbox.filter(async message => {
          try {
            const bytes = await identity.decrypt(message.body);
            const body = new TextDecoder().decode(bytes);
            JSON.parse(body);
            return true;
          } catch (e) {
            return false;
          }
        })

        validInboxThreads.map(async message => {
          const bytes = await identity.decrypt(message.body);
          const body = new TextDecoder().decode(bytes);
          const msg = JSON.parse(body);
          const theirProfile = await idx.get("ssProfile", msg.from);
          setUserSpaces({
            ...userSpaces,
            [msg.from]: theirProfile,
          })
          return {
            ...msg,
            message: msg["message"],
          }
        });

        const validOutboxThreads = outbox.filter(async message => {
          try {
            const bytes = await identity.decrypt(message.body);
            const body = new TextDecoder().decode(bytes);
            JSON.parse(body);
            return true;
          } catch (e) {
            return false;
          }
        })
        
        validOutboxThreads.map(async message => {
          const bytes = await identity.decrypt(message.body);
          const body = new TextDecoder().decode(bytes);
          const msg = JSON.parse(body);
          console.log("msg", msg["message"]);
          const theirProfile = await idx.get("ssProfile", msg.to);
          setUserSpaces({
            ...userSpaces,
            [msg.from]: theirProfile,
          })
          const validMessage = {
            ...message,
            message: msg["message"],
          }
          return validMessage;
        });

        const sortedValidInboxThreads = validInboxThreads.sort((a: any, b: any) => b.createdAt - a.createdAt);
        const sortedValidOutboxThreads = validOutboxThreads.sort((a: any, b: any) => b.createdAt - a.createdAt);

        setIThreads(sortedValidInboxThreads);
        setOThreads(sortedValidOutboxThreads);
      })();
    }
  }, [account, threadClient])

  const renderCurrentTab = () => {
    switch (currentTab) {
      case MessagesTab.INBOX:
        return (
          <div className="flex flex-col space-y-4">
            {
              iThreads.map((thread) => {
                return (
                  <MessagePreview
                    theirSpace={userSpaces[thread["address"]]}
                    thread={thread}
                    onClick={() => history.push("/thread/"+btoa(thread.threadAddress))}
                  />
                )
              })
            }
          </div>
        )
      case MessagesTab.OUTBOX:
        return (
          <div className="flex flex-col space-y-4">
            {
              oThreads.map((thread) => {
                return (
                  <MessagePreview
                    theirSpace={userSpaces[thread["address"]]}
                    thread={thread}
                    onClick={() => history.push("/thread/"+btoa(thread.threadAddress))}
                  />
                )
              })
            }
          </div>
        )
    }
  }

  const activeTabClasses = "shadow text-gray-600 bg-gray-100";

  return (
    <>
      <div className="flex flex-row items-center justify-evenly py-4">
        <button 
          className={`text-gray-400 font-semibold text-lg w-1/2 py-4 rounded-tl-lg ${currentTab === MessagesTab.INBOX ? activeTabClasses : ""} focus:outline-none`}
          onClick={() => setCurrentTab(MessagesTab.INBOX)}
          >
          <FontAwesomeIcon className="mr-2" icon={faEnvelope}/>
          Inbox
        </button>
        <button 
          className={`text-gray-400 font-semibold text-lg w-1/2 py-4 rounded-tr-lg ${currentTab === MessagesTab.OUTBOX ? activeTabClasses : ""} focus:outline-none`}
          onClick={() => setCurrentTab(MessagesTab.OUTBOX)}
          >
          <FontAwesomeIcon className="mr-2" icon={faEnvelopeOpen}/>
          Outbox
        </button>
      </div>
      {
        renderCurrentTab()
      }
    </>
  )
};

export default Messages;