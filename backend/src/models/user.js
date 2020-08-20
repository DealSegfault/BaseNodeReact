const mongoose = require('mongoose')
const Schema = mongoose.Schema

const isEmail = require('validator/lib/isEmail')

const UserSchema = Schema(
  {
    login: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [
        function () {
          if (
            this.googleId ||
            this.facebookId ||
            this.fortyTwoId ||
            this.githubId
          )
            return false
          return true
        },
        'UNIQUE',
      ],
      required: [true, 'MISSING'],
      min: [3, 'TOOSHORT'],
    },
    password: {
      type: String,
      required: [
        function () {
          if (
            this.googleId ||
            this.facebookId ||
            this.fortyTwoId ||
            this.githubId
          )
            return false
          return true
        },
        'MISSING',
      ],
      min: [5, 'TOOSHORT'],
    },
    email: {
      type: String,
      required: [true, 'MISSING'],
      trim: true,
      lowercase: true,
      unique: [
        function () {
          if (
            this.googleId ||
            this.facebookId ||
            this.fortyTwoId ||
            this.githubId
          )
            return false
          return true
        },
        'UNIQUE',
      ],
      validate: [isEmail, 'NOTVALIDEMAIL'],
    },
    email_confirmation: {
      type: String
    },
    firstname: {
      type: String,
      trim: true,
      lowercase: true,
      // required: [false, 'MISSING'],
    },
    lastname: {
      type: String,
      trim: true,
      lowercase: true,
      // required: [false, 'MISSING'],
    },
    language: {
      type: String,
      default: 'en',
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    fortyTwoId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    role: {
      type: String,
      default: 'pleb',
    },
  },
  { strict: true }
)

module.exports = mongoose.model('User', UserSchema)
