const express = require('express');
const {
  protect: authProtected,
  restrictTo,
} = require('../controllers/authController');
const {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPLan,
  // checkID,
  // checkFieldsBody,
  getToursWithin,
  getDistances,
} = require('../controllers/tourController');
// const { createReview } = require('../controllers/reviewController');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

//NOn va bene poichè richiamiamo una createReview nel tourRoutes
// router
//   .route('/:tourId/reviews')
//   .post(authProtected, restrictTo('user'), createReview);
//SOLUZIONE
router.use('/:tourId/reviews', reviewRouter);

//è fondamentale questa rotta prima delle altre perché express passa attraverso ogni middleware.Es se spostassimo la seguente riga soto alla route /:id il ciclo di richiesta risposta terminerebbe al res.send inviato da ;/id
router.route('/top-5-cheap').get(aliasTopTours, getTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authProtected,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPLan,
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);
//params middleware
//middl che viene eseguito solo per determinati parametri
// router.param('id', checkID);

router
  .route('/')
  .get(getTours)
  //Channing middleware
  // .post(checkFieldsBody, createTour);
  .post(authProtected, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTourById)
  .patch(authProtected, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(authProtected, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
