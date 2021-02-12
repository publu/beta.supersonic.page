import {
  injected, 
  walletconnect,
  walletlink,
  torus,
  fortmatic,
} from "./connectors";

type ConnectorMeta = {
  name: string;
  iconPath: string;
  connector: any;
}


export const SUPPORTED_CONNECTORS: ConnectorMeta[] = [
  {
    name: "Email | Phone",
    iconPath: "/icons/connectors/fortmatic.svg",
    connector: fortmatic,
  },
  {
    name: "Social Media",
    iconPath: "/icons/connectors/torus.svg",
    connector: torus,
  },
  {
    name: "WalletConnect",
    iconPath: "/icons/connectors/walletconnect.svg",
    connector: walletconnect,
  },
  {
    name: "Coinbase Wallet",
    iconPath: "/icons/connectors/walletlink.svg",
    connector: walletlink,
  },
  {
    name: "MetaMask",
    iconPath: "/icons/connectors/metamask.svg",
    connector: injected,
  }
];

export const myProfileWall = 'profileWall';
