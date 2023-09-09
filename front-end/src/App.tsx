import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { presaleContractConfig, tokenContractConfig } from './components/contracts';
import { BaseError, formatUnits, parseEther } from 'viem';
import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { stringify } from './utils/stringify';

export function App() {
  const { isConnected } = useAccount();

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <BuyToken />
        {/* <ConnectButton /> */}

        {/* {isConnected && (
          <>
            <BalanceOf />
            <BuyToken />
          </>
        )} */}
      </div>
    </>
  );
}
function BalanceOf() {
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address,
    token: tokenContractConfig.address,
    watch: true,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}

function BuyToken() {
  const [etherAmount, setEtherAmount] = useState<number>(0);
  const debouncedEtherAmount = useDebounce(etherAmount);
  const { config } = usePrepareContractWrite({
    ...presaleContractConfig,
    functionName: 'buyTokens',
    enabled: Boolean(debouncedEtherAmount),
    value: parseEther(`${debouncedEtherAmount}`),
  });
  const { write, data, error, isLoading, isError } = useContractWrite(config);
  const { data: receipt, isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: data?.hash });

  return (
    <>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <div
          style={{
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          mvp
        </div>
        <div>
          <input
            placeholder='.1/ .3 eth'
            onChange={(e) => setEtherAmount(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
            className='w-input'
          />
        </div>
        <ConnectButton.Custom>
          {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button onClick={openConnectModal} type='button'>
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} type='button'>
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <button
                      onClick={() => {
                        write?.();
                      }}
                      disabled={!write}
                    >
                      Mint
                    </button>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>

        {/* {isLoading && <div>Check wallet...</div>}
        {isPending && <div>Transaction pending...</div>}
        {isSuccess && (
          <>
            <div>Transaction Success</div>
            <div>Transaction Hash: {data?.hash}</div>
          </>
        )} */}

        {/* {isError && <div>{(error as BaseError)?.shortMessage}</div>} */}
      </div>
    </>
  );
}
