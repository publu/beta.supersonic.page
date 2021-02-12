import { useWeb3React } from "@web3-react/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import MessagePreview from "../MessagePreview";
import { useContext, useEffect, useState } from "react";
import BoxContext from "../../contexts/box";

const Home: React.FC = () => {
  const {
    account
  } = useWeb3React();


  const [profile, setProfile] = useState({});

  const { idx } = useContext(BoxContext);

  useEffect(() => {
    (async () => {
      setProfile(await idx.get("ssProfile"))
    })();
  }, [])

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-lg flex flex-row flex-wrap justify-between items-center">
        <div className="flex flex-col ">
          <img 
                className="w-12 h-12 rounded-full mr-4"
                src={`https://ipfs.io/ipfs/${profile["profilePicHash"]}`}
                alt=""/>
            <div className="flex flex-row flex-wrap">
                <h2 className="space-x-2 text-lg font-bold flex items-center">
                  supersonic.page/
                  <span className="text-sm font-normal truncate">
                    {account ? account : ""}
                  </span>
                </h2>
                <div className="m-5 flex flex-row space-x-2">
                  <div>
                    <a className="bg-white border-2 border-gray p-2 rounded-lg" href="#">
                      <FontAwesomeIcon icon={faCopy} />
                    </a>
                  </div>
                  <div>
                    <a className="bg-white border-2 border-gray p-2 rounded-lg" href="#">
                      {<FontAwesomeIcon icon={faTwitter} />}
                    </a>
                  </div>
                </div>
            </div>
            <p className="flex">
            Share this link to start conversations
            </p>
          </div>
      </div>
{/*       <section>
        <h2 className="text-2xl mb-5">Welcome Back</h2>
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-lg">
            <h2 className="text-2xl font-bold overflow-x-ellipsis">{}</h2>
            <h2>Threads</h2>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-lg">
            <h2 className="text-2xl font-bold">73</h2>
            <h2>Contacts</h2>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-lg">
            <h2 className="text-2xl font-bold truncate">$112,212.00</h2>
            <h2>Earned</h2>
          </div>
        </div>
      </section>
      <section>
      <h2 className="text-2xl mb-5">Messages</h2>
        <div className="space-y-2">
        {
          ["", "", ""].map((action) => (
            <MessagePreview
              threadLink={"#"}
              amount={0.05}
              currencySymbol="Ξ"
              message={`
                I really like your work! I wanted to get your opinion on my new Ballaxy project. Basketball + galaxy, get it?
              `}
              name={"Cooper Kunz"}
              date={"Jan 3rd"}
            />
          ))
        }
        </div>
      </section> */}
    </div>
  );
};

export default Home;