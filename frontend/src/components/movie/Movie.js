import { BsHeartFill, BsHeartHalf, BsHeart } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import "./movie.scss";

const Movie = ({ videoData }) => {
  const history = useHistory();

  var rating_h = videoData.rating / 2;
  const rating_l = [];
  for(var i = 0;i < 5;i++){
    if(rating_h >= 1){
      rating_l.push(<BsHeartFill key = {i}/>);
    }else if(rating_h <= 0){
      rating_l.push(<BsHeart key = {i} />);
    }else{
      rating_l.push(<BsHeartHalf key = {i} />);
    }
    rating_h--;
  }

  const handleClick = () => {
    history.push(`/video/${videoData.id}`);
  }

  return (
    <div className="movie" onClick={handleClick}>
      <div className="movie_img">
        <img src={videoData.medium_cover_image} alt="" />
        <div>
          {rating_l.map(item => item)}
          <span>{videoData.rating}/10</span>
        </div>
      </div>
      <span>{videoData.title_english}</span>
    </div>
  );
};
export default Movie;
