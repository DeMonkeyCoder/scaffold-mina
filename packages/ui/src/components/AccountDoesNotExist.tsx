import { useMinaProvider } from "@/lib/ZkappContext";

export default function AccountDoesNotExist() {
  const { account } = useMinaProvider();
  return (
    <div>
      <span className="pr-2">Account does not exist</span>
      <br />
      Visit{" "}
      <a
        href={"https://faucet.minaprotocol.com/?address=" + account?.toBase58()}
        className=" text-blue-500 hover:text-blue-600"
        target="_blank"
        rel="noreferrer"
      >
        the faucet
      </a>{" "}
      to fund this fee payer account
    </div>
  );
}
