const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

userSchema = new mongoose.Schema({
  username: String, //unique
  first_Name: String,
  last_Name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date,
  userType: String,
  image_user: String,
  enabled: Boolean, //true or false
  phoneNumber: Number, //length 8
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
    User.userType = 'user'
    User.createdAt = new Date()
    User.updatedAt = new Date()
    User.enabled = false //false
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
      if (user.enabled == true) {
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
