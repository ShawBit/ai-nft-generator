'use client';
import Image from 'next/image';
import { Blob, NFTStorage } from 'nft.storage';
import { FormEvent, useState } from 'react';

export function MintForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [nftUrl, setNFTUrl] = useState('');

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const image = await createImage();
    const url = await uploadImage(image);
    await mintImage(url);

    console.log('Success!');
  };

  const modelUrl = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1';

  const createImage = async () => {
    console.log('Generated Iamge...');
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
    console.log('Uploading image...');
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
    console.log('Waiting for mint...');
  };

  return (
    <div>
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
          <Image className="rounded-[6px]" src={image} alt="Ai generated image" width="512" height="512" />
        </div>
      </div>
      <p className="flex justify-center items-center">
        View&nbsp;
        <a href={nftUrl} target="_blank" rel="noreferrer">
          Metadata
        </a>
      </p>
    </div>
  );
}
