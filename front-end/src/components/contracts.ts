import { erc20ABI } from 'wagmi'
import { type Abi, type Address } from "viem";
import PRESALE_ABI from "../abis/presale.abi.json";

export const TOKEN_CA = "0xB2eadDC5A2EeBBb71e89B70d97ce4f441a4DEf12";
export const PRESALE_CA = "0x9bc7BCb71a11BaC10667b0c8Cc26803605606bFE";

export const presaleContractConfig = {
  address: PRESALE_CA as Address,
  abi: PRESALE_ABI as Abi
} as const;

export const tokenContractConfig = {
  address: TOKEN_CA,
  abi: erc20ABI,
} as const;
