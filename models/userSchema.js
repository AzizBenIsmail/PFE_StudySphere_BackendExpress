const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { string } = require('yup')
const Archivage = require('./archivageSchema')  // Import the archivageSchema
const preferencesSchema = require('./preferencesSchema');

userSchema = new mongoose.Schema({
  nom: String, // nom CL/F/C/M/A
  prenom: String, // nom CL/F//M/A
  email: { type: String, unique: true, required: true },
  password: String,
  createdAt: Date,
  updatedAt: Date,
  statu: String,
  role: {
    type: String,
    enum: ['client', 'centre', 'moderateur', 'admin', 'formateur'],
  },
  visitsCount: { type: Number, default: 0 },
  image_user: String,
  etat: Boolean, // True (active) false ( Non Active)
  phoneNumber: Number, //length 8
  resetPasswordToken: String,  // Field to store the reset password token
  resetPasswordUsed: { type: Boolean, default: false, },
  archivage: { type: mongoose.Schema.Types.ObjectId, ref: 'Archivage' }, // Reference to Archivage
  preferences: { type: mongoose.Schema.Types.ObjectId, ref: 'Preferences' },

}, { timestamps: true })

//apres la creation
userSchema.post('save', function (doc, next) {
  console.log('new user was created & saved')
  next()
})

//avant la creation
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt()
    const User = this
    User.password = await bcrypt.hash(User.password, salt)
    User.statu = false
    User.createdAt = new Date()
    User.updatedAt = new Date()
    // User.etat = true //false
    next()
  } catch (error) {
    next(error)
  }
})

//static method to login user

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      if (user.etat == true) {
        return user
      } else {
        throw new Error('compte desactive')
      }
    }
    throw new Error('incorrect password')
  }
  throw Error('incorrect email')
}

const User = mongoose.model('User', userSchema)
module.exports = User
