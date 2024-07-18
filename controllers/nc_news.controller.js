const {
	selectTopics,
	selectUsers,
	selectArticles,
	selectArticleById,
	selectCommentsByArticleId,
	insertCommentByArticleId,
	updateArticleVotesByArticleId,
	deleteCommentById,
} = require("../model/nc_news.models");

const endpoints = require("../endpoints.json");

function getAPI(request, response, next) {
	return response.status(200).send({ endpoints: endpoints});
}

function getArticles(request, response, next) {
	return selectArticles()
		.then((articles) => {
			response.status(200).send({ articles: articles });
		})
		.catch(next);
}

function getTopics(request, response, next) {
	return selectTopics()
		.then((topics) => {
			response.status(200).send({ topics: topics});
		})
		.catch(next)
}

function getUsers(request, response, next) {
	return selectUsers()
		.then((users) => {
			response.status(200).send({users: users})
		})
		.catch(next)
}

function getArticleById(request, response, next) {
	const articleId = Number(request.params.article_id);

	return selectArticleById(articleId)
		.then((article) => {
			response.status(200).send(article[0]);
		})
		.catch(next);
}

function patchArticleById(request, response, next) {
	const articleId = Number(request.params.article_id);
	const { inc_votes } = request.body;

	return updateArticleVotesByArticleId(articleId, inc_votes)
		.then((article) => {
			response.status(200).send({ article: article });
		})
		.catch(next);
}

function getCommentsByArticleId(request, response, next) {
	const articleId = Number(request.params.article_id);

	return selectCommentsByArticleId(articleId)
		.then((comments) => {
			response.status(200).send({ comments: comments });
		})
		.catch(next);
}

function postCommentByArticleId(request, response, next) {
	const articleId = request.params.articles_id;
	const { username, body } = request.body;

	return insertCommentByArticleId(articleId, username, body)
		.then((comment) => {
			response.status(201).send(comment);
		})
		.catch(next);
}

function deleteComment(request, response, next) {
	const commentId = Number(request.params.comment_id);

	return deleteCommentById(commentId)
		.then(() => {
			response.status(204).send();
		})
		.catch(next);
}

module.exports = {
	getAPI,
	getTopics,
	getArticles,
	getUsers,
	getArticleById,
	getCommentsByArticleId,
	postCommentByArticleId,
	patchArticleById,
	deleteComment,
};
