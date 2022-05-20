import { getRealtedVideos } from "./../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import axios from "axios";

import VideoMetaData from "./../../components/metaData/VideoMetaData";
import SideVideo from "./../../components/sideVideo/SideVideo";
import Comments from "./../../components/comments/Comments";

const LbryYtVideo = ({videoData, id}) => {
  const title = videoData?.value?.title || videoData?.snippet?.title;
  const [ yt_video_url, setYtUrl ] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRealtedVideos(id, title));
    if(id.length === 11){
      axios.get(`${process.env.REACT_APP_API}/yt/${id}`).then(
        function(data){
          setYtUrl(data.data);
        }
      )
    }

  }, [dispatch, id, title, setYtUrl])


  const { videos, loading: videosLoading } = useSelector(state => state.relatedVideos);

  return (
    <>
      <Col lg={9}>
        <div className="videoPage_player">
          {
            id.length === 11 ? (
              <video autoPlay={true} controls>
                {yt_video_url && <source src={yt_video_url} type="video/mp4"></source>}
              </video>
            ) : (
              <video autoPlay={true} controls>
                <source src={`https://player.odycdn.com/api/v4/streams/free/${videoData.name}/${id}/c82b21`} type="video/mp4"></source>
              </video>
            )
          }
        </div>
        <VideoMetaData videoData={videoData} />
        <Comments videoId={id} />
      </Col>
      <Col lg={3}>
        {!videosLoading ? (
          videos?.map((videoData, i) => {
            return <SideVideo videoData={videoData} key={i} />
          })
        ) : (
          <h6>Loading...</h6>
        )}
        {/*Add video skeleteons here with nice loading*/}
      </Col>
    </>
  );
};

export default LbryYtVideo;
