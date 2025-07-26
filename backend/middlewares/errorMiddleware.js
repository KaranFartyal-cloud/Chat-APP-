const notFound = (req, res, next) => {
  //since it is also a middleware takes next too
  const error = new Error(`Not found - ${req.originalUrl}`); //original url requestted by client
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
