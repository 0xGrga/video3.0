import "./skeleton.scss";

const LoadingVideo = () => {
  return (
    <div className="skeleton">
      <div className="skeleton_top">
      </div>
      <div className="skeleton_title"></div>
      <div className="skeleton_channel">
        <div className="skeleton_channel_img"></div>
        <div>
          <div className="lines" style={{width: "20vh", marginTop: "0.7rem"}}>&nbsp;</div>
          <div className="lines" style={{width: "10vh"}}>&nbsp;</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingVideo;
