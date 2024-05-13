const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
//TEST
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );
// function checkID(req, res, next, val) {
//   if (req.params.id.length > 1 && req.params.id.startsWith('0')) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'The id must be a valid number',
//     });
//   }
//   next();
// }
// function checkFieldsBody(req, res, next) {
//   const fieldsBody = ['name', 'price'];
//   const bodyProperty = req.body;
//   const missFields = fieldsBody.filter((el) => !(el in bodyProperty));

//   if (missFields.length) {
//     return res.status(404).json({
//       status: 'failed',
//       message: `You miss the ${
//         missFields.length - 1 ? 'fields' : 'field'
//       }: ${missFields.join(', ')} `,
//     });
//   }
//   next();
// }

exports.aliasTopTours = function (req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty';
  next();
};

exports.getTours = factory.getAll(Tour);
exports.getTourById = factory.getOne(Tour, { patch: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
//in questo modo rendiamo il nostro codice più facile da gestire,poichè riutilizza un "template" che racchiude tutte le funzionalità necessarie per ogni operazione di delete.In caso di cambiamento sarà sufficiente modificare solo il file handlerFactory
exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   // if (!id && id !== 0) throw new Error('The id must be a number');
//   // const tourIndex = tours.findIndex((el) => el.id === id);
//   // if (tourIndex === -1) throw new Error('Tour not found try with other id');
//   // const newToursList = tours.filter((el) => el.id !== id);
//   // fs.writeFile(
//   //   `${__dirname}/dev-data/data/tours-simple.json`,
//   //   JSON.stringify(newToursList),
//   //   (err) => {
//   //     res.status(201).json({
//   //       status: 'success',
//   //       data: {
//   //         tour: newToursList,
//   //       },
//   //     });
//   //   },
//   // );

//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('No tour find witth that id', 404));
//   }
//   res.status(201).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);
  res.status(201).json({
    status: 'success',
    data: { stats },
  });
});
exports.getMonthlyPLan = catchAsync(async (req, res) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      //decostruire un campo array dai documenti informativi e quindi produrre un documento per ogni elemento dell'array
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    // {
    //   $project: {
    //     _id: 0,
    //   },
    // },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);
  res.status(201).json({
    status: 'success',
    data: { plan },
  });
});
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  //radianti= distanza diviso il raggio della terra
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng)
    next(
      new AppError(
        'Please provide latitude and longitude in the format "lat,lng"',
        400,
      ),
    );
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng)
    next(
      new AppError(
        'Please provide latitude and longitude in the format "lat,lng"',
        400,
      ),
    );
  const distances = await Tour.aggregate([
    {
      //richiede che almeno un campo contenga un indice geospaziale(startLocation)
      // se è solo un campo con indice geo geoNear utilizzerà automaticamente questo indice
      //con più campi con indice geo è necessario specificare il parametro keys
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      distances,
    },
  });
});
