"use client";
import { useAccount, useSignMessage } from "wagmi";

const Page = () => {
  const account = useAccount();
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: `
          Sign this message to login to Curved Social.
          Your address is ${account.address}
        `,
  });
  return (
    <div>
      <button disabled={isLoading} onClick={() => signMessage()}>
        Sign message
      </button>
      {isSuccess && (
        <div
          // very long string
          className="break-all"
        >
          Signature: {data}
        </div>
      )}
      {isError && <div>Error signing message</div>}
    </div>
  );
};

export default Page;
