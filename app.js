const express = require("express");

const {
	getTopics,
	getAPI,
	getArticleById,
	getArticles,
	getCommentsByArticleId,
	postCommentByArticleId,
	patchArticleById
} = require("./controllers/nc_news.controller");

const {
	serverErrorsHandler,
	customeErrorHandler,
} = require("./controllers/error.controller");

const app = express();

app.use(express.json());

app.get("/api", getAPI);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:articles_id/comments", postCommentByArticleId);


app.all("*", (req, res) => {
	res.status(404).send({ message: "endpoint not found" });
});

app.use(customeErrorHandler);
app.use(serverErrorsHandler);

module.exports = app;
