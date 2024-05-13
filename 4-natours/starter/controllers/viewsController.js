const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  //get tour data from collection
  const tours = await Tour.find();
  //build template
  //render template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res
    //CSP  meccaniscmo per prevenire attacchi XSS,impone  di speficiare quali risorse possono essere caricate e da dove
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://is.stripe.com/V3 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    )
    .status(200)
    .render('tour', {
      title: `${tour.name} tour`,
      tour,
    });
});
exports.getLoginForm = async function (req, res) {
  res.status(200).render('login', {
    title: 'Log into your accout',
  });
};

exports.getAccount = async function (req, res) {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};
