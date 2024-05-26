use std::{env, str::FromStr};

use anyhow::Result;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    pubkey::Pubkey, signature::Keypair, signer::Signer, system_instruction,
    transaction::Transaction,
};

// explorer url: https://explorer.solana.com/tx/55GSBeGGb7K5W3ctUbqLTjdpVvDCsS1f99XaUe8KbFs7q4rzcGtrMXgjHy78sL6MXK5NPTjK5ThxJ8ZZBhdpKd47?cluster=devnet
fn main() -> Result<()> {
    const RECEIVER_PUBKEY: &str = "63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs";
    const AMOUNT: u64 = 5_000;

    let client = RpcClient::new("https://api.devnet.solana.com");
    let private_key = env::var("PRIVATE_KEY")?;
    let sender_key_pair = Keypair::from_base58_string(&private_key);

    let recevier_public_key = Pubkey::from_str(RECEIVER_PUBKEY)?;

    let transfer_instruction =
        system_instruction::transfer(&sender_key_pair.pubkey(), &recevier_public_key, AMOUNT);

    let transaction = Transaction::new_signed_with_payer(
        &[transfer_instruction],
        Some(&sender_key_pair.pubkey()),
        &[&sender_key_pair],
        client.get_latest_blockhash()?,
    );

    let signature = client.send_and_confirm_transaction(&transaction)?;

    let explorer_url = format!(
        "https://explorer.solana.com/tx/{}?cluster=devnet",
        &signature
    );

    println!("explorer url: {}", explorer_url);

    Ok(())
}
