const { constants } = require("../constants");

const errorResponses = {
  [constants.VALIDATION_ERROR]: {
    title: "Validation Failed",
  },
  [constants.NOT_FOUND]: {
    title: "Not Found",
  },
  [constants.UNAUTHORIZED]: {
    title: "Unauthorized",
  },
  [constants.FORBIDDEN]: {
    title: "Forbidden",
  },
  [constants.SERVER_ERROR]: {
    title: "Server Error",
  },
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;

  if (errorResponses[statusCode]) {
    res.json({
      ...errorResponses[statusCode],
      message: err.message,
      stackTrace: err.stack,
    });
  } else {
    console.log("No Error, All Good!");
  }
};

module.exports = errorHandler;
