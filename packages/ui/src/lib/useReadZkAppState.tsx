import { useBlockHash } from '@/lib/connect/react/hooks/useBlockHash'
import { useFetchAccount } from '@/lib/connect/react/hooks/useFetchAccount'
import type { StateVariable } from '@/lib/types'
import { useQueryClient } from '@tanstack/react-query'
import {
  type Field,
  PublicKey,
  type SmartContract,
  type State,
  fetchAccount,
} from 'o1js'
import { useEffect, useState } from 'react'

// Helper type to assert that a property is a State
type IsStateField<T> = T extends State<any> ? T : never

export function useReadZkAppState<T extends SmartContract>({
  smartContract,
  watch,
  stateVariable,
  publicKey,
}: {
  smartContract: new (..._args: any[]) => T
  watch?: boolean
  stateVariable: StateVariable<T>
  publicKey?: string
}) {
  const [data, setData] = useState<Field | null>(null)
  const { data: blockHash } = useBlockHash({ watch })
  const queryClient = useQueryClient()
  const { queryKey, data: fetchedAccount } = useFetchAccount({
    address: publicKey,
  })
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [blockHash])

  useEffect(() => {
    async function getData() {
      if (!publicKey || !fetchedAccount) return
      const zkAppInstance = new smartContract(PublicKey.fromBase58(publicKey))
      const stateVariableInstance = zkAppInstance[stateVariable]
      setData(
        (
          stateVariableInstance as IsStateField<typeof stateVariableInstance>
        ).get(),
      )
    }

    getData()
  }, [stateVariable, publicKey, smartContract, fetchedAccount])
  return {
    data,
  }
}
