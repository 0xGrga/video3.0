import { LazyLoadImage } from "react-lazy-load-image-component";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import yt_api from "./../../redux/yt_api";
import moment from "moment";

import "./video.scss";

const Video = ({ videoData, channelPage }) => {
  const history = useHistory();

  var [ channelImage, setChannelImage ] = useState(null);
  var channelTitle;
  var publishedAt;
  var [ thumbnail ] = useState(null);
  var duration;
  var title;

  var channelId;
  var videoId;

  if(videoData.claim_id){
    channelImage = videoData?.signing_channel?.value?.cover?.url;
    channelTitle = videoData?.signing_channel?.name;
    publishedAt = new Date(videoData.timestamp * 1000);
    thumbnail = `https://thumbnails.odycdn.com/optimize/s:390:220/quality:85/plain/${videoData.value.thumbnail?.url}`;

    if(videoData.value.video?.duration){
      duration = moment.utc(videoData.value.video?.duration * 1000).format('mm:ss');
    }else{
      duration = "00:00"
    }

    title = videoData.value.title;

    channelId = videoData?.signing_channel?.claim_id;
    videoId = videoData.claim_id;
  }else if(videoData.kind){
    const { snippet } = videoData;
    channelTitle = snippet.channelTitle;
    publishedAt = snippet.publishedAt;

    thumbnail = snippet.thumbnails?.high || snippet.thumbnails?.default || snippet.thumbnails?.standard;
    thumbnail = thumbnail.url;
    duration = moment.utc(moment.duration(videoData.contentDetails?.duration).asSeconds() * 1000).format("mm:ss");
    title = snippet.title;

    channelId = snippet.channelId;
    videoId = videoData.id.length === 11 ? videoData.id : videoData.contentDetails.videoId;
  }

  useEffect(() => {
    const getChannelImage = async () => {
      const { data } = await yt_api("/channels", {params: {part: "snippet", id: videoData.snippet.channelId}});
      setChannelImage(data.items[0].snippet.thumbnails.default.url);
    }
    if(videoData.kind){
      getChannelImage();
    }
  }, [videoData]);

  const videoClick = () => {
    history.push(`/video/${videoId}`);
  }

  const channelClick = () => {
    history.push(`/channel/${channelId}`)
  }

  return (
    <div className="video">
      <div className="video_top" onClick={videoClick}>
        {thumbnail ? (<LazyLoadImage src={thumbnail} />) : (<div className="video_top_img"><span>Image Not Found</span></div>)}
        {duration && <span className="video_top_duration">{duration}</span>}
      </div>
      <div className="video_title" onClick={videoClick}><span>{title}</span></div>
      <div className="video_channel" onClick={channelClick}>
        {channelImage ? (
          <>
            <LazyLoadImage src={channelImage} />
            <div>
              <span>{channelTitle}</span>
              <span>{moment(publishedAt).fromNow()}</span>
            </div>
          </>
        ) : (
          <div>
            <span>{channelTitle} • {moment(publishedAt).fromNow()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
