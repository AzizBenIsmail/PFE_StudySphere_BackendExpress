const CompanySchema = require('../models/CompanySchema')

// Récupérer la liste des entreprises
module.exports.getCompanies = async (req, res ,next) => {
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
module.exports.createCompany = async (req, res,next) => {
  const { companyName } = req.body
  const originalname  = req.file.originalname
  console.log(originalname);
  try {
    const Company = await CompanySchema.create({
      nomCompany: companyName,
      fichierExcel: originalname
    })
    res.status(201).json({ Company })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mettre à jour une entreprise
module.exports.updateCompany = async (req, res,next) => {
  try {
    const companyId = req.params.id
    const companyName = req.body.companyName
    const checkIfcompanyExists = await CompanySchema.findById(id);
    if ( !checkIfcompanyExists) {
      throw new Error("company not found !");
    }
    // const currentDate = new Date();
    updateedcompany = await CompanySchema.findByIdAndUpdate(companyId, {
      $set: {
        companyName      },
    }, {new: true});
    res.status(200).json(updateedcompany);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


// Supprimer une entreprise
module.exports.deleteCompany = async (req, res,next) => {
    try {
    const {id} = req.params;
    const company = await CompanySchema.findById(id);

    if ( !company) {
      return res.status(404).json({message: "company not found!"});
    }

    await CompanySchema.findByIdAndDelete(company._id);

    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};



