# SimpleWallet

SimpleWallet is a beginner-friendly Base Mini App for storing ETH into a simple contract and withdrawing only your own balance.

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- wagmi + viem
- lucide-react
- framer-motion

## Contract

- Address: `0x4CFBEE11a85d943E88B1F037162DA65c77DaDf4F`
- Functions used:
  - `balances(address)`
  - `deposit() payable`
  - `withdraw(uint amount)`

## Notes

- User balance, wallet ETH balance, and contract address ETH balance are read onchain.
- Activity history is stored locally in the browser because the contract does not expose a full user history getter.
- Optional builder code and verification metadata were not provided by the user, so they are intentionally not added.
