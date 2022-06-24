import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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

        <button className="search-button" aria-label="search button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
};

export default Search;
