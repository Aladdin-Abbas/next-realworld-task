import React, { useState } from "react";

import TabList from "./TabList";
import ArticleList from "../article/ArticleList";
import Search from "./Search";

const MainView = () => {
  const [title, setTitle] = useState("");

  const onSearchHandler = title => {
    setTitle(title.target.value);
  };

  return (
    <>
      <div className="col-md-9">
        <div className="feed-toggle">
          <Search onSearchHandler={onSearchHandler} />
          <TabList />
        </div>
        <ArticleList title={title} />
      </div>
    </>
  );
};

export default MainView;
