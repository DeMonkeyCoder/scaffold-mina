/** @deprecated use `Number` instead */
export function normalizeNetworkId(
  networkId: bigint | number | string | unknown,
) {
  if (typeof networkId === 'string')
    return Number.parseInt(
      networkId,
      networkId.trim().substring(0, 2) === '0x' ? 16 : 10,
    )
  if (typeof networkId === 'bigint') return Number(networkId)
  if (typeof networkId === 'number') return networkId
  throw new Error(
    `Cannot normalize networkId "${networkId}" of type "${typeof networkId}"`,
  )
}
