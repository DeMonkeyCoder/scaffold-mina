import { contracts } from './contracts'
import { formatters } from './formatters'
import { serializers } from './serializers'

export const chainConfig = {
  contracts,
  formatters,
  serializers,
} as const
