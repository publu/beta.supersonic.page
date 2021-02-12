import DefaultLayout from "../../layouts/Default";
import Aside from "../../components/Aside";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Thread } from "3box";
import BoxContext from "../../contexts/box";

const ThreadView: React.FC = (props) => {
  const router = useRouter();
  const { box, space } = useContext(BoxContext);

  const [newMessage, setNewMessage] = useState("");

  const [thread, setThread] = useState<Thread>();
  const [messages, setMessages] = useState([]);

  const { threadId } = router.query;

  useEffect(() => {
    if (space) {
      (async () => {
        //@ts-ignore
        const newThread: Thread = await space.joinThreadByAddress(atob(threadId as string));
        newThread.onUpdate(() => {
          refreshMessages(newThread);
        });
        setThread(newThread);
        refreshMessages(newThread)
      })()
    };
  }, [space]);

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

  return (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-12 gap-5 my-5">
      <Aside activePage={"messages"} />
      <div className="mx-6 col-span-12 lg:col-span-10 space-y-12">
        <div className="p-5 bg-white rounded-lg shadow">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <button onClick={() => router.back()} className="mr-4 flex flex-row items-center space-x-2 text-gray-500">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <img
              className="w-12 h-12 rounded-full mr-4"
              src="https://thispersondoesnotexist.com/image"
              alt=""/>
            <div className="flex flex-col space-y-1">
              <span className="font-semibold text-sm">
                Cooper Kunz
              </span>
              <span className="text-gray-600 text-sm">
                Jan 3rd.
              </span>
            </div>
          </div>
          <div className="px-2 py-1 rounded border border-green-400 bg-green-50">
            <span className="text-xs font-bold text-gray-700">
            Ξ0.05
            </span>
          </div>
        </div>
        <div className="m-5">
          <div className="flex flex-col-reverse">
            <div className="flex flex-col space-y-4 max-h-96 overflow-y-scroll">
              {
                messages.map(message => {
                  return message.author === box._3id ? (
                    <div className="flex flex-row space-x-4">
                      <img
                        src="https://thispersondoesnotexist.com/image"
                        className="w-12 h-12 rounded-full"
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
                        src="https://thispersondoesnotexist.com/image"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                  )
                })
              }
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
      </div>
    </div>
    </DefaultLayout>
  );
};

export default ThreadView;
