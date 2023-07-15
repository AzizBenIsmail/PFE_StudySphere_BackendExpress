const CompanySchema = require('../models/CompanySchema')
const userModel = require('../models/userSchema')

// Récupérer la liste des entreprises
module.exports.getCompanies = async (req, res) => {
  try {
    const Companys = await CompanySchema.find()
    if (!Companys || Companys.length === 0) {
      throw new Error('Companys not found !')
    }
    res.status(200).json({ Companys })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Créer une nouvelle entreprise
module.exports.createCompany = async (req, res) => {
  const companyName = req.body.companyName
  const filePath = req.file.path

  const newCompany = new Company({
    nom: companyName,
    fichierExcel: filePath
  })

  newCompany.save((err) => {
    if (err) {
      console.error(err)
      res.status(500).send('Erreur du serveur')
    } else {
      res.send('Entreprise créée avec succès')
    }
  })
}

// Mettre à jour une entreprise
module.exports.updateCompany = async (req, res) => {
  const companyId = req.params.id
  const updatedCompanyName = req.body.companyName

  Company.findByIdAndUpdate(companyId, { nom: updatedCompanyName }, (err, company) => {
    if (err) {
      console.error(err)
      res.status(500).send('Erreur du serveur')
    } else if (!company) {
      res.status(404).send('Entreprise non trouvée')
    } else {
      res.send('Entreprise mise à jour avec succès')
    }
  })
}

// Supprimer une entreprise
const deleteCompany = async (req, res) => {
  const companyId = req.params.id

  Company.findByIdAndDelete(companyId, (err, company) => {
    if (err) {
      console.error(err)
      res.status(500).send('Erreur du serveur')
    } else if (!company) {
      res.status(404).send('Entreprise non trouvée')
    } else {
      res.send('Entreprise supprimée avec succès')
    }
  })
}


