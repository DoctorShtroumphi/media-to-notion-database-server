require('dotenv').config()
const express = require('express');
const app = express();
require('express-async-errors');
const notion = require('./notion.js');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var movieRouter = express.Router();

movieRouter.get("/getAllSelectOptions", (req, res) => { 
  notion.getAllSelectOptions().then(response => {
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