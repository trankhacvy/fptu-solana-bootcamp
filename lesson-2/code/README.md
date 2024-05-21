## Bootcamp Lesson 2: Introduction to cryptography and Solana clients

- Slides:https://docs.google.com/presentation/d/1iO2LCIWw6_b00a_A5thRl2XSf-m3cjBn33qUv5boMvE/edit?usp=sharing

## Getting Started

1. Clone repository
```bash
git clone git@github.com:trankhacvy/fptu-solana-bootcamp.git
```
2. Install the dependencies
```bash
cd fptu-solana-bootcamp/lesson-2/code

yarn install
```
3. Copy rename the `example.env` file to be named `.env`
4. Update the `RPC_URL` variable to be the cluster URL of a supporting RPC provider

If you have the Solana CLI installed locally: update the `LOCAL_PAYER_JSON_ABSPATH` environment
variable to be the **_absolute path_** of your local testing wallet keypair JSON file.

## Recommended flow to explore this repo

After setting up locally, I recommend exploring the code of the following files (in order):

- [`1.cryptography.ts`](./scripts/1.cryptography.ts)
- [`2.check-balance.ts`](./scripts/2.check-balance.ts)
- [`3.transfer-sol.ts`](./scripts/3.transfer-sol.ts)
- [`4.complex-transaction.ts`](./scripts/4.complex-transaction.ts)

After reviewing the code in each of these scripts, try running each in order.

### Running the included Scripts

Once setup locally, you will be able to run the scripts included within this repo:

```
yarn execute ./scripts/<script>
```

#### `1.cryptography.ts`

Demonstrates how to generate a new random Solana keypair or load an existing keypair from a file.

#### `2.check-balance.ts`

Demonstrate, using code, how to retrieve the current balance of a Solana wallet.

#### `3.transfer-sol.ts`

Demonstrating how to build and send simple transactions to the blockchain

#### `4.complex-transaction.ts`

An introduction to more complex transactions using Solana web3.js Demonstrates how to build a more complex transaction, with multiple instructions.

> **Note:** We use some code from https://github.com/solana-developers/pirate-bootcamp for educational purposes.