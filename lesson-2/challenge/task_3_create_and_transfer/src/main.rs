use std::env;

use anyhow::Result;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    signature::Keypair, signer::Signer, system_instruction, system_program,
    transaction::Transaction,
};

// explorer url: https://explorer.solana.com/tx/4xfhiSNqPNyGaGjeVaVM7ci7KSVPSHPVRza6cJHpEek9eKJy1c8ehS55MXxeRLwqWVnH4UwGTgmBBiEQKJPyZJhQ?cluster=devnet
fn main() -> Result<()> {
    let client = RpcClient::new("https://api.devnet.solana.com");
    let private_key = env::var("PRIVATE_KEY")?;
    let current_key_pair = Keypair::from_base58_string(&private_key);

    let new_key_pair = Keypair::new();
    const MIN_BALANCE: usize = 0;
    const AMOUNT: u64 = 5_000;
    let account_min_balance = client.get_minimum_balance_for_rent_exemption(MIN_BALANCE)?;

    let account_instruction = system_instruction::create_account(
        &current_key_pair.pubkey(),
        &new_key_pair.pubkey(),
        account_min_balance,
        MIN_BALANCE as u64,
        &system_program::id(),
    );

    let transfer_account =
        system_instruction::transfer(&current_key_pair.pubkey(), &new_key_pair.pubkey(), AMOUNT);

    let transaction = Transaction::new_signed_with_payer(
        &[account_instruction, transfer_account],
        Some(&current_key_pair.pubkey()),
        &[&current_key_pair, &new_key_pair],
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
