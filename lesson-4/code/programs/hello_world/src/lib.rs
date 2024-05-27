use anchor_lang::prelude::*;

declare_id!("3rF7YcxqiE1VEazdwvMNS4cswGYMYT9VWRVBbt1cMphW");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;

        counter.count = counter.count.checked_add(1).unwrap();
        
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    count: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        space = 8 + Counter::INIT_SPACE,
        payer = payer
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}