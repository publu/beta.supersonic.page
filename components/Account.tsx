import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { shortenHex } from "../util";
import ConnectorModal from "./ConnectorModal";

const Account: React.FC = () => {

  const history = useHistory();
  const {
    account,
    deactivate
  } = useWeb3React();

  const [connectorVisible, setConnectorVisible] = useState(false);

  return (
    <div className="flex flex-row space-x-4 items-center">
      <button 
        onClick={() => {
          {
            if(account) {
              history.push("/dashboard")
            } else {
              setConnectorVisible(true);
            }
          }
        }}
        className="p-2 rounded-full border hover:border-gray-900 focus:outline-none"
      >
        { account ? ( 
            <div className="text-sm flex flex-row items-center text-gray-900">
              { shortenHex(account) }
              <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          ) : (
            "Login | Sign Up"
          ) 
        }
      </button>
      {
        connectorVisible && (
          <ConnectorModal 
            onClose={() => setConnectorVisible(false)}
          />
        )
      }
      {
        account && (
            <button 
              onClick={() => {
                deactivate();
              }}
              className="p-2 rounded-full border border-red-200 hover:border-red-500 focus:outline-none"
            >
              <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
        )
      }
    </div>
  );
};

export default Account;