import type { Abi, Address } from "abitype";

import type { Account } from "../../accounts/types";
import {
  getChainId,
  type GetChainIdReturnType,
} from "../../actions/public/getChainId";
import {
  addChain,
  type AddChainParameters,
} from "../../actions/wallet/addChain";
import {
  deployContract,
  type DeployContractParameters,
  type DeployContractReturnType,
} from "../../actions/wallet/deployContract";
import {
  getAddresses,
  type GetAddressesReturnType,
} from "../../actions/wallet/getAddresses";
import {
  getPermissions,
  type GetPermissionsReturnType,
} from "../../actions/wallet/getPermissions";
import {
  prepareTransactionRequest,
  type PrepareTransactionRequestParameters,
  type PrepareTransactionRequestRequest,
  type PrepareTransactionRequestReturnType,
} from "../../actions/wallet/prepareTransactionRequest";
import {
  requestAddresses,
  type RequestAddressesReturnType,
} from "../../actions/wallet/requestAddresses";
import {
  requestPermissions,
  type RequestPermissionsParameters,
  type RequestPermissionsReturnType,
} from "../../actions/wallet/requestPermissions";
import {
  sendRawTransaction,
  type SendRawTransactionParameters,
  type SendRawTransactionReturnType,
} from "../../actions/wallet/sendRawTransaction";
import {
  sendTransaction,
  type SendTransactionParameters,
  type SendTransactionRequest,
  type SendTransactionReturnType,
} from "../../actions/wallet/sendTransaction";
import {
  signMessage,
  type SignMessageParameters,
  type SignMessageReturnType,
} from "../../actions/wallet/signMessage";
import {
  signTransaction,
  type SignTransactionParameters,
  type SignTransactionReturnType,
} from "../../actions/wallet/signTransaction";
import {
  switchChain,
  type SwitchChainParameters,
} from "../../actions/wallet/switchChain";
import {
  watchAsset,
  type WatchAssetParameters,
  type WatchAssetReturnType,
} from "../../actions/wallet/watchAsset";
import {
  writeContract,
  type WriteContractParameters,
  type WriteContractReturnType,
} from "../../actions/wallet/writeContract";
import type { Chain } from "../../types/chain";
import type {
  ContractFunctionArgs,
  ContractFunctionName,
} from "../../types/contract";
import type { Client } from "../createClient";
import type { Transport } from "../transports/createTransport";

export type WalletActions<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
> = {
  /**
   * Adds an EVM chain to the wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/addChain
   * - JSON-RPC Methods: [`mina_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)
   *
   * @param args - {@link AddChainParameters}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { optimism } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   transport: custom(window.ethereum),
   * })
   * await client.addChain({ chain: optimism })
   */
  addChain: (args: AddChainParameters) => Promise<void>;
  /**
   * Deploys a contract to the network, given bytecode and constructor arguments.
   *
   * - Docs: https://viem.sh/docs/contract/deployContract
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/deploying-contracts
   *
   * @param args - {@link DeployContractParameters}
   * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link DeployContractReturnType}
   *
   * @example
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const hash = await client.deployContract({
   *   abi: [],
   *   account: '0x…,
   *   bytecode: '0x608060405260405161083e38038061083e833981016040819052610...',
   * })
   */
  deployContract: <
    const abi extends Abi | readonly unknown[],
    chainOverride extends Chain | undefined
  >(
    args: DeployContractParameters<abi, chain, account, chainOverride>
  ) => Promise<DeployContractReturnType>;
  /**
   * Returns a list of account addresses owned by the wallet or client.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/getAddresses
   * - JSON-RPC Methods: [`mina_accounts`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_accounts)
   *
   * @returns List of account addresses owned by the wallet or client. {@link GetAddressesReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const accounts = await client.getAddresses()
   */
  getAddresses: () => Promise<GetAddressesReturnType>;
  /**
   * Returns the chain ID associated with the current network.
   *
   * - Docs: https://viem.sh/docs/actions/public/getChainId
   * - JSON-RPC Methods: [`mina_networkId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_networkId)
   *
   * @returns The current chain ID. {@link GetChainIdReturnType}
   *
   * @example
   * import { createWalletClient, http } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const chainId = await client.getChainId()
   * // 1
   */
  getChainId: () => Promise<GetChainIdReturnType>;
  /**
   * Gets the wallets current permissions.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/getPermissions
   * - JSON-RPC Methods: [`wallet_getPermissions`](https://eips.ethereum.org/EIPS/eip-2255)
   *
   * @returns The wallet permissions. {@link GetPermissionsReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const permissions = await client.getPermissions()
   */
  getPermissions: () => Promise<GetPermissionsReturnType>;
  /**
   * Prepares a transaction request for signing.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest
   *
   * @param args - {@link PrepareTransactionRequestParameters}
   * @returns The transaction request. {@link PrepareTransactionRequestReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   */
  prepareTransactionRequest: <
    const request extends PrepareTransactionRequestRequest<
      chain,
      chainOverride
    >,
    chainOverride extends Chain | undefined = undefined,
    accountOverride extends Account | Address | undefined = undefined
  >(
    args: PrepareTransactionRequestParameters<
      chain,
      account,
      chainOverride,
      accountOverride,
      request
    >
  ) => Promise<
    PrepareTransactionRequestReturnType<
      chain,
      account,
      chainOverride,
      accountOverride,
      request
    >
  >;
  /**
   * Requests a list of accounts managed by a wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/requestAddresses
   * - JSON-RPC Methods: [`mina_requestAccounts`](https://eips.ethereum.org/EIPS/eip-1102)
   *
   * Sends a request to the wallet, asking for permission to access the user's accounts. After the user accepts the request, it will return a list of accounts (addresses).
   *
   * This API can be useful for dapps that need to access the user's accounts in order to execute transactions or interact with smart contracts.
   *
   * @returns List of accounts managed by a wallet {@link RequestAddressesReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const accounts = await client.requestAddresses()
   */
  requestAddresses: () => Promise<RequestAddressesReturnType>;
  /**
   * Requests permissions for a wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/requestPermissions
   * - JSON-RPC Methods: [`wallet_requestPermissions`](https://eips.ethereum.org/EIPS/eip-2255)
   *
   * @param args - {@link RequestPermissionsParameters}
   * @returns The wallet permissions. {@link RequestPermissionsReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const permissions = await client.requestPermissions({
   *   mina_accounts: {}
   * })
   */
  requestPermissions: (
    args: RequestPermissionsParameters
  ) => Promise<RequestPermissionsReturnType>;
  /**
   * Sends a **signed** transaction to the network
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
   * - JSON-RPC Method: [`mina_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
   *
   * @param client - Client to use
   * @param parameters - {@link SendRawTransactionParameters}
   * @returns The transaction hash. {@link SendRawTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   * import { sendRawTransaction } from 'viem/wallet'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   *
   * const hash = await client.sendRawTransaction({
   *   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
   * })
   */
  sendRawTransaction: (
    args: SendRawTransactionParameters
  ) => Promise<SendRawTransactionReturnType>;
  /**
   * Creates, signs, and sends a new transaction to the network.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/sendTransaction
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/sending-transactions
   * - JSON-RPC Methods:
   *   - JSON-RPC Accounts: [`mina_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_sendtransaction)
   *   - Local Accounts: [`mina_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#mina_sendrawtransaction)
   *
   * @param args - {@link SendTransactionParameters}
   * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const hash = await client.sendTransaction({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: 1000000000000000000n,
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const hash = await client.sendTransaction({
   *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
   *   value: 1000000000000000000n,
   * })
   */
  sendTransaction: <
    const request extends SendTransactionRequest<chain, chainOverride>,
    chainOverride extends Chain | undefined = undefined
  >(
    args: SendTransactionParameters<chain, account, chainOverride, request>
  ) => Promise<SendTransactionReturnType>;
  /**
   * Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/signMessage
   * - JSON-RPC Methods:
   *   - JSON-RPC Accounts: [`personal_sign`](https://docs.metamask.io/guide/signing-data#personal-sign)
   *   - Local Accounts: Signs locally. No JSON-RPC request.
   *
   * With the calculated signature, you can:
   * - use [`verifyMessage`](https://viem.sh/docs/utilities/verifyMessage) to verify the signature,
   * - use [`recoverMessageAddress`](https://viem.sh/docs/utilities/recoverMessageAddress) to recover the signing address from a signature.
   *
   * @param args - {@link SignMessageParameters}
   * @returns The signed message. {@link SignMessageReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const signature = await client.signMessage({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   message: 'hello world',
   * })
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: http(),
   * })
   * const signature = await client.signMessage({
   *   message: 'hello world',
   * })
   */
  signMessage: (
    args: SignMessageParameters<account>
  ) => Promise<SignMessageReturnType>;
  /**
   * Signs a transaction.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/signTransaction
   * - JSON-RPC Methods:
   *   - JSON-RPC Accounts: [`mina_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
   *   - Local Accounts: Signs locally. No JSON-RPC request.
   *
   * @param args - {@link SignTransactionParameters}
   * @returns The signed message. {@link SignTransactionReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   * const signature = await client.signTransaction(request)
   *
   * @example
   * // Account Hoisting
   * import { createWalletClient, http } from 'viem'
   * import { privateKeyToAccount } from 'viem/accounts'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   account: privateKeyToAccount('0x…'),
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const request = await client.prepareTransactionRequest({
   *   to: '0x0000000000000000000000000000000000000000',
   *   value: 1n,
   * })
   * const signature = await client.signTransaction(request)
   */
  signTransaction: <chainOverride extends Chain | undefined>(
    args: SignTransactionParameters<chain, account, chainOverride>
  ) => Promise<SignTransactionReturnType>;
  /**
   * Switch the target chain in a wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/switchChain
   * - JSON-RPC Methods: [`mina_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)
   *
   * @param args - {@link SwitchChainParameters}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet, optimism } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * await client.switchChain({ id: optimism.id })
   */
  switchChain: (args: SwitchChainParameters) => Promise<void>;
  /**
   * Adds an EVM chain to the wallet.
   *
   * - Docs: https://viem.sh/docs/actions/wallet/watchAsset
   * - JSON-RPC Methods: [`mina_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-747)
   *
   * @param args - {@link WatchAssetParameters}
   * @returns Boolean indicating if the token was successfully added. {@link WatchAssetReturnType}
   *
   * @example
   * import { createWalletClient, custom } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const success = await client.watchAsset({
   *   type: 'ERC20',
   *   options: {
   *     address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
   *     decimals: 18,
   *     symbol: 'WETH',
   *   },
   * })
   */
  watchAsset: (args: WatchAssetParameters) => Promise<WatchAssetReturnType>;
  /**
   * Executes a write function on a contract.
   *
   * - Docs: https://viem.sh/docs/contract/writeContract
   * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/writing-to-contracts
   *
   * A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.
   *
   * Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
   *
   * __Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__
   *
   * @param args - {@link WriteContractParameters}
   * @returns A [Transaction Hash](https://viem.sh/docs/glossary/terms#hash). {@link WriteContractReturnType}
   *
   * @example
   * import { createWalletClient, custom, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const hash = await client.writeContract({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
   *   functionName: 'mint',
   *   args: [69420],
   * })
   *
   * @example
   * // With Validation
   * import { createWalletClient, custom, parseAbi } from 'viem'
   * import { mainnet } from 'viem/chains'
   *
   * const client = createWalletClient({
   *   chain: mainnet,
   *   transport: custom(window.ethereum),
   * })
   * const { request } = await client.simulateContract({
   *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
   *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
   *   functionName: 'mint',
   *   args: [69420],
   * }
   * const hash = await client.writeContract(request)
   */
  writeContract: <
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "payable" | "nonpayable">,
    args extends ContractFunctionArgs<
      abi,
      "payable" | "nonpayable",
      functionName
    >,
    chainOverride extends Chain | undefined = undefined
  >(
    args: WriteContractParameters<
      abi,
      functionName,
      args,
      chain,
      account,
      chainOverride
    >
  ) => Promise<WriteContractReturnType>;
};

export function walletActions<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
>(client: Client<transport, chain, account>): WalletActions<chain, account> {
  return {
    addChain: (args) => addChain(client, args),
    deployContract: (args) => deployContract(client, args),
    getAddresses: () => getAddresses(client),
    getChainId: () => getChainId(client),
    getPermissions: () => getPermissions(client),
    prepareTransactionRequest: (args) =>
      prepareTransactionRequest(client as any, args as any) as any,
    requestAddresses: () => requestAddresses(client),
    requestPermissions: (args) => requestPermissions(client, args),
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    sendTransaction: (args) => sendTransaction(client, args),
    signMessage: (args) => signMessage(client, args),
    signTransaction: (args) => signTransaction(client, args),
    switchChain: (args) => switchChain(client, args),
    watchAsset: (args) => watchAsset(client, args),
    writeContract: (args) => writeContract(client, args as any),
  };
}
