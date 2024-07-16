const { selectTopics, selectArticleById } = require("../model/nc_news.models");
const endpoints = require("../endpoints.json");

function getAPI(request, response) {
	return response.status(200).send(endpoints);
}

function getArticleById(request, response, next) {
	const articleId = Number(request.params.article_id);
	return selectArticleById(articleId)
		.then((article) => {
			response.status(200).send(article[0]);
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

module.exports = { getTopics, getAPI, getArticleById };
