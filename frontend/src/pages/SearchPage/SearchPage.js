import LoadingSearchVideo from "./../../components/loading_video/LoadingSearchVideo";
import SearchVideo from "./../../components/searchVideo/SearchVideo";
import Movie from "./../../components/movie/Movie";
import { Col } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { searchVideosWrapper, searchVideos } from "./../../redux/actions";
import "./searchPage.scss";

const categories = ["All", "YouTube", "Lbry/Odysee", "Popcorn Time"];

const SearchPage = () => {
  const [ activeCategorie, setActive ] = useState("All")
  const dispatch = useDispatch();
  const { query } = useParams();

  useEffect(() => {
    dispatch(searchVideos(query));
  }, [query, dispatch]);

  const { items, loading } = useSelector(state => state.searchVideos);

  const handleClick = categorie => {
    if(!(categorie === activeCategorie)){
      dispatch(searchVideosWrapper(query, categorie));
      setActive(categorie);
    }
  }

  return (
    <>
      <div className="container searchCategories">
        {
          categories.map((categorie, i) => {
            return <span key={i} onClick={() => handleClick(categorie)} className={activeCategorie === categorie ? 'active' : ''}>
              {categorie}
            </span>
          })
        }
      </div>
      <br />
      <div className={activeCategorie === "Popcorn Time" ? "row" : "container"}>
        {
          !loading ? (
            items?.map((item, i) => (
              activeCategorie === "Popcorn Time" ? <Col lg={2} key={i}><Movie videoData={item} /></Col> : <SearchVideo videoData={item} key={i} />
            ))
          ) : (
            [...Array.from(Array(20), (_, i) => (i))].map((i) => (
              <LoadingSearchVideo key={i} />
            ))
          )
        }
      </div>
    </>
  );
};

export default SearchPage;
