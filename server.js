require('dotenv').config()
const express = require('express');
const app = express();
const notion = require('./notion.js');
const cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

var movieRouter = express.Router();

movieRouter.get("/getAllMovieSelectOptions", (req, res) => {
  notion.getAllMovieSelectOptions().then(response => {
    res.send(response);
  });
});

movieRouter.post("/createUnwatchedMovie", async (req, res) => {
  res.send(await notion.createUnwatchedMovieFromRequestBody(req.body));
});

movieRouter.post("/createWatchedMovie",  async (req, res) => {
  res.send(await notion.createWatchedMovieFromRequestBody(req.body));
});

app.use(movieRouter);
app.listen(process.env.PORT);
module.exports = app;