// src/client.ts
import { createThirdwebClient, defineChain, getContract } from "thirdweb";

export const client = createThirdwebClient({
  clientId: "862504c5cb8295e0db634f77f0694835",
});

export const idManagementContract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0xc9151C5B8454082e6915D8F3f25b3B1C0818e327",
});

export const checkpointManagerContract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0x384692a2DA80C32435ab28282C1ecc163c22818F",
});

export const geoLocationContract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0xf0E7aCFDf615D3fd4b660823c2cAEf7Fccc23959",
});
