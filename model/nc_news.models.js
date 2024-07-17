const db = require("../db/connection.js");

function selectArticleById(articleId) {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: `no article found under article_id ${articleId}`,
				});
			}
			return rows;
		});
}

function fetchCommentsByArticleId(articleId) {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: `no article found under article_id ${articleId}`,
				});
			} else {
				return db.query(
					`SELECT comment_id, votes, created_at, author, body, article_id
					FROM comments
					WHERE article_id = $1
					ORDER BY created_at DESC`,
					[articleId]
				);
			}
		})
		.then((comments) => comments.rows)
}

function insertCommentByArticleId(articleId, username, body) {
	return db
		.query(
			`INSERT INTO comments (article_id, author, body)
            VALUES ($1, $2, $3)
            RETURNING comment_id, author, body`,
			[articleId, username, body]
		)
		.then(({ rows }) => {
			return rows[0];
		})
		.catch((err) => {
			throw err;
		});
}

function deleteCommentById(commentId) {
	return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: `no comment found under comment_id ${commentId}`,
				});
			} else {
				return db.query('DELETE FROM comments WHERE comment_id = $1', [commentId]);
			}
		})
		.then((result) => result);
}

function updateArticleVotesByArticleId(artilceId, incVotes) {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [artilceId])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: `no article found under article_id ${artilceId}`,
				});
			} else {
				return db.query(
					`
					UPDATE articles
					SET votes = votes + $1
					WHERE article_id = $2
					RETURNING *
					`,
					[incVotes, artilceId]
				); 
			}
		})
		.then(({rows}) => rows[0])
}

function selectTopics() {
	return db.query(`SELECT slug, description FROM topics`).then((topics) => {
		return topics.rows;
	});
}

function fetchArticles() {
	return db
		.query(
			`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes,
            COUNT(comments.comment_id)::INT AS comment_count 
            FROM articles LEFT JOIN comments 
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`
		)
		.then((articles) => {
			return articles.rows;
		});
}

module.exports = {
	selectTopics,
	selectArticleById,
	fetchArticles,
	fetchCommentsByArticleId,
	insertCommentByArticleId,
	updateArticleVotesByArticleId,
	deleteCommentById,
};
