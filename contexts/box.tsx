import Box, { Space } from "3box";
import CeramicClient from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";
import { PrivateKey, Users } from "@textile/hub";
import { useWeb3React } from "@web3-react/core";
import { createContext, useEffect, useState } from "react";

type BoxContextValue = {
  box: Box,
  space: Space,
  idx: IDX,
  ceramic: CeramicClient,
  identity: PrivateKey,
  threadClient: Users;
};

const BoxContext = createContext<BoxContextValue>(undefined);

export default BoxContext;