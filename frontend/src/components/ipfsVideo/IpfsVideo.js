import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import prettyBytes from 'pretty-bytes';
import axios from "axios";
import CID from "cids";
import "./ipfsVideo.scss";

const VideoIpfs = () => {
  const { ipfscid, path } = useParams();
  const base32cid = new CID(ipfscid).toV1().toString('base32');

  const [ files, setFiles ] = useState();


  useEffect(() => {
    async function listFiles () {
      var files_ = {};
      axios(`${process.env.REACT_APP_API}/ls/${ipfscid}`).then(
        data => {
          data = data.data.Objects[0];
          data.Links.forEach((item, i) => {
            files_[item.Name] = files_[item.Name] ? files_[item.Name] : {name: null, size: 0, path: null, type: null};
            files_[item.Name].name = item.Name;
            files_[item.Name].size += item.Size;
            files_[item.Name].path = item.Name;
            files_[item.Name].type = item.Type === 2 ? "file" : "directory";
          });

          files_ = Object.values(files_);
          setFiles(files_);
        }
      );
    }

    listFiles();
  }, [setFiles, ipfscid])

  const handleClick = (path_) => {
    //setPath(path_);
  }

  return (
    <>
      <div className="player">
        <video controls src={`http://${base32cid}.localhost:8080/ipfs/${ipfscid}/${encodeURIComponent(path)}`}></video>
      </div>
    </>
  );
};

export default VideoIpfs;
