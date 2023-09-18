"use client";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect } from "react";

const Page = () => {
  const account = useAccount();
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: `
          Sign this message to login to Curved Social.
          Your address is ${account.address}
        `,
  });

  useEffect(() => {}, [content]);

  return (
    <div>
      <button disabled={isLoading} onClick={() => signMessage()}>
        Sign message
      </button>
      {isSuccess && <div className="break-all">Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  );
};

export default Page;
