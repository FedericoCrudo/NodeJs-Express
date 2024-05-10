const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user '],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour '],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        //aggiunge 1 per ogni tour che è stato abbinato nel passaggio precedente
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // eslint-disable-next-line no-unused-expressions
  stats.length > 0 &&
    (await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    }));
  // eslint-disable-next-line no-unused-expressions
  stats.length <= 0 &&
    (await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    }));
};
reviewSchema.post('save', function (next) {
  //constructor punta ancora al modello
  this.constructor.calcAverageRatings(this.tour);

  next();
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  //this punta alla query, a noi serve il documento
  //quindi per aggirare il problema utilizziamo findOne, che restituira il documento attualmente in fase di elaborazione
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.calcAverageRatings(this.r.tour);
  next();
});
//MODEL
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
