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
      <ConnectButton />

      {isConnected && (
        <>
          <BalanceOf />
          <BuyToken />
        </>
      )}
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
      <h3>Mint a wagmi</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          write?.();
        }}
      >
        <input placeholder='Ether amount to pay' onChange={(e) => setEtherAmount(parseFloat(e.target.value))} />
        <button disabled={!write} type='submit'>
          Mint
        </button>
      </form>

      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Success</div>
          <div>Transaction Hash: {data?.hash}</div>
        </>
      )}

      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
    </>
  );
}
