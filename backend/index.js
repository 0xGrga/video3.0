const torrentStream = require("torrent-stream");
const youtube = require("youtube-info-streams");
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const axios = require("axios")
const cors = require("cors");

require("dotenv").config();
const app = express();

const CHUNK_SIZE = 1000000;
const PORT = 4000;

app.name = "API";
app.use(cors());

app.set('trust proxy', true);
app.use(bodyParser.urlencoded({ extended: true, limit: "1000mb" }));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(morgan("dev"));

app.get("/yt/:id", async (req, res) => {
  try{
    youtube.info(req.params.id).then(
      data => {
        data = data
        //const video_urls = data.playerResponse.streamingData.formats;
        var url = undefined;
        var quality = 0;
        [...data.playerResponse.streamingData.formats, ...data.player_response.streamingData.formats].forEach((item, i) => {
          if(item.mimeType.split(";")[0] === "video/mp4"){
            if(item.qualityLabel.split("p")[0] > quality){
              quality = item.qualityLabel.split("p")[0];
              url = item.url;
            }
          }
        });

        res.send(url);

      }
    );
  }catch(error){
    res.send(error)
  }
});

app.get("/view_count/:id/:auth_token", async (req, res) => {
  try{
    axios.get(`https://api.odysee.com/file/view_count?auth_token=${req.params.auth_token}&claim_id=${req.params.id}`).then(
      data => res.send(data.data)
    )
  }catch(error){
    res.send(error);
  }
});

app.get("/ls/:id", async (req, res) => {
  try{
    axios.post(`http://localhost:5001/api/v0/ls?arg=${req.params.id}`).then(
      data => res.send(data.data)
    )
  }catch(error){
    res.send(error)
  }
});

app.get("/reaction/:id/:auth_token", async (req, res) => {
  try{
    axios.post(`https://api.odysee.com/reaction/list?auth_token=${req.params.auth_token}&claim_ids=${req.params.id}`).then(
      data => res.send(data.data)
    )
  }catch(error){
    res.send(error);
  }
});

app.get("/sub_count/:id/:auth_token", async (req, res) => {
  try{
    axios.get(`https://api.odysee.com/subscription/sub_count?auth_token=${req.params.auth_token}&claim_id=${req.params.id}`).then(
      data => res.send(data.data)
    )
  }catch(error){
    res.send(error);
  }
});

app.get("/video/:magnet", async (req, res) => {
  const magnet = `magnet:?xt=urn:btih:${req.params.magnet}`;
  try {
    const engine = torrentStream(magnet);
    engine.on("ready", function () {
      var file = undefined;
      var size = 0;
      engine.files.forEach(function (_file) {
        if(_file.length > size){
          size = _file.length;
          file = _file;
        }
      });

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Length", file.length);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "must-revalidate");
      file.createReadStream({highWaterMark: CHUNK_SIZE}).pipe(res);
    });
  } catch (error) {
    console.log(error);
    res.send("Not Found");
  }
});

app.get("/download/:magnet", async (req, res) => {
  const magnet = `magnet:?xt=urn:btih:${req.params.magnet}`;
  try {
    const engine = torrentStream(magnet);
    engine.on("ready", function () {
      var file = undefined;
      var size = 0;
      engine.files.forEach(function (_file) {
        if(_file.length > size){
          size = _file.length;
          file = _file;
        }
      });

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`)
      res.setHeader("Content-Length", file.length);
      file.createReadStream({highWaterMark: CHUNK_SIZE}).pipe(res);
    });
  } catch (error) {
    console.log(error);
    res.send("Not Found");
  }
});

app.get("/getfiles/:magnet", async (req, res) => {
  const magnet = `magnet:?xt=urn:btih:${req.params.magnet}`;
  try {
    const engine = torrentStream(magnet);
    engine.on("ready", function () {
      const files = []
      engine.files.forEach(function (_file) {
        files.push([_file.name, _file.length])
      });

      res.setHeader("Content-Type", "application/json");
      res.send(files)
    });
  } catch (error) {
    console.log(error);
    res.send("Not Found");
  }
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log("Server Has Started on port " + PORT);
});
