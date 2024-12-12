import type { Address } from '@/lib/connect/viem'

export type ErrorType<name extends string = 'Error'> = Error & { name: name }

export const getContractAddress = (address: Address) => address
export const getUrl = (url: string) => url
