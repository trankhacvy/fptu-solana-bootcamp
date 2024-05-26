use std::{env, str::FromStr};

use anyhow::Result;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    pubkey::Pubkey, signature::Keypair, signer::Signer, system_instruction, system_program,
    transaction::Transaction,
};

const MIN_BALANCE: usize = 0;
const AMOUNT_V1: u64 = 5_000;
const AMOUNT_V2: u64 = 7_000;
const RECEIVER_PUBKEY: &str = "63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs";

// explorer url: https://explorer.solana.com/tx/2ZNcnFGGhHope2NrU2ET2eaQY7cep8oV4Ry6Ce8JzN3thtvdoAo8q81snP59u1xXNjTgrX35V4Hvn7SiJQkacuA4?cluster=devnet
fn main() -> Result<()> {
    let client = RpcClient::new("https://api.devnet.solana.com");
    let private_key = env::var("PRIVATE_KEY")?;
    let current_key_pair = Keypair::from_base58_string(&private_key);

    let receiver1_key_pair = Keypair::new();
    let receiver2_public_key = Pubkey::from_str(RECEIVER_PUBKEY)?;
    let account_min_balance = client.get_minimum_balance_for_rent_exemption(MIN_BALANCE)?;

    let account_instruction = system_instruction::create_account(
        &current_key_pair.pubkey(),
        &receiver1_key_pair.pubkey(),
        account_min_balance,
        MIN_BALANCE as u64,
        &system_program::id(),
    );

    let transfer_account = system_instruction::transfer(
        &current_key_pair.pubkey(),
        &receiver1_key_pair.pubkey(),
        AMOUNT_V1,
    );

    let transfer_account_v2 =
        system_instruction::transfer(&current_key_pair.pubkey(), &receiver2_public_key, AMOUNT_V2);

    let transaction = Transaction::new_signed_with_payer(
        &[account_instruction, transfer_account, transfer_account_v2],
        Some(&current_key_pair.pubkey()),
        &[&current_key_pair, &receiver1_key_pair],
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
