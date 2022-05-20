import { getVideoData } from "./../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { Row } from "react-bootstrap";
import { Helmet } from "react-helmet";

import LbryYtVideo from "./../../components/LbryYtVideo/LbryYtVideo";
import PopCornVideo from "./../../components/Popcorn/PopCornVideo";
import PirateBay from "./../../components/PirateBay/PirateBay";

import "./videoPage.scss";

const VideoPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getVideoData(id))
  }, [id, dispatch]);

  var { videoData } = useSelector(state => state.videoData);
  const title = videoData?.value?.title || videoData?.snippet?.title
  var videoBody;

  if(videoData.claim_id || videoData.kind){
    videoBody = <LbryYtVideo videoData={videoData} id={id}/>
  }else if(videoData.info_hash){
    videoBody = <PirateBay videoData={videoData} />
  }else{
    videoBody = <PopCornVideo videoData={videoData} />
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Row>
        {videoBody}
      </Row>
    </>
  );
};

export default VideoPage;
