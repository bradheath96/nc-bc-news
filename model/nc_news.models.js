const db = require("../db/connection.js");

function selectTopics() {
	return db.query(`SELECT slug, description FROM topics`).then((topics) => {
		return topics.rows;
	});
}

function selectArticles(sorted_by, order) {
	const validColumns = [
		"article_id",
		"title",
		"topic",
		"author",
		"created_at",
		"votes",
		"article_image_url",
		"comment_count",
	];
	const validOrders = ["asc", "desc"];
	
	if (!sorted_by && !order) {
		return db
			.query(
				`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
				COUNT(comments.comment_id)::INT AS comment_count
				FROM articles LEFT JOIN comments
				ON articles.article_id = comments.article_id
				GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url
				ORDER BY articles.created_at DESC;`
			)
			.then((articles) => {
				return articles.rows;
			});
	} else {
		if (!validColumns.includes(sorted_by) || !validOrders.includes(order)) {
			return Promise.reject({
				status: 400,
				message: "Invalid query parameter",
			});
		}
		const queryString = `
        SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sorted_by} ${order}`;

		return db.query(queryString).then((articles) => {
			return articles.rows;
		});
	}
}

function selectArticleById(articleId) {
	if (isNaN(articleId)) {
		return Promise.reject({
			status: 400,
			message: "not a valid article ID",
		});
	}

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

function selectArticlesByTopic(topic) {
	
	return db.query(`SELECT * FROM articles WHERE topic = $1`, [topic])
		.then((articles) => {
			if (articles.rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: `no article found under ${topic}`,
				});
			}
			return articles.rows
	})
}

function selectUsers() {
	return db
		.query(`SELECT username, name, avatar_url FROM users`)
		.then((users) => {
			return users.rows;
		});
}

function selectCommentsByArticleId(articleId) {
	if (isNaN(articleId)) {
		return Promise.reject({
			status: 400,
			message: "not a valid article ID",
		});
	}

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
		.then((comments) => comments.rows);
}

function insertCommentByArticleId(articleId, username, body) {
	if (isNaN(articleId)) {
		return Promise.reject({
			status: 400,
			message: "not a valid article ID",
		});
	}
	if (!username || !body) {
		return Promise.reject({
			status: 400,
			message: "missing required fields: username and body",
		});
	}

	return db
		.query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: `no article found for article_id ${articleId}`,
				});
			} else {
				return db.query(
					`INSERT INTO comments (article_id, author, body)
						VALUES ($1, $2, $3)
						RETURNING comment_id, author, body`,
					[articleId, username, body]
				);
			}
		})
		.then(({ rows }) => rows[0]);
}

function deleteCommentById(commentId) {
	if (isNaN(commentId)) {
		return Promise.reject({
			status: 400,
			message: "Invalid comment ID",
		});
	}

	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: `no comment found under comment_id ${commentId}`,
				});
			} else {
				return db.query("DELETE FROM comments WHERE comment_id = $1", [
					commentId,
				]);
			}
		})
		.then((result) => result);
}

function updateArticleVotesByArticleId(artilceId, incVotes) {
	if (isNaN(artilceId)) {
		return Promise.reject({
			status: 400,
			message: "Invalid article ID",
		});
	}

	if (incVotes === undefined) {
		return Promise.reject({
			status: 400,
			message: "Missing required field: inc_votes",
		});
	}

	if (typeof incVotes !== "number") {
		return Promise.reject({
			status: 400,
			message: "Invalid value for inc_votes",
		});
	}

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
		.then(({ rows }) => rows[0]);
}

module.exports = {
	selectTopics,
	selectUsers,
	selectArticles,
	selectArticlesByTopic,
	selectArticleById,
	selectCommentsByArticleId,
	insertCommentByArticleId,
	updateArticleVotesByArticleId,
	deleteCommentById,
};
