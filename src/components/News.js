import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=> {
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(50);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }

  useEffect(() => {
    document.title = `${capitalize(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  },[])

  // const handlePrevClick = async () => {
  //   console.log("page: " + page);
  //   setPage(page-1, updateNews);
  // };

  // const handleNextClick = async () => {
  //   console.log("page: " + page);
  //   setPage(page+1, updateNews)
  // };

  const fetchMoreData = async () => {
    if (articles.length >= totalResults) {
      return; // No more articles to fetch
    }
    let url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${
      props.category
    }&apiKey=${props.apiKey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setPage(page+1);
  };

    return (
      <>
        <h1 className="text-center" style={{ margin: "35px 0 px", marginTop:'90px'}}>
          NewsMonkey - Top {capitalize(props.category)} Headlines
        </h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={page < Math.ceil(totalResults / props.pageSize)}
          loader={<Spinner />}
        >
          <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4 my-1" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 88)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between my-2">
          <button disabled={page<=1} type='button' className='btn btn-dark' onClick={handlePrevClick}>&larr; Previous</button>
          <button disabled={page + 1 > Math.ceil(totalResults/props.pageSize)} type='button' className='btn btn-dark' onClick={handleNextClick}>Next &rarr;</button>
        </div> */}
      </>
    );
}

News.defaultProps = {
  country: "in",
  pageSize: "5",
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
