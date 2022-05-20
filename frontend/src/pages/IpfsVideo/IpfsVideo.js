import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import prettyBytes from 'pretty-bytes';
import axios from "axios";
import CID from "cids";
import "./ipfsVideo.scss";

const IpfsVideo = () => {
  const { ipfscid } = useParams();
  const base32cid = new CID(ipfscid).toV1().toString('base32');

  const [ files, setFiles ] = useState();
  const [ path, setPath] = useState();


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
    setPath(path_);
  }
console.log(`http://${base32cid}.localhost:8080/ipfs/${ipfscid}/${encodeURIComponent(path)}`)
  return (
    <>
      {path ? (
        <div className="player">
          <video controls src={`http://${base32cid}.localhost:8080/ipfs/${ipfscid}/${encodeURIComponent(path)}`}></video>
        </div>
      ) : (
        <></>
      )}
      {files && files.length === 1 && (
        <div className="player">
          <video controls src={`http://${base32cid}.localhost:8080/ipfs/${ipfscid}`}></video>
        </div>
      )}
      {files ? (
        <>
          <h4>Files:</h4>
          <table className="table">
            <tbody>
              <tr>
                <td>Name</td>
                <td>Path</td>
                <td>Size</td>
                <td>Type</td>
              </tr>
              {files.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td onClick={() => handleClick(item.path)} className="hover">{item.path}</td>
                  <td>{prettyBytes(item.size)}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="spinner-border text-danger d-block mx-auto"></div>
      )}
    </>
  );
};

export default IpfsVideo;
