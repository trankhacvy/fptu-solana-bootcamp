/**
 * This script demonstrates how to build and send a complex transaction
 * that includes multiple instructions to the Solana blockchain
 */
import dotenv from "dotenv";
import {
  explorerURL,
  loadKeypairFromFile,
  printConsoleSeparator,
} from "@/lib/helpers";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";

dotenv.config();

(async () => {
  const endpoint = clusterApiUrl("devnet");
  const connection = new Connection(endpoint, "confirmed");
  const STATIC_PUBLICKEY = new PublicKey(
    "5AHKzmDcjeAAnafTivi5u7dWYw3jUQh2VBRDzSd9ztVr"
  );

  const senderKeypair = loadKeypairFromFile(
    process.env.LOCAL_PAYER_JSON_ABSPATH as string
  );

  /**
   * create a simple instruction (using web3.js) to create an account
   */
  const testWalletKeypair = Keypair.generate();

  const space = 0; // on-chain space to allocated (in number of bytes)

  // request the cost (in lamports) to allocate `space` number of bytes on chain
  const balanceForRentExemption =
    await connection.getMinimumBalanceForRentExemption(space);

  // create this simple instruction using web3.js helper function
  const createTestAccountIx = SystemProgram.createAccount({
    // `fromPubkey` - this account will need to sign the transaction
    fromPubkey: senderKeypair.publicKey,
    // `newAccountPubkey` - the account address to create on chain
    newAccountPubkey: testWalletKeypair.publicKey,
    // lamports to store in this account
    lamports: balanceForRentExemption,
    // total space to allocate
    space,
    // the owning program for this account
    programId: SystemProgram.programId,
  });

  // create an instruction to transfer lamports
  const transferToTestWalletIx = SystemProgram.transfer({
    lamports: 100_000,
    // `fromPubkey` - from MUST sign the transaction
    fromPubkey: senderKeypair.publicKey,
    // `toPubkey` - does NOT have to sign the transaction
    toPubkey: testWalletKeypair.publicKey,
    programId: SystemProgram.programId,
  });

  // create an other instruction to transfer lamports
  const transferToStaticWalletIx = SystemProgram.transfer({
    lamports: 100_000,
    // `fromPubkey` - from MUST sign the transaction
    fromPubkey: senderKeypair.publicKey,
    // `toPubkey` - does NOT have to sign the transaction
    toPubkey: STATIC_PUBLICKEY,
    programId: SystemProgram.programId,
  });

  /**
   * build the transaction to send to the blockchain
   */

  // get the latest recent blockhash
  const recentBlockhash = await connection
    .getLatestBlockhash()
    .then((res) => res.blockhash);

  // create a transaction message
  const message = new TransactionMessage({
    payerKey: senderKeypair.publicKey,
    recentBlockhash,
    instructions: [
      // create the test wallet's account on chain
      createTestAccountIx,
      // transfer lamports to the static wallet
      transferToStaticWalletIx,
      // transfer lamports to the test wallet
      transferToTestWalletIx,
      // transfer lamports to the static wallet
      transferToStaticWalletIx,
    ],
  }).compileToV0Message();

  /**
   * try changing the order of the instructions inside of the message above...
   * see what happens :)
   */

  // create a versioned transaction using the message
  const tx = new VersionedTransaction(message);

  // console.log("tx before signing:", tx);

  // sign the transaction with our needed Signers (e.g. `senderKeypair` and `testWalletKeypair`)
  tx.sign([senderKeypair, testWalletKeypair]);

  // actually send the transaction
  const sig = await connection.sendTransaction(tx);

  /**
   * display some helper text
   */
  printConsoleSeparator();

  console.log("Transaction completed.");
  console.log(explorerURL({ txSignature: sig }));
})();
