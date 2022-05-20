import axios from "axios";
const yt_api = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3/",
  params: {
    key: "AIzaSyDhjhr0GPIEfqzyFiuhPJS5qJWReIn6pfs"
  }
});

export default yt_api;
