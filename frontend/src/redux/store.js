import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk"

import { popularVideosReducer, videoDataReducer, channelDataReducer, relatedVideosReducer, commentsReducer, channelVideosReducer, lbrySearchReducer, youtubeSearchReducer, searchReducer, popcornSearchReducer } from "./reducers";

const appReducer = combineReducers({
  popularVideos: popularVideosReducer,
  channelVideos: channelVideosReducer,
  relatedVideos: relatedVideosReducer,
  youtubeSearch: youtubeSearchReducer,
  popcornSearch: popcornSearchReducer,
  channelData: channelDataReducer,
  lbrySearch: lbrySearchReducer,
  searchVideos: searchReducer,
  videoData: videoDataReducer,
  comments: commentsReducer,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const store = createStore(rootReducer, {}, composeWithDevTools(applyMiddleware(thunk)));

export default store;
