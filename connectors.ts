import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { FortmaticConnector } from '@web3-react/fortmatic-connector'

const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID);

export const injected = new InjectedConnector({ supportedChainIds: [CHAIN_ID] });
export const walletconnect = new WalletConnectConnector({
  rpc: { [CHAIN_ID]: process.env.NEXT_PUBLIC_INFURA_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 1000
});
export const walletlink = new WalletLinkConnector({
  url: process.env.NEXT_PUBLIC_INFURA_URL,
  appName: process.env.NEXT_PUBLIC_WALLETLINK_APP_NAME,
});
export const torus = new TorusConnector({ chainId: CHAIN_ID })
export const fortmatic = new FortmaticConnector({ apiKey: process.env.NEXT_PUBLIC_FORTMATIC_API_KEY, chainId: CHAIN_ID });