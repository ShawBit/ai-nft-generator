'use client';
import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }: { account: string; setAccount: Function }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);
  };
  return (
    <div className="flex justify-around mt-32">
      <div className="text-[#0E76FD] text-[1.75em] font-extrabold">Ai NFT Generator</div>
      {account ? (
        <button
          type="button"
          className="w-[175px] h-[50px] my-auto mx-0 bg-[#0E76FD] text-white rounded-[4px] text-[1.10em] font-semibold cursor-pointer hover:bg-[#3d78d8]"
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className="w-[175px] h-[50px] my-auto mx-0 bg-[#0E76FD] text-white rounded-[4px] text-[1.10em] font-semibold cursor-pointer hover:bg-[#3d78d8]"
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default Navigation;
