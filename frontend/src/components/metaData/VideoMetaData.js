import { MdThumbUp, MdThumbDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getChannelData } from "./../../redux/actions";
import ShowMoreText from "react-show-more-text";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import numeral from "numeral";
import moment from "moment";
import axios from "axios";

import "./metaData.scss";

const auth_token = "2Xp1tiZhWDuuvTGKDSouPUq5ASbUPoc3";

const VideoMetaData = ({ videoData }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  var channelTitle = undefined;
  var channelImage = undefined;
  var title = undefined;
  var publishedAt = 0;
  var description = 0;

  var [ dislikeCount, setDislikeCount ] = useState(null);
  var [ viewCount, setViewCount ] = useState(null);
  var [ likeCount, setLikeCount ] = useState(null);
  var [ subCount, setSubCount ] = useState(null);

  const channelId = ((videoData.claim_id) ? videoData?.signing_channel?.claim_id : videoData?.snippet?.channelId);

  useEffect(() => {
    const getLbMetaData = async () => {
      const id = videoData.claim_id;
      const { data: vC_data } = await axios(`${process.env.REACT_APP_API}/view_count/${id}/${auth_token}`);
      const { data: rC_data } = await axios(`${process.env.REACT_APP_API}/reaction/${id}/${auth_token}`);
      const { data: sC_data } = await axios(`${process.env.REACT_APP_API}/sub_count/${channelId}/${auth_token}`);

      setDislikeCount(rC_data.data.others_reactions[id].dislike);
      setLikeCount(rC_data.data.others_reactions[id].like);
      setViewCount(vC_data.data[0]);
      setSubCount(sC_data.data[0]);
    };

    const getDislikeCount = async () => {
      const { data } = await axios.get(`https://returnyoutubedislikeapi.com/votes?videoId=${videoData.id}`);
      setDislikeCount(data.dislikes);
    };

    if(videoData.claim_id){
      getLbMetaData();
    }
    if(videoData.kind){
      dispatch(getChannelData(channelId));
      getDislikeCount()
    }
  }, [dispatch, videoData, channelId]);

  const { channelData } = useSelector(state => state.channelData);

  if(videoData.claim_id){
    channelTitle = videoData?.signing_channel?.value?.title;
    channelImage = videoData?.signing_channel?.value?.thumbnail?.url;

    title = videoData.value.title;
    publishedAt = new Date(videoData.timestamp * 1000);
    description = videoData.value.description;

  }else if(videoData.kind){
    viewCount = videoData.statistics.viewCount;
    likeCount = videoData.statistics.likeCount;

    const snippet = videoData.snippet;
    channelTitle = snippet.channelTitle;

    title = snippet.title;
    publishedAt = snippet.publishedAt;
    description = snippet.description;

    channelImage = channelData.snippet?.thumbnails.high.url;
    subCount = channelData.statistics?.subscriberCount;
    channelTitle = channelData.snippet?.title;
  }

  const channelClick = () => {
    history.push(`/channel/${channelId}`)
  }

  return (
    <div className="py-2 videoMetaData">
      <div className="videoMetaData_top">
        <h5>{title}</h5>
        <div className="py-1 d-flex justify-content-between align-items-center">
          <span>
            {numeral(viewCount).format("0.a")} Views • {moment(publishedAt).fromNow()}
          </span>
          <div>
            <span className="mr-3">
              <MdThumbUp size={26} /> {numeral(likeCount).format("0.a")}
            </span>
            <span className="mr-3">
              <MdThumbDown size={26} /> {numeral(dislikeCount).format("0.a")}
            </span>
          </div>
        </div>
      </div>
      {channelId && (
        <div className="py-3 my-2 videoMetaData_channel d-flex justify-content-between align-items-center">
          <div className="d-flex" onClick={channelClick}>
            {channelImage && (<img src={channelImage} alt="" className="mr-3" />)}
            <div className="d-flex flex-column">
              <span>{channelTitle}</span>
              <span>{numeral(subCount).format("0.a")} Subscribers</span>
            </div>
          </div>
        </div>
      )}
      <div className="videoMetaData_desc">
        <ShowMoreText lines={2} more="Show More" less="Show Less" anchorClass="showMoreText" expanded={false}>
          {description}
        </ShowMoreText>
      </div>
    </div>
  );
};

export default VideoMetaData;
