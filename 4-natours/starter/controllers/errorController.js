const AppError = require('../utils/appError');

function sendErrorDev(err, req, res) {
  //url senza host
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
}
function sendErrorProd(err, req, res) {
  if (req.originalUrl.startsWith('/api')) {
    //trusted error:send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //Programming or other unknow error
    }
    return res.status(500).json({
      status: 'error',
      message: err,
    });
  }
  //WEB
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
    //Programming or other unknow error
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
}
function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
}
function handleDuplicateFieldsDB(err) {
  const errors = Object.keys(err.keyValue);
  const message = `Duplicate field value: ${errors.join(
    ',',
  )}. Please use another value `;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data ${errors.join('. \n')}`;
  return new AppError(message, 400);
}
function handleJWTError() {
  return new AppError('Invalid token', 401);
}
function handleJWTExpiredError() {
  return new AppError('Token expired! Please log in again', 401);
}
module.exports = (err, req, res, next) => {
  //questo perché potrebbero esserci degli errori che non provengono da node
  err.statusCode ||= 500;
  err.status ||= 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    //**** la property message non è enumerabile,quindi è necessario copiarla esplicitamente
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error?._message?.includes('validation'))
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(error, req, res);
  }
};
