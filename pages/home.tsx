import { useWeb3React } from "@web3-react/core";
import React from "react";
import Aside from "../components/Aside";
import { useEagerConnect } from "../hooks";
import DefaultLayout from "../layouts/Default";
import MessagePreview from "../components/MessagePreview";
import { shortenHex } from "../util";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const Home: React.FC = () => {
  const { account } = useWeb3React();
  return (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto grid grid-cols-12 gap-5 mt-12">
        <Aside
          activePage={"home"}
         />
        <main className="mx-5 col-span-12 lg:col-span-8 space-y-12">
        </main>
      </div>
    </DefaultLayout>
  );
}
export default Home;
