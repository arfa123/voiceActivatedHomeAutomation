var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.headers['x-access-token'];
	if (!token) return res.status(403).send({ message: 'No token provided.' });

	// verifies secret and checks exp
	jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded) {
		if (err) return res.status(401).send({ message: 'Failed to authenticate token.' });

		// if everything is good, save to request for use in other routes
		req.userId = decoded.id;
		next();
	});

}

module.exports = {
	verifyToken
};