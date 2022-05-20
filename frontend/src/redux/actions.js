import * as aT from "./actionTypes.js";
import * as lJ from "./lbry_json.js";

import yt_api from "./yt_api.js";

import axios from "axios";

const lb_api = axios.create({
  baseURL: "https://api.na-backend.odysee.com/api/v1/"
});

const comment_endpoint = "https://comments.odysee.com/api/v2?m=comment.List";

const shuffle = ( o ) => {
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

export const getPopularVideos = (platform) => async (dispatch, getState) => {
  try{
    dispatch({
      type: aT.POPULAR_VIDEOS_REQUEST
    });

    var nextPageToken = getState().popularVideos.nextPageToken;
    var nextPopPage = getState().popularVideos.nextPopPage;
    var nextPage = getState().popularVideos.nextPage;


    var loaded_videos = getState().popularVideos.videos;
    var videos = [];

    if(platform === undefined){
      lJ.json_trending.params.page = nextPage;
      const { data: data_lb } = await lb_api.post("/proxy?m=claim_search", lJ.json_trending);
      const { data: data_yt } = await yt_api("/videos", {params: {part: "snippet,contentDetails,statistics", chart: "mostPopular", maxResults: 32, pageToken: nextPageToken}});

      nextPageToken = data_yt.nextPageToken;
      nextPage = data_lb.result.page + 1;
      videos = [...data_lb.result.items, ...data_yt.items];
      videos = [...loaded_videos, ...shuffle(videos)];
    }else if(platform === "lb"){
      lJ.json_trending.params.page = nextPage;
      const { data: data_lb } = await lb_api.post("/proxy?m=claim_search", lJ.json_trending);

      nextPage = data_lb.result.page + 1;
      videos = shuffle(data_lb.result.items);
      loaded_videos = loaded_videos.filter(function(set){
        return set.claim_id;
      });
      videos = [...loaded_videos, ...videos];
    }else if(platform === "yt"){
      const { data: data_yt } = await yt_api("/videos", {params: {part: "snippet,contentDetails,statistics", chart: "mostPopular", maxResults: 32, pageToken: nextPageToken}});

      nextPageToken = data_yt.nextPageToken;
      videos = shuffle(data_yt.items);
      loaded_videos = loaded_videos.filter(function(set){
        return set.kind;
      });
      videos = [...loaded_videos, ...videos];
    }else if(platform === "pb"){
      var { data: data_pb } = await axios.get("https://apibay.org/precompiled/data_top100_201.json")
      videos = data_pb.filter(function(set){
        return set.status === "trusted" || set.status === "vip";
      });

    }else if(platform === "pt"){
      var params = {};
      params.sort_by = "download_count";
      params.order_by = "desc";
      params.with_rt_ratings = true;
      params.minimum_rating = 24;
      params.page = nextPopPage;

      var { data: data_pt } = await axios.get("https://yts.mx/api/v2/list_movies.json?" + new URLSearchParams(params));
      loaded_videos = loaded_videos.filter(function(set){
        return set.imdb_code;
      });
      videos = [...loaded_videos, ...data_pt.data.movies];
      nextPopPage = nextPopPage + 1;
    }

    dispatch({
      type: aT.POPULAR_VIDEOS_SUCCESS,
      payload: {
        videos: videos,
        nextPageToken: nextPageToken,
        nextPopPage: nextPopPage,
        nextPage: nextPage
      }
    });
  }catch(error){
    console.error(error);
    dispatch({
      type: aT.POPULAR_VIDEOS_FAIL,
      payload: error.message
    });
  }
};

export const getVideoData = id => async (dispatch) => {
  try{
    dispatch({
      type: aT.VIDEO_DATA_REQUEST
    });

    var data;
    if(id.length === 40){
      data = await lb_api.post("/proxy?m=claim_search", {jsonrpc: "2.0", method: "claim_search", params: {claim_id: id, not_tags: lJ.not_tags}});
      data = data.data.result.items[0];
    }else if(id.length === 8){
      data = await axios.get(`https://apibay.org/t.php?id=${id}`);
      data = data.data;
    }else if(id.length === 11){
      data = await yt_api("/videos", {params: {part: "statistics,snippet", id:id}});
      data = data.data.items[0];
    }else{
      data = await axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`);
      data = data.data.data.movie
    }

    dispatch({
      type: aT.VIDEO_DATA_SUCCESS,
      payload: data
    });
  }catch(error){
    console.error(error)
    dispatch({
      type: aT.VIDEO_DATA_FAIL,
      payload: error.message
    });
  }
};

export const getRealtedVideos = (id, title) => async (dispatch) => {
  try{
    dispatch({
      type: aT.RELATED_VIDEOS_REQUEST
    });

    var data;
    if(id.length === 40){
      data = await lb_api.post("/proxy?m=claim_search", {jsonrpc: "2.0", method: "claim_search", params: {text: title, not_tags: lJ.not_tags, stream_types: ["video"], claim_type: ["stream"]}});
      data = data.data.result.items;
    }else{
      data = await yt_api("/search", {params: {part: "snippet", relatedToVideoId: id, maxResults: 20, type: "video"}});
      data = data.data.items;
    }


    dispatch({
      type: aT.RELATED_VIDEOS_SUCCESS,
      payload: data
    });
  }catch(error){
    dispatch({
      type: aT.RELATED_VIDEOS_FAIL,
      payload: error.message
    });
  }
};

export const getChannelData = id => async (dispatch) => {
  try{
    dispatch({
      type: aT.CHANNEL_DATA_REQUEST
    });

    var data;
    if(id.length === 40){
      data = await lb_api.post("/proxy?m=claim_search", {jsonrpc: "2.0", method: "claim_search", params: {claim_id: id, not_tags: lJ.not_tags}});
      data = data.data.result.items[0];
    }else{
      data = await yt_api("/channels", {params: {part: "snippet,statistics,contentDetails,brandingSettings", id:id}});
      data = data.data.items[0];
    }

    dispatch({
      type: aT.CHANNEL_DATA_SUCCESS,
      payload: data
    });

  }catch(error){
    dispatch({
      type: aT.CHANNEL_DATA_FAIL,
      payload: error.message
    });
  }
};

export const getComments = (videoId) => async (dispatch) => {
  try{
    dispatch({
      type: aT.COMMENTS_REQUEST
    });
    videoId = videoId.videoId;
    var data = [];

    if(videoId.length === 40){
      data = await axios.post(comment_endpoint, {id: 1, jsonrpc: "2.0", method: "comment.List", params: {claim_id: videoId, top_level: true, sort_by: 3, page_size: 100, page: 1}});
      data = data.data.result.items

      const channel_urls = [];
      for(var i in data){
        channel_urls.push(data[i].channel_url);
      }

      const { data: response } = await lb_api.post("/proxy?m=resolve", {id: 1, jsonrpc: "2.0", method: "resolve", params: {urls: channel_urls}});



      for(var j in data){
        data[j].thumbnail = response.result[data[j].channel_url].value?.thumbnail?.url;
      }

    }else{
      data = await yt_api("/commentThreads", {params: {part: "snippet", videoId: videoId}});
      data = data.data.items;
    }


    dispatch({
      type: aT.COMMENTS_SUCCESS,
      payload: data
    });
  }catch(error){
    dispatch({
      type: aT.COMMENTS_FAIL,
      payload: error.message
    })
  }
}

export const getChannelVideos = id => async (dispatch, getState) => {
  try{
    dispatch({
      type: aT.CHANNEL_VIDEOS_REQUEST
    });

    var pageToken = getState().channelVideos.pageToken;
    var videos = getState().channelVideos.videos;
    var page = getState().channelVideos.page;
    var data;

    videos = videos.filter(function(set){
      return (set?.signing_channel?.claim_id === id) || (set?.snippet?.channelId === id);
    });

    if(id.length === 40){
      data = await lb_api.post("/proxy?m=claim_search", {method: "claim_search", params: {channel_ids: [id], not_tags: lJ.not_tags, page: page, no_totals: true, order_by: ["release_time"]}});
      page = data.data.result.page + 1;
      data = data.data.result.items;
    }else{
      const { data: items } = await yt_api("/channels", {params: {part: "contentDetails", id: id}});
      const uploadId = items.items[0].contentDetails.relatedPlaylists.uploads;

      data = await yt_api("/playlistItems", {params: {part: "snippet,contentDetails", playlistId: uploadId, maxResults: 32, pageToken: pageToken}});
      pageToken = data.data.nextPageToken;
      data = data.data.items;
    }

    dispatch({
      type: aT.CHANNEL_VIDEOS_SUCCESS,
      payload: {
        videos: [...videos, ...data],
        pageToken: pageToken,
        page: page
      }
    });
  }catch(error){
    console.log(error)
    dispatch({
      type: aT.CHANNEL_VIDEOS_FAIL,
      payload: error.message
    });
  }
};

export const searchVideosLbry = query => async dispatch => {
  try{
    dispatch({
      type: aT.LBRY_SEARCH_REQUEST
    });
    const { data } = await lb_api.post("/proxy?m=claim_search", {method: "claim_search", params: {text: query, not_tags: lJ.not_tags}});

    dispatch({
      type: aT.LBRY_SEARCH_SUCCESS,
      payload: data.result.items
    });
  }catch(error){
    dispatch({
      type: aT.LBRY_SEARCH_FAIL,
      payload: error.message
    });
  }
};

export const searchVideosPopcorn = query => async dispatch => {
  try{
    dispatch({
      type: aT.POPCORN_SEARCH_REQUEST
    });

    var params = {};

    params.sort_by = "download_count";
    params.order_by = "desc";
    params.with_rt_ratings = true;
    params.limit = 50;
    params.query_term = query;

    var { data: data_pt } = await axios.get("https://yts.mx/api/v2/list_movies.json?" + new URLSearchParams(params));

    dispatch({
      type: aT.POPCORN_SEARCH_SUCCESS,
      payload: data_pt.data.movies
    });
  }catch(error){
    dispatch({
      type: aT.POPCORN_SEARCH_FAIL,
      payload: error.message
    });
  }
};

export const searchVideosYouTube = query => async dispatch => {
  try{
    dispatch({
      type: aT.YOUTUBE_SEARCH_REQUEST
    });
    const { data } = await yt_api("/search", {params: {part: "snippet", maxResults: 32, q: query, type: "video,channel"}});

    dispatch({
      type: aT.YOUTUBE_SEARCH_SUCCESS,
      payload: data.items,
    });
  }catch(error){
    dispatch({
      type: aT.YOUTUBE_SEARCH_FAIL,
      payload: error.message
    });
  }
};

export const searchVideos = query => async ( dispatch, getState ) => {
  try{
    dispatch({
      type: aT.SEARCHED_VIDEOS_REQUEST
    });

    await dispatch(searchVideosYouTube(query));
    await dispatch(searchVideosLbry(query));

    dispatch({
      type: aT.SEARCHED_VIDEOS_SUCCESS,
      payload: shuffle([...getState().lbrySearch.items, ...getState().youtubeSearch.items])
    });
  }catch(error){
    dispatch({
      type: aT.SEARCHED_VIDEOS_FAIL,
      payload: error.message
    });
  }
};

export const searchVideosWrapper = (query, platform) => async ( dispatch, getState ) => {
  try{
    dispatch({
      type: aT.SEARCHED_VIDEOS_REQUEST
    });

    var videos = [];
    if(platform === "All"){
      await dispatch(searchVideos(query));
      videos = getState().searchVideos.items;
    }else if(platform === "YouTube"){
      await dispatch(searchVideosYouTube(query));
      videos = getState().youtubeSearch.items;
    }else if(platform === "Lbry/Odysee"){
      await dispatch(searchVideosLbry(query));
      videos = getState().lbrySearch.items;
    }else if(platform === "Popcorn Time"){
      await dispatch(searchVideosPopcorn(query));
      videos = getState().popcornSearch.items;
    }

    dispatch({
      type: aT.SEARCHED_VIDEOS_SUCCESS,
      payload: videos
    });
  }catch(error){
    dispatch({
      type: aT.SEARCHED_VIDEOS_FAIL,
      payload: error.message
    });
  }
}
