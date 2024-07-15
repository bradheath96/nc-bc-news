function serverErrorsHandler(err, req, res, next) {
	res.status(500).send({ msg: "Internal Server Error" });
}

function handleNotFound(req, res, next) {
	res.status(404).send({ message: "endpoint not found" });
}

module.exports = { serverErrorsHandler, handleNotFound };
