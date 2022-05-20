import { BsDownload } from "react-icons/bs";
import moment from "moment";
import "./popcorn.scss";

const PopCornVideo = ({videoData}) => {
  //add switch for quality
  var magnet = "";
  var seeds = 0;
  videoData?.torrents?.forEach(set => {
    if(set.seeds > seeds && set.quality === "720p"){
      magnet = set.hash;
      seeds = set.seeds;
    }
  })

  return (
    <div className="popcorn">
      <div className="popcorn_video">
        <video autoPlay={true} controls>
          {magnet && <source src={`${process.env.REACT_APP_API}/video/${magnet}`} type="video/mp4"></source>}
        </video>
      </div>
      <div className="popcorn_title">
        <span>{videoData?.title_english}</span>
        <a href={`${process.env.REACT_APP_API}/download/${magnet}`}>
          <BsDownload size={23}/>
        </a>
      </div>
      <div className="popcorn_data">
        <span>Uploaded: {moment(new Date(videoData?.date_uploaded_unix * 1000)).format("MMMM Do YYYY")}</span>
        <span>Genres: {videoData?.genres?.map((genre, i) => {return i === 0 ? genre : `, ${genre}`})}</span>
        <span>Description: </span>
        <span>{videoData?.description_full}</span>
      </div>
    </div>
  );
};

export default PopCornVideo;
