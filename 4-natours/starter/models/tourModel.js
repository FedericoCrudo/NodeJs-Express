const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
//SCHEMA

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //valore required, messaggio di errore in caso non sia presente il campo
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'a tour name must have  less or equal then 40 char'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either:easy,medium,difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'min must be above 1'],
      max: [5, 'min must be above 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      //valore required, messaggio di errore in caso non sia presente il campo
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // work on create and save update doesn't work
          return val < this.price;
        },
        //{value} restituira il valore inserito
        message: 'Discout price({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startDates: [Date],
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    //Embedding
    // guides: Array,
    //REFERENCE
    guides: [
      //ci aspettiamo che ogni elemento dell'array sia un ID MongoDb
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    //Non va bene perché non vogliamo un elenco che cresca all'infinito
    //quindi utilizzeremo la vitual populate
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Review',
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
//permette di aggiungere indice così da velocizzare le query basate su quel campo
//1 in ordine crescente,-1 decrescente
//single field index
// tourSchema.index({ price: 1 });
//compound index:quando vengono creati questi index, non dobbiamo creare anche quelli singoli per ogni campo inserito (price, ratings)
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//virtual properties sono campi che possiamo definire nello schema ma che non verranno mantenuti
//non verranno salvati nel database, hanno senso solo per i campi derivati da due  o  più cmapi prensenti nel db
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//Virtual populate
// permette di ottenere le stesse informazioni del child documents, ma senza la persistenza di queste informazioni all'interno del database
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
//DOCUMENT Middleware

//esistono anche midd di Mongoose per far succedere  qualcosa tra due eventi(ad esempio ogni volta che un documento viene salvato nel database,possiamo eseguire una funzione tra il comando di salvataggio e l'effettivo salvataggio del documento,oppure anche dopo)
//esistono 4 tipi in mongoose:document,query,aggreagation model middleware
//documento agisce sul documento attualmente elaborato
//eseguito prima del comando save() e create() non verrà invocato con insertMany()
tourSchema.pre('save', function (next) {
  //possiamo accedere al documento elaborato
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* Embedding  
tourSchema.pre('save', async function (next) {
  const guides = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guides);
  next();
}); */

// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// consente di eseguire funzioni prima o dopo l'esecuzione di una determinata query
//questo soluzione funzionerà solo per il find standard, con findOne non funzionerebbe
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
//BAD : per includere anche questo find
// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
//AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   //pipeline restituisce tutti i paramentri di aggregazione utilizzati
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

//MODEL
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
