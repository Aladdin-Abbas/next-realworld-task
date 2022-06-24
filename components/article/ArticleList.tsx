import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

import ArticlePreview from "./ArticlePreview";
import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";
import Maybe from "../common/Maybe";
import Pagination from "../common/Pagination";
import { usePageState } from "../../lib/context/PageContext";
import {
  usePageCountState,
  usePageCountDispatch,
} from "../../lib/context/PageCountContext";
import useViewport from "../../lib/hooks/useViewport";
import { SERVER_BASE_URL, DEFAULT_LIMIT } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";

const ArticleList = props => {
  const [articlesList, setArticlesList] = useState([]);
  const page = usePageState();
  const pageCount = usePageCountState();
  const setPageCount = usePageCountDispatch();
  const lastIndex =
    pageCount > 480 ? Math.ceil(pageCount / 20) : Math.ceil(pageCount / 20) - 1;

  const { vw } = useViewport();
  const router = useRouter();
  const { asPath, pathname, query } = router;
  const { favorite, follow, tag, pid, author } = query;

  const isProfilePage = pathname.startsWith(`/profile`);

  let fetchURL = `${SERVER_BASE_URL}/articles?offset=${page * DEFAULT_LIMIT}`;

  let articles, articlesCount;

  useEffect(() => {
    if (!props.title) {
      articles ? setArticlesList(articles) : null;
      return;
    }

    setArticlesList(
      articles.filter(el =>
        el.title.toLowerCase().includes(props.title.trim().toLowerCase())
      )
    );
  }, [props.title]);

  switch (true) {
    case !!tag:
      fetchURL = `${SERVER_BASE_URL}/articles${asPath}&offset=${
        page * DEFAULT_LIMIT
      }`;
      break;
    case isProfilePage && !!favorite:
      fetchURL = `${SERVER_BASE_URL}/articles?favorited=${encodeURIComponent(
        String(pid)
      )}&offset=${page * DEFAULT_LIMIT}`;
      break;
    case isProfilePage && !favorite:
      fetchURL = `${SERVER_BASE_URL}/articles?author=${encodeURIComponent(
        String(pid)
      )}&offset=${page * DEFAULT_LIMIT}`;
      break;
    case !isProfilePage && !!follow:
      fetchURL = `${SERVER_BASE_URL}/articles/feed?offset=${
        page * DEFAULT_LIMIT
      }`;
      break;
    case !isProfilePage && !!author:
      fetchURL = `${SERVER_BASE_URL}/articles?author=${author}&offset=${
        page * DEFAULT_LIMIT
      }`;
      break;
    default:
      break;
  }

  const { data, error } = useSWR(fetchURL, fetcher);

  if (error) {
    return (
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active"></ul>
        </div>
        <ErrorMessage message="Cannot load recent articles..." />
      </div>
    );
  }

  if (!data) return <LoadingSpinner />;
  articles = data.articles;
  articlesCount = data.articlesCount;

  if (
    articles &&
    !props.title &&
    JSON.stringify(articles) !== JSON.stringify(articlesList)
  )
    setArticlesList(articles);

  setPageCount(articlesCount);

  if (articles && articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articlesList?.map(article => (
        <ArticlePreview key={article.slug} article={article} />
      ))}

      <Maybe test={articlesCount && articlesCount > 20}>
        <Pagination
          total={pageCount}
          limit={20}
          pageCount={vw >= 768 ? 10 : 5}
          currentPage={page}
          lastIndex={lastIndex}
          fetchURL={fetchURL}
        />
      </Maybe>
    </>
  );
};

export default ArticleList;
