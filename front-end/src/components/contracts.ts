import { erc20ABI } from 'wagmi'
import { type Abi, type Address } from "viem";
import PRESALE_ABI from "../abis/presale.abi.json";

export const TOKEN_CA = "0xb55bD1A63558E2384C2231eE8C2B8B036FF62727";
export const PRESALE_CA = "0x797363B425F465E8f9005bDE6503b9C23202356b";

export const presaleContractConfig = {
  address: PRESALE_CA as Address,
  abi: PRESALE_ABI as Abi
} as const;

export const tokenContractConfig = {
  address: TOKEN_CA,
  abi: erc20ABI,
} as const;
