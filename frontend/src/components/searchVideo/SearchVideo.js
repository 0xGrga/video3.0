import { LazyLoadImage } from "react-lazy-load-image-component";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import yt_api from "./../../redux/yt_api";
import moment from "moment";

import "./searchVideo.scss";

const SearchVideo = ({ videoData }) => {
  const history = useHistory();

  var channelTitle;
  var publishedAt;
  var thumbnail;
  var [duration, setDuration] = useState(null);
  var title;

  var channelId;
  var videoId;

  if(videoData.claim_id){
    channelTitle = videoData?.signing_channel?.name;
    publishedAt = new Date(videoData.timestamp * 1000);
    thumbnail = `https://thumbnails.odycdn.com/optimize/s:390:220/quality:85/plain/${videoData.value?.thumbnail?.url}?quality=85&height=220&width=390`;
    duration = moment.utc(videoData.value.video?.duration * 1000).format('mm:ss');
    title = videoData.value.title;

    channelId = videoData?.signing_channel?.claim_id;
    videoId = videoData.claim_id;
  }else if(videoData.kind){
    const { snippet } = videoData;
    channelTitle = snippet?.channelTitle;
    publishedAt = snippet?.publishedAt;
    thumbnail = snippet?.thumbnails.high.url;
    title = snippet?.title;

    channelId = snippet?.channelId;
    videoId = videoData.id.videoId;
  }

  useEffect(() => {
    const getVideoDuration = async () => {
      const { data } = await yt_api("/videos", {params: {part: "contentDetails", id: videoId}});
      setDuration(moment.utc(moment.duration(data.items[0]?.contentDetails?.duration).asSeconds() * 1000).format("mm:ss"))
    }
    if(videoData.kind){
      getVideoDuration()
    }
  }, [videoData, videoId]);

  const videoClick = () => {
    history.push(`/video/${videoId}`);
  }

  const channelClick = () => {
    history.push(`/channel/${channelId}`);
  }

  if((videoData.kind && videoData.snippet === undefined) || (!thumbnail || !title || (videoData.claim_id && videoData.value.thumbnail.url === undefined))){
    return (<></>);
  }

  return (
    <Row className="searchVideo">
      <Col xs={4} className="searchVideo_img" onClick={videoClick}>
        <LazyLoadImage src={thumbnail} />
        <span>{duration}</span>
      </Col>
      <Col xs={8} className="searchVideo_details">
        <span className="title" onClick={videoClick}>{title}</span>
        <div>
          <span onClick={channelClick}>{channelTitle}</span>
          <span onClick={videoClick}>{moment(publishedAt).fromNow()}</span>
        </div>
      </Col>
    </Row>
  );
};

export default SearchVideo;
