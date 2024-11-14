import { fees } from './fees'
import { formatters } from './formatters'
import { serializers } from './serializers'

export const chainConfig = {
  formatters,
  serializers,
  fees,
} as const
