const path = require('path');
const express = require('express');
const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewsRouter = require('./routes/viewRoutes');

const app = express();
//set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//STATIC FILES
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
//Middlewares
//Set Security http headers
app.use(helmet());
//Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
//LIMITER
const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP,please try again in an hour',
});

app.use('/api', limiter);

//Body parser,reading data from body
app.use(express.json({ limit: '10kb' }));
//cookie
app.use(cookieParser());
// Data sanitization NoSql query injection
app.use(mongoSanitize());
//Data sanitization XSS
//per impedire iniezione di codice HTML
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//l'ordine con cui vengono definiti i middleware è fondamentale
//in questo scenario se effettuiamo una richiesta verso questa rotta il middleware successivo non verrà eseguito
// app.route('/api/v1/tours').get(getTours).post(createTour);
// app.use((req, res, next) => {
//   console.log('Hello form middleware');
//   //se non avessimo chiamato next allora il ciclo di richiesta/risposta sarebbe bloccato a questo punto
//   //non rispediremmo mai una risposta al client
//   next();
// });
//manipoliamo la richiesta
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours', getTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//Better
//questi anche sdono middleware solo che sono applicati ad uno specifico url
// const tourRouter = express.Router();
// const userRouter = express.Router();

// USER
// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

//Siccome questo middleware funziona solo su api/v1/tours, possiamo rimuovere url dalle altre rotte
//Mounting router

// PUG render
app.use('/', viewsRouter);

//API
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error("Can't find url on this server");
  // err.status = 'Fail';
  // err.statusCode = 404;
  // //se passiamo un argomento express capirà che c'è stato un errore
  // //quindi salterà tutti gli altri middleware nello stack dei middleware e invierà l'errore che abbiamo passato al nostro
  // // middleware di gestione degli errori globale
  next(new AppError("Can't find url on this server", 404));
});

// GLOBAL ERROR HANDLING
app.use(globalErrorHandler);
module.exports = app;
