const renderJson = (req, res, next) => {
	const response = {};
	response.status = req.responseStatus || 200;
	response.result = req.responseObject;
	res.status(response.status).send(response);
	next();
}

module.exports = renderJson;