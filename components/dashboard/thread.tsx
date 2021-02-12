import Box from "3box";
import { getThreadByAddress, Thread } from "3box";
import { useWeb3React } from "@web3-react/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import BoxContext from "../../contexts/box";


const ThreadTab: React.FC = () => {
  const { box, space } = useContext(BoxContext);
  const {
    account 
  } = useWeb3React();

  const [newMessage, setNewMessage] = useState("");

  const [thread, setThread] = useState<Thread>();
  const [messages, setMessages] = useState([]);
  const [memberSpaces, setMemberSpaces] = useState<object>({});
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef(null);
  //@ts-ignore

  const params = useParams();

  useEffect(() => {
    console.log("params", atob(params["threadAddress"]));
    if (space && params["threadAddress"]) {
      (async () => {
        //@ts-ignore
        const newThread: Thread = await space.joinThreadByAddress(atob(params["threadAddress"]));
        console.log("thr", newThread);

        newThread.onUpdate(() => {
          refreshMessages(newThread);
        });
        setThread(newThread);
        refreshMessages(newThread)
        getMemberSpaces(newThread);
      })()
    };
  }, [space]);

  const getMemberSpaces = async (thisThread: Thread) => {
    let posts = await thisThread.getPosts();
    let members = [...new Set(posts.map(post => post.author))];
    let newMemberSpaces = {};
    Promise.all((members).map(member => {
      return Box.getSpace(member, process.env.NEXT_PUBLIC_3BOX_SPACE_NAME);
    })).then(spaces => {
      members.forEach((member, index) => {
        newMemberSpaces[member] = spaces[index];
      });
      setMemberSpaces(newMemberSpaces);
    }); 
    setInitialized(true);
  }

  useEffect(() => {
    console.log("memspace", memberSpaces);
  }, [memberSpaces]);

  const refreshMessages = async (thread) => {
    const posts = await thread.getPosts();
    setMessages(posts);
  }

  const sendMessage = async (message) => {
    if (thread) {
      const postId =  await thread.post(message);
      console.log(postId);
      setNewMessage("");
    }
  }

  useEffect(() => {
      bottomRef.current.scrollIntoView({ behavior: "auto"});
  }, [messages])

  useEffect(() => {
    if (memberSpaces) {
      setInitialized(true);
    }
  }, [memberSpaces]);
  
  return (

  <div className="p-5 bg-white rounded-lg shadow">
  <div className="flex flex-row items-center justify-between">
    <div className="flex flex-row items-center">
      <button onClick={() => history.back()} className="mr-4 flex flex-row items-center space-x-2 text-gray-500">
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>
  </div>
  <div className="m-5">
    <div className="flex flex-col-reverse">
      <div className="flex flex-col space-y-4 max-h-96 overflow-y-scroll" >
        {
          messages.map(message => {
            return message.author != box["_3id"]["_subDIDs"][process.env.NEXT_PUBLIC_3BOX_SPACE_NAME] ? (
              <div className="flex flex-row space-x-4">
                <img 
                  className="w-12 h-12 rounded-full"
                  src={`https://ipfs.io/ipfs/${memberSpaces[message.author]?.profile.profilePicHash}`}
                />
                <div className="flex-grow p-2 bg-green-100 rounded">
                  <p>
                    { message.message }
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-row space-x-4">
                <div className="flex-grow p-2 bg-blue-100 rounded">
                  <p>
                    { message.message }
                  </p>
                </div>
                <img 
                  src={`https://ipfs.io/ipfs/${memberSpaces[message.author]?.profile.profilePicHash}`}
                  className="w-12 h-12 rounded-full"
                />
              </div>
            )
          })
        }
        <div ref={bottomRef}></div>
      </div>
    </div>
  </div>
  <div className="flex flex-row space-x-4">
    <input 
    value={newMessage}
    onChange={e => setNewMessage(e.target.value)}
    onSubmit={e => {
      e.preventDefault();
    }}
    placeholder="Type a message..."
    className="bg-gray-100 rounded-lg p-4 w-full shadow" 
    type="text" />
    <button 
      onClick={() => {
        sendMessage(newMessage);
      }}
      className="flex-shrink px-4 rounded-lg shadow">
      Send
    </button>
  </div>
  </div>
  )
}

export default ThreadTab;