import { useWatchBlockHash } from '@/lib/connect/react/hooks/useWatchBlockHash'
import { type QueryKey, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'

export function useInvalidateOnBlock({
  networkId,
  enabled,
  queryKey,
}: {
  networkId?: string
  enabled?: boolean
  queryKey: QueryKey
}) {
  const queryClient = useQueryClient()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onBlock = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false })
  }, [])

  useWatchBlockHash({
    networkId,
    enabled,
    onBlockHash: enabled ? onBlock : undefined,
  })
}
