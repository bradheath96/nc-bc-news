function customeErrorHandler(err, req, res, next) {
	if (err.status && err.message) {
		res.status(err.status).send({ message: err.message });
	} else {
		next(err);
	}
}

function serverErrorsHandler(err, req, res, next) {
	res.status(500).send({ msg: "Internal Server Error" });
}

module.exports = { serverErrorsHandler, customeErrorHandler };
