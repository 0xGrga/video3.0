import { Row, Col } from "react-bootstrap";

import "./skeleton.scss";

const LoadingSearchVideo = () => {
  return (
    <Row className="searchVideoSkeleton">
      <Col xs={4} className="searchVideoSkeleton_img">
      </Col>
      <Col xs={8} className="searchVideoSkeleton_details">
        <div className="searchVideoSkeleton_details_lines" style={{width: "40vh"}}>&nbsp;</div>
        <div>
          <div className="searchVideoSkeleton_details_lines" style={{width: "30vh"}}>&nbsp;</div>
        </div>
      </Col>
    </Row>
  );
};

export default LoadingSearchVideo;
