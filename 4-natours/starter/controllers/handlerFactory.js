const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document find witth that id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase();
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      //restituira il nuovo documento
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document find witth that id', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        [modelName]: doc,
      },
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //express non inserisce i dati del corpo della richiesta e per avere quei dati dobbiamo usare middleware
    // const newId = tours.at(-1).id + 1;
    // const newTour = { ...req.body, id: newId };
    // tours.push(newTour);
    // fs.writeFile(
    //   `${__dirname}/dev-data/data/tours-simple.json`,
    //   JSON.stringify(tours),
    //   (err) => {
    //     //201 sta per created
    //     res.status(201).json({
    //       status: 'success',
    //       data: {
    //         tour: newTour,
    //       },
    //     });
    //   },
    // );
    // V2
    // const newTour = new Tour({});
    // newTour.save();
    //Better
    const modelName = Model.modelName.toLowerCase();

    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        [modelName]: doc,
      },
    });
  });
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // if (!id && id !== 0) throw new Error('The id must be a number');
    // const tour = tours.find((el) => el.id === id);
    // if (!tour) throw new Error('Tour not found try with other id');
    //con populate riempiremo i dati effettivi a partire dal riferimento già presente,spostato in tourModel
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    // Tour.findOne({_id:id})
    if (!doc) {
      return next(new AppError('No document find witth that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //to allow for nested get reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();
    //con explain possiamo vedere le statistiche delle query
    const doc = await features.query.explain();
    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });
