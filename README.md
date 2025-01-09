# Scaffold Mina

Scaffold Mina is a starter kit designed to help you quickly build and deploy Mina zkApps with an integrated frontend and
smart contracts.

## Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/DeMonkeyCoder/scaffold-mina.git
```

### 2. Install dependencies

```bash
pnpm i
```

### 3. Compile the smart contracts

```bash
pnpm contracts:build
```

### 4. Run the frontend

```bash
pnpm ui:dev
```
Now you should be able to see the scaffold UI and interact with the default contract by opening the local URL shown in your terminal in your browser.
## Deployment

### Build the frontend

```bash
pnpm ui:build
```

### Deploy the Smart Contracts

For deploying the smart contracts, please refer to
the [Mina Documentation](https://docs.minaprotocol.com/zkapps/tutorials/deploying-to-a-networkID)

## Edit your code

You can start adding your contracts in `packages/contracts/src` and then edit `packages/ui/src/pages/index.page.tsx` to interact with your smart contract. You can also add your deployed contract address to the `packages/ui/src/contracts/deployedContracts.ts` file to interact with it through the debug contracts page.