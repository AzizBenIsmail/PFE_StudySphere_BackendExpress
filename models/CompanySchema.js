const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  nomCompagne: String,
  fichierExcel: String,
  image_Compagne: String,
  validation: Boolean,
  createdAt: Date,
  updatedAt: Date,
  contacts: [
    {
      nom: String,
      email: String,
      content: String,
      dateEnvoi: Date

    }
  ]
})

companySchema.pre('save', async function (next) {
  try {
    const Company = this
    // Company.createdAt = new Date()
    // Company.updatedAt = new Date()
    // Company.validation = false //false
    next()
  } catch (error) {
    next(error)
  }
})

const Company = mongoose.model('Company', companySchema)

module.exports = Company