import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import {
  injected, 
  walletconnect,
  walletlink,
  torus,
  fortmatic,
} from "../connectors";
import { useEagerConnect, useInactiveListener } from "../hooks";
import { SUPPORTED_CONNECTORS } from "../constants";

type ConnectorModalProps = {
  onClose: () => void;
}

const ConnectorModal: React.FC<ConnectorModalProps> = (props) => {

  const context = useWeb3React();
  const { connector, activate, error } = context

  const [activatingConnector, setActivatingConnector] = useState<any>();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  useInactiveListener(!!activatingConnector);

  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto `}>
      <div className={`flex items-center justify-center min-h-screen px-4 text-center block`}>
        <div className={`fixed inset-0 transition-opacity`} aria-hidden="true" onClick={props.onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-40"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="false">&#8203;</span>
        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-md w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div className="bg-white">
            <div className="flex items-start">
              <div className="w-full">
                <div className="flex flex-row justify-between items-center p-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    {
                      connector ? "Change login provider" : "Login or Sign up"
                    }
                  </h3>
                  <button 
                    className="w-6 h-6"
                    onClick={props.onClose}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gray-50 p-4">
                  <div className="flex flex-col space-y-3">
                    {
                      SUPPORTED_CONNECTORS.map((meta) => {
                        const currentConnector = meta.connector;
                        const activating = currentConnector === activatingConnector
                        const connected = currentConnector === connector
                        const disabled = !!activatingConnector || connected || !!error

                        return (
                          <button
                            type="button"
                            className={`ring-blue-500 ${activating || connected ? "bg-blue-100 border-blue-500" : "focus:bg-blue-100 focus:border-blue-500"} flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 hover:border-2`}
                            disabled={disabled}
                            key={meta.name}
                            onClick={() => {
                              setActivatingConnector(currentConnector);
                              activate(currentConnector, (err) => {
                                setActivatingConnector(null);
                              });
                            }}
                          >
                            <div className="flex items-center">
                              {
                                activating && (
                                  <svg className="animate-spin mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                )
                              }
                              {
                                connected && (
                                  <div className="w-2 h-2 rounded-full bg-green-400 mr-3">
                                  </div>
                                )
                              }
                              { meta.name }
                            </div>
                            <img
                              className="w-8 h-8"
                              src={meta.iconPath}
                            />
                          </button>
                        );
                      })
                    }
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-center">
                    New to Ethereum? <a target="_blank" href="https://ethereum.org/en/wallets/" className="text-blue-500">Learn more about wallets</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectorModal;