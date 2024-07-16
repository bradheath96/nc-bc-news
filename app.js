const express = require("express");

const {
	getTopics,
	getAPI,
	getArticleById,
} = require("./controllers/nc_news.controller");

const {
	serverErrorsHandler,
	customeErrorHandler,
} = require("./controllers/error.controller");

const app = express();

app.get("/api", getAPI);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res) => {
	res.status(404).send({ message: "endpoint not found" });
});

app.use(customeErrorHandler);

app.use(serverErrorsHandler);

module.exports = app;
