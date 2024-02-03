const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { string } = require('yup')

userSchema = new mongoose.Schema({
  surnom: String, //unique
  nom: String,
  prenom: String,
  email: { type: String, unique: true, required: true },
  password: String,
  cree_A: Date,
  modifier_A: Date,
  statu : String,
  role: {
    type: String,
    enum: ['client', 'centre', 'moderateur', 'admin','formateur'],
  },
  domaine: String,
  emplacement_actuelle: String,
  langue: String,
  reputation: {
    type: Number,
    default: 0,
  },
  image_user: String,
  etat: Boolean, //true or false
  phoneNumber: Number, //length 8
  resetPasswordToken: String,  // Field to store the reset password token
  resetPasswordUsed: {
    type: Boolean,
    default: false,  // Default value is false, indicating the token hasn't been used
  },
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
    User.cree_A = new Date()
    User.modifier_A = new Date()
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
