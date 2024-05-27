import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloWorld } from "../target/types/hello_world";
import { assert } from "chai";

describe("hello_world", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.HelloWorld as Program<HelloWorld>;

  const counterKeypair = new anchor.web3.Keypair();

  it("Is initialized!", async () => {
    await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        payer: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterKeypair])
      .rpc();

    const counterAccount = await program.account.counter.fetch(
      counterKeypair.publicKey
    );

    assert(
      counterAccount.count.toNumber() === 0,
      "Expected initialized count to be 0"
    );
  });

  it("Increment Counter", async () => {
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    const counterAccount = await program.account.counter.fetch(
      counterKeypair.publicKey
    );

    assert(counterAccount.count.toNumber() === 1, "Expected  count to be 1");
  });

  it("Increment Counter Again", async () => {
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    const counterAccount = await program.account.counter.fetch(
      counterKeypair.publicKey
    );

    assert(counterAccount.count.toNumber() === 2, "Expected  count to be 2");
  });
});
