import * as aT from "./actionTypes.js";

export const popularVideosReducer = (
  state = {
    nextPageToken: null,
    nextPopPage: 1,
    loading: false,
    nextPage: 1,
    videos: []
  }, action
) => {
  const { type, payload } = action;
  switch(type){
    case aT.POPULAR_VIDEOS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.POPULAR_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        videos: payload.videos,
        nextPage: payload.nextPage,
        nextPopPage: payload.nextPopPage,
        nextPageToken: payload.nextPageToken
      };
    case aT.POPULAR_VIDEOS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  };
};

export const videoDataReducer = (
  state = {
    loading: false,
    videoData: {}
  }, action
) => {
  const { type, payload } = action;
  switch(type){
    case aT.VIDEO_DATA_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.VIDEO_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        videoData: payload
      };
    case aT.VIDEO_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  };
};

export const channelDataReducer = (
  state = {
    loading: false,
    channelData: {}
  }, action
) => {
  const { payload, type } = action;
  switch(type){
    case aT.CHANNEL_DATA_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.CHANNEL_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        channelData: payload
      };
    case aT.CHANNEL_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  };
};

export const relatedVideosReducer = (
  state = {
    loading: false,
    videos: []
  }, action
) => {
  const { type, payload } = action;
  switch(type){
    case aT.RELATED_VIDEOS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.RELATED_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        videos: payload
      };
    case aT.RELATED_VIDEOS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  };
};

export const commentsReducer = (
  state = {
    loading: false,
    comments: []
  }, action
) => {
  const { type, payload } = action;
  switch(type){
    case aT.COMMENTS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.COMMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        comments: payload
      };
    case aT.COMMENTS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  };
};

export const channelVideosReducer = (
  state = {
    pageToken: null,
    loading: false,
    videos: [],
    page: 1
  }, action
) => {
  const { type, payload } = action;
  switch(type){
    case aT.CHANNEL_VIDEOS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.CHANNEL_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        videos: payload.videos,
        page: payload.page,
        pageToken: payload.pageToken
      };
    case aT.CHANNEL_VIDEOS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  }
};

export const lbrySearchReducer = (
  state = {
    loading: false,
    items: []
  }, action
) => {
  const { payload, type } = action;
  switch(type){
    case aT.LBRY_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case aT.LBRY_SEARCH_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.LBRY_SEARCH_SUCCESS:
      return {
        ...state,
        items: payload,
        loading: false
      };
    default:
      return state;
  }
};

export const popcornSearchReducer = (
  state = {
    loading: false,
    items: []
  }, action
) => {
  const { payload, type } = action;
  switch(type){
    case aT.POPCORN_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case aT.POPCORN_SEARCH_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.POPCORN_SEARCH_SUCCESS:
      return {
        ...state,
        items: payload,
        loading: false
      };
    default:
      return state;
  }
};

export const youtubeSearchReducer = (
  state = {
    loading: false,
    items: []
  }, action
) => {
  const { payload, type } = action;
  switch(type){
    case aT.YOUTUBE_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case aT.YOUTUBE_SEARCH_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.YOUTUBE_SEARCH_SUCCESS:
      return {
        ...state,
        items: payload,
        loading: false
      };
    default:
      return state;
  }
};

export const searchReducer = (
  state = {
    loading: false,
    items: []
  }, action
) => {
  const { payload, type } = action;
  switch(type){
    case aT.SEARCHED_VIDEOS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case aT.SEARCHED_VIDEOS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case aT.SEARCHED_VIDEOS_SUCCESS:
      return {
        ...state,
        items: payload,
        loading: false
      };
    default:
      return state;
  }
};
