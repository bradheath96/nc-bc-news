const express = require("express");

const { getTopics, getAPI } = require("./controllers/nc_news.controller");

const { serverErrorsHandler } = require("./controllers/error.controller");

const app = express();


app.get("/api", getAPI)
app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
    res.status(404).send({message: "endpoint not found"})
})
app.use(serverErrorsHandler);

module.exports = app;
