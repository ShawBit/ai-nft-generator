import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navigation = () => {
  return (
    <div className="flex justify-around mt-32">
      <div className="text-[#0E76FD] text-[1.75em] font-extrabold">Ai NFT Generator</div>
      <ConnectButton />
    </div>
  );
};

export default Navigation;
