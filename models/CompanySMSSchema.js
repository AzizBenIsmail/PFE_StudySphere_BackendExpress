const mongoose = require('mongoose')

const CompanySMSSchema = new mongoose.Schema({
  nomCompagne: String,
  fichierExcel: String,
  image_Compagne: String,
  validation: Boolean,
  createdAt: Date,
  updatedAt: Date,
  contacts: [
    {
      nom: String,
      num: String,
      content: String,
      dateEnvoi: Date
    }
  ]
})

CompanySMSSchema.pre('save', async function (next) {
  try {
    const CompanySMS = this
    // CompanySMS.createdAt = new Date()
    // CompanySMS.updatedAt = new Date()
    // Company.validation = false //false
    next()
  } catch (error) {
    next(error)
  }
})

const CompanySMS = mongoose.model('CompanySMS', CompanySMSSchema)

module.exports = CompanySMS