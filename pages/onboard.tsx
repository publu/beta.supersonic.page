import { useWeb3React } from "@web3-react/core";
import { useContext, useEffect, useState } from "react";
import BoxContext from "../contexts/box";
import { useBox } from "../hooks";
import DefaultLayout from "../layouts/Default";
import { resetSpace, resetSSProfile } from "../util";

const Populate = () => {
  const { idx } = useContext(BoxContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idx.authenticated) {
      (async () => {
        console.log("Resetting space");
        await resetSSProfile(idx);
        console.log("Space reset")
        setLoading(false);
      })()
    };
  }, [idx]);

  return (
    <DefaultLayout>
      <div className="text-center mt-12">
      {
        loading ? (
          <span className="flex flex-row items-center text-2xl font-bold justify-center">
            Hold up! We're creating a profile for you. 
            <svg className="animate-spin ml-4 -mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        ) :  (
          <span>
            Done! You can deposit now DAI for use on SuperSonic <a href="/dashboard" className="px-4 py-2 rounded bg-indigo-500 text-white shadow hover:bg-indigo-600">here</a>
          </span>
        )
      }
      </div>
    </DefaultLayout>
  )
};

export default Populate