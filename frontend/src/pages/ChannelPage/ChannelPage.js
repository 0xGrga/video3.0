import { getChannelVideos, getChannelData } from "./../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import Video from "./../../components/video/Video";
import { Container, Col } from "react-bootstrap";

import numeral from "numeral";
import axios from "axios";
import "./channel.scss";

const auth_token = "2Xp1tiZhWDuuvTGKDSouPUq5ASbUPoc3";

const ChannelPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  var [ subCount, setSubCount ] = useState(null);
  var channelThumbnail;
  var totalUpload = 0;
  var hasMore = true;
  var channelCover;
  var style = {};
  var title;



  useEffect(() => {
    const getSubCount = async () => {
      const { data: sC_data } = await axios.get(`${process.env.REACT_APP_API}/sub_count/${id}/${auth_token}`);
      setSubCount(sC_data.data[0]);
    };
    if(id.length === 40){
      getSubCount();
    }

    dispatch(getChannelVideos(id));
    dispatch(getChannelData(id));
  }, [dispatch, id]);

  const { channelData } = useSelector(state => state.channelData);
  const { videos, loading } = useSelector(state => state.channelVideos);

  if(channelData.claim_id){
    channelThumbnail = `https://thumbnails.odycdn.com/optimize/s:200:0/quality:95/plain/${channelData.value.thumbnail.url}`;
    channelCover = `https://thumbnails.odycdn.com/optimize/s:0:0/quality:95/plain/${channelData.value.cover?.url}`;
    totalUpload = channelData.meta.claims_in_channel;
    title = channelData.value.title;
  }
  if(channelData.kind){
    const { snippet } = channelData;
    subCount = channelData.statistics.subscriberCount;
    if(channelData.brandingSettings.image?.bannerExternalUrl){
      channelCover = `${channelData.brandingSettings.image.bannerExternalUrl}=w2120-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`
    }else{
      channelCover = undefined;
    }

    channelThumbnail = snippet.thumbnails.default.url;
    totalUpload = channelData.statistics.videoCount;
    title = snippet.title;
  }

  if(channelCover){
    style = {"--img": `url(${channelCover})`}
  }else{
    style = {"height": "70px"}
  }

  const loadMore = () => {
    dispatch(getChannelVideos(id));
  }

  if(totalUpload === videos.length){
    hasMore = false;
  }

  return (
    <>
      <div className="channel_header">
        <div className="channel_cover" style={style}>
          <div className="channel_details">
            <img src={channelThumbnail} alt="" />
            <div>
              <span>{title}</span>
              <span style={{fontSize: "1rem"}}>{numeral(subCount).format("0.a")} Subscribers</span>
            </div>
          </div>
        </div>
      </div>
      <Container>
        <InfiniteScroll dataLength={videos.length+1} next={loadMore} hasMore={hasMore} className="row" loader={<div className="spinner-border text-danger d-block mx-auto"></div>}>
          {(videos.length || !loading) && (
            videos?.map((video, i) => (
              <Col md={3} lg={3} key={i}>
                <Video videoData={video} channelPage/>
              </Col>
          )))}
        </InfiniteScroll>
      </Container>
    </>
  );
};

export default ChannelPage;
