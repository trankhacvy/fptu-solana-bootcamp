import { Cluster, PublicKey } from "@solana/web3.js";

export const TODO_PROGRAM_ID = new PublicKey(
  "79Vi6MSmxMrgv9oWqEYbijN8j9gZacbvZHo9nqZQFFxv"
);

export function getProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
    case "mainnet-beta":
    default:
      return TODO_PROGRAM_ID;
  }
}
