const express = require("express");
const cors = require("cors");


const {
	getTopics,
	getAPI,
	getUsers,
	getArticles,
	getArticleById,
	getCommentsByArticleId,
	postCommentByArticleId,
	patchArticleById,
	deleteComment,
} = require("./controllers/nc_news.controller");

const {
	serverErrorsHandler,
	customeErrorHandler,
} = require("./controllers/error.controller");

const app = express();

app.use(cors());


app.use(express.json());

app.get("/api", getAPI);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:articles_id/comments", postCommentByArticleId);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", (req, res) => {
	res.status(404).send({ message: "endpoint not found" });
});

app.use(customeErrorHandler);
app.use(serverErrorsHandler);

module.exports = app;
