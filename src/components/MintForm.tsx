'use client';
import NFT from '@/abis/NFT.json';
import config from '@/abis/config.json';
import { ethers } from 'ethers';
import Image from 'next/image';
import { Blob, NFTStorage } from 'nft.storage';
import { FormEvent, useEffect, useState } from 'react';
import Navigation from './Navigation';

export function MintForm() {
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [account, setAccount] = useState('');
  const [nft, setNFT] = useState<ethers.Contract>();

  const [isWaiting, setIsWaiting] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [nftUrl, setNFTUrl] = useState('');

  const loadBlockchainData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    // todo  Need to change config index
    const nft = new ethers.Contract(config[network.chainId.toString() as '11155111'].nft.address, NFT.abi, provider);
    setNFT(nft);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name === '' && description === '') {
      window.alert('Please type the name and description!');
      return;
    }
    setIsWaiting(true);
    const image = await createImage();
    const url = await uploadImage(image);
    await mintImage(url);
    setIsWaiting(false);
    setMessage('');
  };

  const modelUrl = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1';

  const createImage = async () => {
    setMessage('Generated Image...');
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}` },
      body: JSON.stringify({ inputs: description }),
    });

    const result = await response.blob();
    const blobUrl = URL.createObjectURL(result);
    setImage(blobUrl);
    return result;
  };

  const uploadImage = async (image: Blob) => {
    setMessage('Uploading Image...');
    // Create instance to NFT.Storage
    const nftStorage = new NFTStorage({ token: `${process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY}` });

    const { ipnft } = await nftStorage.store({
      image: image,
      name: name,
      description: description,
    });
    // const ipnft = await nftStorage.storeBlob(image);

    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
    console.log('url: ', url);

    setNFTUrl(url);

    return url;
  };

  const mintImage = async (tokenURL: string) => {
    setMessage('Waiting for mint...');
    const signer = provider?.getSigner() as Promise<ethers.JsonRpcSigner>;
    const tx = await nft?.connect(await signer).mint(tokenURL, { value: ethers.parseUnits('0.01', 'ether') });
    await tx.wait();
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <div className="flex justify-center items-center min-h-[600px]">
        <form className="flex flex-col items-start justify-center mx-[25px] my-0" onSubmit={submitHandler}>
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="w-[250px] h-[50px] my-[10px] mx-0 p-[10px] text-[1.10em] border-[1px] border-solid border-[#0E76FD] rounded-[4px]"
            type="text"
            placeholder="Create a name ..."
          />
          <input
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="w-[250px] h-[50px] my-[10px] mx-0 p-[10px] text-[1.10em] border-[1px] border-solid border-[#0E76FD] rounded-[4px]"
            type="text"
            placeholder="Create a description ..."
          />
          <input
            className="bg-[#0E76FD] text-[#FFFFFF] w-[250px] h-[50px] my-[10px] mx-0 p-[10px] text-[1.10em] border-none rounded-[4px] font-bold cursor-pointer hover:bg-[#4c46b6]"
            type="submit"
            value="Create & Mint"
          />
        </form>
        <div className="flex justify-center items-center w-[512px] h-[512px] mx-[25px] my-0 border-[3px] border-solid border-[#0E76FD] rounded-[4px] overflow-hidden max-w-[90%]">
          {!isWaiting && image ? (
            <Image className="rounded-[6px]" src={image} alt="Ai generated image" width="512" height="512" />
          ) : isWaiting ? (
            <div>{message}</div>
          ) : (
            <div />
          )}
        </div>
      </div>
      {!isWaiting && nftUrl && (
        <p>
          View&nbsp;
          <a href={nftUrl} target="_blank" rel="noreferrer">
            Metadata
          </a>
        </p>
      )}
    </div>
  );
}
