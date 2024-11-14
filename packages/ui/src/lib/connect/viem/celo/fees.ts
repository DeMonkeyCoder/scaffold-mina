import type { Client } from "../clients/createClient";
import type {
  Address,
  ChainEstimateFeesPerGasFnParameters,
  ChainFees,
  Hex,
} from "../index";
import type { formatters } from "./formatters";

export const fees: ChainFees<typeof formatters> = {
  /*
     * Estimates the fees per gas for a transaction.
  
     * If the transaction is to be paid in a token (feeCurrency is present) then the fees 
     * are estimated in the value of the token. Otherwise falls back to the default
     * estimation by returning null.
     * 
     * @param params fee estimation function parameters
     */
  estimateFeesPerGas: async (
    params: ChainEstimateFeesPerGasFnParameters<typeof formatters>
  ) => {
    if (!params.request?.feeCurrency) return null;

    const [maxFeePerGas, maxPriorityFeePerGas] = await Promise.all([
      estimateFeePerGasInFeeCurrency(params.client, params.request.feeCurrency),
      estimateMaxPriorityFeePerGasInFeeCurrency(
        params.client,
        params.request.feeCurrency
      ),
    ]);

    return {
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  },
};

type RequestGasPriceInFeeCurrencyParams = {
  Method: "mina_gasPrice";
  Parameters: [Address];
  ReturnType: Hex;
};

/*
 * Estimate the fee per gas in the value of the fee token

 *
 * @param client - Client to use
 * @param feeCurrency -  Address of a whitelisted fee token
 * @returns The fee per gas in wei in the value of the  fee token
 *
 */
async function estimateFeePerGasInFeeCurrency(
  client: Client,
  feeCurrency: Address
) {
  const fee = await client.request<RequestGasPriceInFeeCurrencyParams>({
    method: "mina_gasPrice",
    params: [feeCurrency],
  });
  return BigInt(fee);
}

type RequestMaxGasPriceInFeeCurrencyParams = {
  Method: "mina_maxPriorityFeePerGas";
  Parameters: [Address];
  ReturnType: Hex;
};

/*
 * Estimate the max priority fee per gas in the value of the fee token

 *
 * @param client - Client to use
 * @param feeCurrency -  Address of a whitelisted fee token
 * @returns The fee per gas in wei in the value of the  fee token
 *
 */
async function estimateMaxPriorityFeePerGasInFeeCurrency(
  client: Client,
  feeCurrency: Address
) {
  const feesPerGas =
    await client.request<RequestMaxGasPriceInFeeCurrencyParams>({
      method: "mina_maxPriorityFeePerGas",
      params: [feeCurrency],
    });
  return BigInt(feesPerGas);
}
