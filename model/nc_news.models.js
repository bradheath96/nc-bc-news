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

function selectTopics() {
	return db.query(`SELECT slug, description FROM topics`).then((topics) => {
		return topics.rows;
	});
}

module.exports = { selectTopics, selectArticleById };
