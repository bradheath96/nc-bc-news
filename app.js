const express = require("express");

const { getTopics } = require("./controllers/nc_news.controller");

const {
	serverErrorsHandler,
	handleNotFound,
} = require("./controllers/error.controller");

const app = express();

app.get("/api/topics", getTopics);

app.use(handleNotFound);
app.use(serverErrorsHandler);

module.exports = app;
