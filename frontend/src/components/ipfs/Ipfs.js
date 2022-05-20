import { AiOutlineSearch } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import prettyBytes from 'pretty-bytes';
import axios from "axios";
import "./ipfs.scss";

//QmcoDLGJK1PZiCXQeeBWoqGsTknZsH1b5nNjuKXUkzh78i

const Ipfs = () => {
  const [ ipfsHash, setIpfsHash ] = useState();
  const [ files, setFiles ] = useState();
  const history = useHistory();

  useEffect(() => {
    async function listFiles () {
      var files_ = {};
      axios(`${process.env.REACT_APP_API}/ls/QmcoDLGJK1PZiCXQeeBWoqGsTknZsH1b5nNjuKXUkzh78i`).then(
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
  }, [setFiles])

  const handleIPFS = () => {
    history.push(`/ipfs/${ipfsHash}`)
  }

  const handleClick = (path) => {
    history.push(`/ipfs/QmcoDLGJK1PZiCXQeeBWoqGsTknZsH1b5nNjuKXUkzh78i/${path}`)
  };

  return (
    <div className="ipfs">
      <h1>Enter IPFS CID</h1>
      <form onSubmit={handleIPFS}>
        <input type="text" placeholder="Search" value={ipfsHash} onChange={search => setIpfsHash(search.target.value)} />
        <button type="submit">
          <AiOutlineSearch size={22} />
        </button>
      </form>
      <br /><br /><br />
      {files ? (
        <>
          <h4>Popular videos</h4>
          <table className="table">
            <tbody>
              <tr>
                <td>Name</td>
                <td>Size</td>
                <td>Type</td>
              </tr>
              {files.map((item, i) => (
                <tr key={i}>
                  <td onClick={() => handleClick(item.path)} className="hover">{item.name}</td>
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
    </div>
  );
};

export default Ipfs;
