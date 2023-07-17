const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  nomCompagne: String,
  fichierExcel: String,
  image_Compagne: String,

})

const Company = mongoose.model('Company', companySchema)

module.exports = Company