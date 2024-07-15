const { selectTopics } = require("../model/nc_news.models");

function getTopics(request, response) {
	return selectTopics()
		.then((topics) => {
			response.status(200).send(topics);
		})
		.catch((error) => {
			next(error);
		});
}

module.exports = { getTopics };
