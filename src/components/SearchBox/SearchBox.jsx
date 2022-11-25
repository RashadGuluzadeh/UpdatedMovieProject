import React from "react";
import "./SearchBox.css";

const SearchBox = () => {
  return (
    <form className="searc_box">
      <label>
        <input
          className="search-box__form-input"
          type="text"
          placeholder="For example, Shawshank Redemption"
        />
      </label>
      <p className="sc"></p>
      <button className="bg-black   search-box__form-submit" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBox;
