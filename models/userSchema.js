const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { string } = require('yup')
const Archivage = require('./archivageSchema')  // Import the archivageSchema
const preferencesSchema = require('./preferencesSchema');
const XP = require('../models/xpSchema');
const Niveau = require('../models/niveauSchema');
const Badge = require('../models/badgeSchema');
const Notification = require('../models/notificationSchema');

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
  resetPasswordToken: String,  // Field to store the reset password token
  resetPasswordUsed: { type: Boolean, default: false, },
  archivage: { type: mongoose.Schema.Types.ObjectId, ref: 'Archivage' }, // Reference to Archivage
  preferences: { type: mongoose.Schema.Types.ObjectId, ref: 'Preferences' },
  xp: { type: mongoose.Schema.Types.ObjectId, ref: 'XP' },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],

}, { timestamps: true })

//apres la creation
userSchema.post('save', function (doc, next) {
  console.log('new user was created & saved')
  // const User = this
  // if ( User.role === 'client') {
  //   User.image_user = "client.png"
  // }
  next()
})

//avant la creation
userSchema.pre('save', async function (next) {
  try {
    //cryptage password + statu + createdAt et updatedAt
    const salt = await bcrypt.genSalt()
    const User = this
    User.password = await bcrypt.hash(User.password, salt)
    User.statu = false

    User.createdAt = new Date()
    User.updatedAt = new Date()

    // Créer la notification pour le nouvel utilisateur
    const newNotification = new Notification({
      content: 'Bienvenue à notre plateforme!',
      createdAt: new Date(),
      type: "Bienvenue",
      read : false,
      url: "Info/bienvenu",
      recipient: User._id,
    });

    await newNotification.save();

    User.notifications = newNotification._id;

    const badge = await Badge.findOne({ nom: "Bienvenu" }); // Trouver le niveau initial
    //creation xp
      const defaultNiveau = await Niveau.findOne({ nom: "Niveau0" }); // Trouver le niveau initial
      const defaultXP = new XP({
        pointsGagnes: 0,
        niveauAtteint: defaultNiveau._id, // Utiliser l'ID du niveau initial
        badgeIds: [badge._id], // Aucun badge initial
        user: User._id, // Utiliser l'ID de l'utilisateur créé
      });
      await defaultXP.save();

    User.xp = defaultXP._id

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
      if (user.etat === true) {
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
