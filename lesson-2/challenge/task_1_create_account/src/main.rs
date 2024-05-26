use std::env;

use anyhow::Result;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    signature::Keypair, signer::Signer, system_instruction, system_program,
    transaction::Transaction,
};

fn main() -> Result<()> {
    let client = RpcClient::new("https://api.devnet.solana.com");
    let private_key = env::var("PRIVATE_KEY")?;
    let current_key_pair = Keypair::from_base58_string(&private_key);

    let new_key_pair = Keypair::new();
    const MIN_BALANCE: usize = 0;
    let account_min_balance = client.get_minimum_balance_for_rent_exemption(MIN_BALANCE)?;

    let account_instruction = system_instruction::create_account(
        &current_key_pair.pubkey(),
        &new_key_pair.pubkey(),
        account_min_balance,
        MIN_BALANCE as u64,
        &system_program::id(),
    );

    let transaction = Transaction::new_signed_with_payer(
        &[account_instruction],
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
