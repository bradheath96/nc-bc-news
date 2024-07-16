const { selectTopics } = require("../model/nc_news.models");
const endpoints = require("../endpoints.json")

function getAPI(request, response) {
    return response.status(200).send(endpoints)
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

module.exports = { getTopics, getAPI };
