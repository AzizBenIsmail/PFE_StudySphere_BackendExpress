const mongoose = require('mongoose')

const badgeSchema = new mongoose.Schema({
  nom: {type: String,required: true},
  description: {type: String,required: true},
  image_user: String,
})

const Badge = mongoose.model('Badge', badgeSchema)

module.exports = Badge
