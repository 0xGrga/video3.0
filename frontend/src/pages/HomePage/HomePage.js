import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Container, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { getPopularVideos } from "./../../redux/actions";

import LoadingVideo from "./../../components/loading_video/LoadingVideo";
import Video from "./../../components/video/Video";
import Movie from "./../../components/movie/Movie";
import Ipfs from "./../../components/ipfs/Ipfs";

const HomePage = () => {
  const { platform } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPopularVideos(platform))
  }, [dispatch, platform]);

  const { videos, loading } = useSelector(state => state.popularVideos);

  const loadMore = () => {
    dispatch(getPopularVideos(platform))
  }

  return (
    <Container>
      {platform === "ip" ? (
        <Ipfs />
      ) : (
        <InfiniteScroll dataLength={videos.length+32} next={loadMore} hasMore={true} className="row" loader={<div className="spinner-border text-danger d-block mx-auto"></div>}>
          {(!loading || videos.length) ? (
            videos.map((video, i) => (
              <Col lg={video.imdb_code ? 2 : 3} md={video.imdb_code ? 2 : 4} key={i}>
                {video.imdb_code ? <Movie videoData={video} /> : <Video videoData={video} />}
              </Col>
            ))
          ) : (
            [...Array.from(Array(32), (_, i) => (i))].map((i) => (
              <Col lg={platform === "pt" ? 2 : 3} md={platform === "pt" ? 2 : 4} key={i}>
                {platform === "pt" ? <LoadingVideo /> : <LoadingVideo />}
              </Col>
            ))
          )}
        </InfiniteScroll>
      )}
    </Container>
  );
};

export default HomePage;
