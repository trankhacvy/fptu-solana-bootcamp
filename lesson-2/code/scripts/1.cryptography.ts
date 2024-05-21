/**
 * Demonstrates how to generate a new random Solana keypair or load an existing keypair from a file.
 */
import dotenv from "dotenv";
import { loadKeypairFromFile } from "@/lib/helpers";
import { Keypair } from "@solana/web3.js";

dotenv.config();

(async () => {
  // Generate a random keypair
  const keypair = Keypair.generate();

  console.log(`The public key is: `, keypair.publicKey.toBase58());
  console.log(`The secret key is: `, keypair.secretKey);

  // Load a keypair from a file
  const localKp = loadKeypairFromFile(process.env.LOCAL_PAYER_JSON_ABSPATH as string);
  console.log(`The public key is: `, localKp.publicKey.toBase58());
  
})();
