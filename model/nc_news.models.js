const db = require("../db/connection.js");

function selectTopics() {
    return db.query(`SELECT slug, description FROM topics`)
        .then((topics) => {
            return topics.rows
        })
}

module.exports = { selectTopics }