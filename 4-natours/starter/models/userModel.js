const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'User must have a name'],
    unique: true,
  },
  email: {
    type: String,
    require: [true, 'User must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: { type: String, default: 'default.jpeg' },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please provide a valid password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Password must be confirmed'],
    select: false,
    validate: {
      // work on create and save
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/* 
  hash non è reversibile
  ogni piccola modfica produrra un valore differente 
  output dell'operazione prende il nome di digest
  sono deterministiche=> dato un certo input l'output sarà sempre lo stesso
  la dimensione rimane fissa, non importa quanto sia lunga la string in input
*/
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('passowrd') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
//instance method=> metodo disponibile su tutti i docuemnti di una certa raccolta
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changeTime;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
//MODEL
const User = mongoose.model('User', userSchema);

module.exports = User;
