const httpStatus = require("http-status-codes");

module.exports = {
	// 에러 로그
	logErrors: (error, req, res, next) => {
		console.error(error.stack);
		next(error);
	},

	// 페이지 부재 404 대응 
	respondNoResourceFound: (req, res) => {
		let errorCode = httpStatus.NOT_FOUND;
		res.status(errorCode);
		res.send(`${errorCode} | The page does not exist! 404`);
	},
	
	// 라우트에 매칭되지 않은 에러 대응 
	respondInternalError: (error, req, res, next) => {
		let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
		console.log(`ERROR occurred: ${error.stack}`);
		res.status(errorCode);
		res.send(`${errorCode} | Sorry, our application is experiencing a problem 500!`);
	}
};