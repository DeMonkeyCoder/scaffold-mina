import type { Config } from '../createConfig'

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface Register {}
export type ResolvedRegister = {
  config: Register extends { config: infer config extends Config }
    ? config
    : Config
}
