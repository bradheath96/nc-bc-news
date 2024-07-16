const {
	selectTopics,
	selectArticleById,
	fetchArticles,
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

module.exports = { getTopics, getAPI, getArticleById, getArticles };
