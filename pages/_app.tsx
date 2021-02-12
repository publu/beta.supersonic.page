import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "ethers";
const { Web3Provider } = providers;
import "tailwindcss/tailwind.css";
import '../styles/globals.css'
import '../styles/footer.css';
import BoxContext from "../contexts/box";
import { useState } from "react";
import BoxProvider from "../components/BoxProvier";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'


const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function MyApp({ Component, pageProps }) {

  return (
    <div suppressHydrationWarning>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BoxProvider>
          <ReactNotification />
          {typeof window === 'undefined' ? null : <Component {...pageProps} />}
        </BoxProvider>
      </Web3ReactProvider>
    </div>
  )
}

export default MyApp
