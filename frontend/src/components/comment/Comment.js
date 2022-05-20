import moment from "moment";
import "./comment.scss";

const backgroundColors = ["#c3195d", "#ff9a3c", "#d59bf6", "#eb2632", "#0a9396", "#03045e", "#212529", "#582f0e"];

const getRandomColor = () => {
  return backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
};

const Comment = commentData => {
  commentData = commentData.commentData;
  var backgroundColor = "#131c40";
  var profileImage;
  var publishedAt;
  var authorName;
  var comment;

  var anon = "https://thumbnails.odycdn.com/optimize/s:180:180/quality:85/plain/https://player.odycdn.com/speech/spaceman-png:2.png";

  if(commentData.claim_id){
    backgroundColor = getRandomColor();
    profileImage = commentData.thumbnail
    publishedAt = new Date(commentData.timestamp * 1000);
    authorName = commentData.channel_name;
    comment = commentData.comment;
  }


  if(commentData.kind){
    commentData = commentData.snippet.topLevelComment.snippet;
    profileImage = commentData.authorProfileImageUrl;
    publishedAt = commentData.publishedAt;
    authorName = commentData.authorDisplayName;
    comment = commentData.textDisplay;
  }

  return (
    <div className="comment p-2 d-flex">
      <img className="comment_img" src={profileImage ? (profileImage) : (anon)} alt="" style={{background: backgroundColor}}/>
      <div className="comment_body">
        <span className="comment_header mb-1">{authorName} • {moment(publishedAt).fromNow()}</span>
        <span className="mb-0">{comment}</span>
      </div>
    </div>
  );
};

export default Comment;
