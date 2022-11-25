import React from "react";

const SearchBox = () => {
  return (
    <form className="flex relative">
      <label>
        <input
          className="mt-[10px] w-[350px] text-[15px] py-[10px] px-[5px] outline-none "
          type="text"
          placeholder="For example, Shawshank Redemption"
        />
      </label>
      <p className="w-[20px] absolute right-[85px] top-5 h-[20px] inline-block bg-black rotate-45"></p>
      <button className="bg-black mt-[9px] py-[5px] px-[10px] text-[#ffeedb] outline-none w-[100px] text-[18px]" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBox;
