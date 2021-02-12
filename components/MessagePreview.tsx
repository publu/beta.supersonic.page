import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import BoxContext from "../contexts/box";
import { DateTime } from "luxon";

const FuelApi = require("@fuel-js/api");
const utils = require('@fuel-js/utils');

const fuelApi = new FuelApi();

type MessagePreviewProps = {
  theirSpace: object,
  thread: any;
  onClick: () => void
}

const MessagePreview: React.FC<MessagePreviewProps> = (props) => {

  const { identity } = useContext(BoxContext);
  const [pricePaid] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const bytes = await identity.decrypt(props.thread.body);
      const body = new TextDecoder().decode(bytes);
      const msg = JSON.parse(body);
      setMessage(msg["message"]);
    })()
  }, [])

  useEffect(() => {
    (async () => {
      console.log("thread", props.thread);
      console.log("their", props.theirSpace);
      if (props.thread.transaction) {
        try {
          const transactionComponents = await fuelApi.getTransactionByHash(props.thread.transaction);

          const opts = {
          timestamp: utils.bigNumberify(transactionComponents.timestamp),
          transactionId: transactionComponents.transactionId,
          transaction: props.thread.transaction,
        }
      console.log(opts)
          console.log("transaction", transactionComponents);

          const transaction = await fuelApi.resolveTransaction(opts);

          console.log("transaction", transaction);
        } catch (e) {
          console.log(e);
        }
      }
    })()
  }, [props.theirSpace])

  return (
    <div className={`p-8 bg-white rounded-lg shadow`}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            {
              props.theirSpace ? (
                <img
                  className="w-12 h-12 rounded-full mr-4"
                  src={props.theirSpace ? `https://ipfs.io/ipfs/${props.theirSpace["profilePicHash"]}` : ""}
                  alt=""/>
              ) : (
                <div className="w-12 h-12 rounded-full mr-4 bg-gray-100 animate-pulse">

                </div>
              )
            }
            <div className="flex flex-col space-y-1">
              <span className="font-semibold text-sm">
                { props.theirSpace ? props.theirSpace["name"] : "Loading..."}
              </span>
              <span className="text-gray-600 text-sm">
                { DateTime.fromMillis(props.thread.createdAt / 1000000).toLocaleString(DateTime.DATETIME_MED) }
              </span>
            </div>
          </div>
          {
            props.thread.transaction && (
              <div className="px-2 py-1 rounded border border-green-400 bg-green-50">
                <span className="text-xs font-bold text-gray-700">
                  {"$"}{ pricePaid ? pricePaid : "..."}
                </span>
              </div>
            )
          }
        </div>
        <div>
          <p className="text-gray-700">
            { message }
          </p>
        </div>
        <div>
          <button
            className="text-green-400"
            onClick={props.onClick}>
            <FontAwesomeIcon size="lg" icon={faReply}/>
            <span className="ml-2">
              View thread
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessagePreview;
