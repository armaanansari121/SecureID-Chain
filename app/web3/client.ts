// src/client.ts
import { createThirdwebClient, defineChain, getContract } from "thirdweb";

export const client = createThirdwebClient({
  clientId: "862504c5cb8295e0db634f77f0694835",
});

export const roleManagerContract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0xEB9eD33D5664285c6f7961AB16Ac65532c016252",
});
