import { useMinaProvider } from "@/lib/ZkappContext";

export default function AccountDoesNotExist() {
    const { account } = useMinaProvider();
    return (
        <div>
        <span className="pr-2">Account does not exist.</span>
        <a
            href={
            "https://faucet.minaprotocol.com/?address=" +
            account?.toBase58()
            }
            target="_blank"
            rel="noreferrer"
        >
            Visit the faucet to fund this fee payer account.
        </a>
        </div>
    ); }

    