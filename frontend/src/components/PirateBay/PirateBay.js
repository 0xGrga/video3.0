import { useEffect, useState } from "react";
import prettyBytes from 'pretty-bytes';
import moment from "moment";
import axios from "axios";

import "./pirateBay.scss";

const PirateBay = ({videoData}) => {
  const publishedAt = new Date(videoData.added * 1000);
  const channelTitle = videoData.username;
  const description = videoData.descr;
  const title = videoData.name;

  const [ files, setFiles ] = useState();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/getfiles/${videoData.info_hash}`).then(
      function(data){
        setFiles(data.data)
      }
    );
  }, [videoData, setFiles])

  //add way to see every file :torrent/:file or :size
  //add link to channel
  //add seeds and leaches

  return (
    <div className="pirateBay">
      <div className="pirateBay_top">
        <h5>{title}</h5>
        <pre>
          Uploaded: {moment(publishedAt).fromNow()} by {channelTitle}
        </pre>
      </div>
      <br />
      <div className="pirateBay_files">
        <ul>
          {files?.map((file, i) => {
            return <li key={i}>
              <span className="pirateBay_files_name">{file[0]}</span>
              <span className="pirateBay_files_size">{prettyBytes(file[1])}</span>
            </li>
          })}
        </ul>
      </div>
      <br />
      <div className="pirateBay_desc">
        {description}
      </div>
    </div>
  );
};

export default PirateBay;
