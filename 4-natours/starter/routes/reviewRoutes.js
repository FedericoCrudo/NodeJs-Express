const express = require('express');
const {
  protect: authProtected,
  restrictTo,
} = require('../controllers/authController');
const {
  reviews,
  deleteReview,
  createReview,
  setTourUserIds,
  updateReview,
  getReview,
} = require('../controllers/reviewController');
//dobbiamo definire mergeParams perché per impostazione predefinita ogni router ha accesso solo ai parametri dei suoi percorsi specifici
//quindi per poter accedere al parametro id è necessario unire le rotte
// POST /tour/12334234/reviews
//tutte queste rotte verranno reindirizzate a questo router che potrà accedere al parametro tourId
const router = express.Router({ mergeParams: true });
router.use(authProtected);
router
  .route('/')
  .get(reviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
