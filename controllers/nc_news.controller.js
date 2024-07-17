const {
	selectTopics,
	selectArticleById,
	fetchArticles,
	fetchCommentsByArticleId,
	insertCommentByArticleId,
} = require("../model/nc_news.models");
const endpoints = require("../endpoints.json");

function getAPI(request, response) {
	return response.status(200).send(endpoints);
}

function getArticleById(request, response, next) {
	const articleId = Number(request.params.article_id);
	if (isNaN(articleId)) {
		return response.status(400).send({ message: "not a valid article ID" });
	}
	return selectArticleById(articleId)
		.then((article) => {
			response.status(200).send(article[0]);
		})
		.catch(next);
}

function getCommentsByArticleId(request, response, next) {
	const articleId = Number(request.params.article_id);
	if (isNaN(articleId)) {
		return response.status(400).send({ message: "not a valid article ID" });
	}
	return fetchCommentsByArticleId(articleId)
		.then((comments) => {
			response.status(200).send({ comments: comments });
		})
		.catch(next);
}

function postCommentByArticleId(request, response, next) {
	const articleId = request.params.articles_id;
	const { username, body } = request.body;

	if (isNaN(articleId)) {
		return response.status(400).send({ message: "not a valid article ID" });
	}
	if (!username || !body) {
		return response.status(400).send({ message: "missing required fields: username and body" });
	}

	return insertCommentByArticleId(articleId, username, body)
		.then((comment) => {
			response.status(201).send(comment);
		})
		.catch((err) => {
			if (err.code === '23503') {
				response
					.status(404).send({ message: `no article found for article_id ${articleId}`});
			} else {
				next(err)
			}
		});
}

function getArticles(request, response, next) {
	return fetchArticles()
		.then((articles) => {
			response.status(200).send({ articles: articles });
		})
		.catch(next);
}

function getTopics(request, response) {
	return selectTopics()
		.then((topics) => {
			response.status(200).send(topics);
		})
		.catch((error) => {
			next(error);
		});
}

module.exports = {
	getTopics,
	getAPI,
	getArticleById,
	getArticles,
	getCommentsByArticleId,
	postCommentByArticleId,
};
