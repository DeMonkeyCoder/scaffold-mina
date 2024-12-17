import { useAppKitAccount } from '@reown/appkit/react'

export default function AccountDoesNotExist() {
  const { address } = useAppKitAccount()
  return (
    <div>
      <span className="pr-2">Account does not exist</span>
      <br />
      Visit{' '}
      <a
        href={`https://faucet.minaprotocol.com/?address=${address}`}
        className=" text-blue-500 hover:text-blue-600"
        target="_blank"
        rel="noreferrer"
      >
        the faucet
      </a>{' '}
      to fund this fee payer account
    </div>
  )
}
