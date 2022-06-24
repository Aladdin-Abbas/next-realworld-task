import React from "react";

const Search = ({ onSearchHandler }) => {
  return (
    <div className="container">
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title.."
          onChange={onSearchHandler}
        />

        <button className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
};

export default Search;
