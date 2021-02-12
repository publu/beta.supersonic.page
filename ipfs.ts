import createClient from "ipfs-http-client";

const client = createClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default client;