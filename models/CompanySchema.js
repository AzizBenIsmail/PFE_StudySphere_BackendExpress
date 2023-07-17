const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  nomCompany: String,
  fichierExcel: String
})

const Company = mongoose.model('Company', companySchema)

module.exports = Company