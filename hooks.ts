import { useState, useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import Fuel from '@fuel-js/wallet';
import Box from "3box";
import { myProfileWall } from './constants';
import { injected } from './connectors'
import useSWR from 'swr';
import { parseBalance } from './util';

export function useEagerConnect() {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React()

  useEffect((): any => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          activate(injected)
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(injected)
      }

      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect)
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate])
}


export const useBox = () => {

  const [authenticated, setAuthenticated] = useState(false);
  const [box, setBox] = useState<Box>()

  const {
    library,
    account,
  } = useWeb3React();

  useEffect(() => {
    if (!authenticated && library) {
      createBox(library).then(box => {
        setBox(box)
        setAuthenticated(true)
      })
    }
  }, [library])

  const createBox = async (library) => {
    const box = await Box.create(library.provider);
    await box.auth([ process.env.NEXT_PUBLIC_3BOX_SPACE_NAME ], { address: account });
    await box.syncDone
    return box;
  };
  return box;
}

function getFuelBalance(library) {
  console.log("hello")
  return async (token, _) => {
    let wallet = new Fuel.Wallet(library.provider);
    return parseBalance((await wallet.balance(token)));
  };
}

export const useFuelBalance = (token: string, suspense = false) => {
  const { library, chainId } = useWeb3React();

  const shouldFetch = !!library;

  const result = useSWR(
    shouldFetch ? [token, chainId, "fuelTokenBalance"] : null,
    getFuelBalance(library),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}

export const useFuelWallet = () => {
  const { library } = useWeb3React();

  const shouldFetch = !!library;

  return shouldFetch ? new Fuel.Wallet(library.provider) : null
}

function getBlockNumber(library) {
  return async () => {
    return library.getBlockNumber();
  };
}

export default function useBlockNumber() {
  const { library } = useWeb3React();
  const shouldFetch = !!library;

  return useSWR(shouldFetch ? ["BlockNumber"] : null, getBlockNumber(library), {
    refreshInterval: 1 * 1000,
  });
}

export function useKeepSWRDataLiveAsBlocksArrive(mutate) {
  // because we don't care about the referential identity of mutate, just bind it to a ref
  const mutateRef = useRef(mutate);

  useEffect(() => {
    mutateRef.current = mutate;
  });

  // then, whenever a new block arrives, trigger a mutation
  const { data } = useBlockNumber();

  useEffect(() => {
    mutateRef.current();
  }, [data]);
}