export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-[600px]">
      <form className="flex flex-col items-start justify-center mx-[25px] my-0">
        <input
          className="w-[250px] h-[50px] my-[10px] mx-0 p-[10px] text-[1.10em] border-[1px] border-solid border-[#0E76FD] rounded-[4px]"
          type="text"
          placeholder="Create a name ..."
        />
        <input
          className="w-[250px] h-[50px] my-[10px] mx-0 p-[10px] text-[1.10em] border-[1px] border-solid border-[#0E76FD] rounded-[4px]"
          type="text"
          placeholder="Create a description ..."
        />
        <input
          className="bg-[#0E76FD] text-[#FFFFFF] w-[250px] h-[50px] my-[10px] mx-0 p-[10px] text-[1.10em] border-none rounded-[4px] font-bold cursor-pointer"
          type="submit"
          value="Create & Mint"
        />
      </form>
    </div>
  );
}
