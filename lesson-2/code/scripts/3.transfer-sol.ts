/**
 * Demonstrates how to
 */
import dotenv from "dotenv";
import { explorerURL, loadKeypairFromFile, printConsoleSeparator } from "@/lib/helpers";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

dotenv.config();

(async () => {
  const endpoint = clusterApiUrl("devnet");
  const connection = new Connection(endpoint, "confirmed");
  const LAMPORTS_TO_SEND = 5000;

  const senderKeypair = loadKeypairFromFile(
    process.env.LOCAL_PAYER_JSON_ABSPATH as string
  );

  const senderBalance = await connection.getBalance(senderKeypair.publicKey);

  if (senderBalance < LAMPORTS_TO_SEND) {
    const txSignature = await connection.requestAirdrop(
      senderKeypair.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(txSignature, "confirmed");
  }

  const receiverPublicKey = new PublicKey(
    "5AHKzmDcjeAAnafTivi5u7dWYw3jUQh2VBRDzSd9ztVr"
  );

  const transaction = new Transaction();

  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey: receiverPublicKey,
    lamports: LAMPORTS_TO_SEND,
  });

  transaction.add(sendSolInstruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
  ]);

  /**
   * display some helper text
   */
  printConsoleSeparator();

  console.log(
    `💸 Finished! Sent ${LAMPORTS_TO_SEND} lamports to the address ${receiverPublicKey.toBase58()}. `
  );
  console.log(
    `Transaction signature is ${explorerURL({ txSignature: signature })}!`
  );
})();
