import { formatters } from './formatters'
import { serializers } from './serializers'
import { getEip712Domain } from './utils/getEip712Domain'

export const chainConfig = {
  formatters,
  serializers,
  custom: {
    getEip712Domain,
  },
} as const
