const CompanySchema = require('../models/CompanySchema')
const xlsx = require('xlsx')
const moment = require('moment')
const dayjs = require('dayjs')

const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const jsonData = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: false, // Ajoutez cette option pour obtenir les valeurs formatées
  })
  return jsonData
}

module.exports.createCompany = async (req, res, next) => {
  const { companyName } = req.body
  const excelFile = req.files['excelFile'][0].originalname
  const image = req.files['image_Compagne'][0].originalname
  try {
    const company = await CompanySchema.create({
      nomCompagne: companyName,
      fichierExcel: excelFile,
      image_Compagne: image,
    })
    // Lire le contenu du fichier Excel
    // const filePath = `C:/Users/aziz2/OneDrive/Bureau/Attijari-Bank-BackendExpress/public/Xcl/${excelFile}`;
    // const excelData = readExcelFile(filePath);
    //
    // // Traiter les données du fichier Excel
    // const contacts = excelData.map((row) => {
    //   const nom = row[0];
    //   const email = row[1];
    //   const content = row[2];
    //   let dateEnvoi = moment(row[3], 'DD/MM/YYYY').format('YYYY-MM-DD');
    //
    //   // Vérifier si la date est valide, sinon la remplacer par une valeur par défaut
    //   if (!moment(dateEnvoi, 'YYYY-MM-DD', true).isValid()) {
    //     dateEnvoi = moment('01/01/2000', 'DD/MM/YYYY').format('YYYY-MM-DD');
    //   }
    //
    //   return {
    //     nom,
    //     email,
    //     content,
    //     dateEnvoi,
    //   };
    // });
    //
    // // Ajouter les contacts à l'entreprise créée
    // company.contacts = contacts;
    //
    // // Enregistrer les modifications de l'entreprise
    // await company.save();
    res.status(201).json({ company })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.Valider = async (req, res, next) => {
  const id = req.params.id
  try {
    const company = await CompanySchema.findById(id)
    const filePath = `C:/Users/aziz2/OneDrive/Bureau/Attijari-Bank-BackendExpress/public/Xcl/${company.fichierExcel}`
    const excelData = readExcelFile(filePath)
    if (company.contacts.length !== 0) {
      throw new Error('DejaVerifier')
    }

    const newContacts = excelData.map((row, index) => {
      const nom = row[0]
      const email = row[1]
      const content = row[2]
      const dateE = row[3]
      const dateEnvoi = dayjs(row[3], ['DD/MM/YYYY', 'MM/DD/YYYY'], 'fr').format('YYYY-MM-DD')
      const currentDate = dayjs().format('YYYY-MM-DD')
      console.log(dateE, content, email, nom)
      if (dayjs(dateEnvoi).isBefore(currentDate)) {
        throw new Error(`DateEnvoiInvalide a la ligne ${index + 1}`)
      }

      const isValidEmail = validateEmail(email)
      if (!isValidEmail) {
        throw new Error(`EmailInvalid a la ligne ${index + 1}`)
      }

      return { nom, email, content, dateEnvoi }
    })

    company.contacts = [...company.contacts, ...newContacts]
    await company.save()
    res.status(201).json({ company })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// Function to validate email format
function validateEmail (email) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  return emailRegex.test(email)
}

// Récupérer la liste des entreprises
module.exports.getCompanies = async (req, res, next) => {
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

module.exports.getCompanieByid = async (req, res, next) => {
  try {
    const id = req.params.id
    const Companys = await CompanySchema.findById(id)
    if (!Companys || Companys.length === 0) {
      throw new Error('Companys not found !')
    }
    res.status(200).json({ Companys })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mettre à jour une entreprise
module.exports.updateCompany = async (req, res, next) => {
  try {
    const companyId = req.params.id
    const companyName = req.body.companyName
    const checkIfcompanyExists = await CompanySchema.findById(id)
    if (!checkIfcompanyExists) {
      throw new Error('company not found !')
    }
    // const currentDate = new Date();
    updateedcompany = await CompanySchema.findByIdAndUpdate(companyId, {
      $set: {
        companyName
      },
    }, { new: true })
    res.status(200).json(updateedcompany)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Supprimer une entreprise
module.exports.deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params
    const company = await CompanySchema.findById(id)

    if (!company) {
      return res.status(404).json({ message: 'company not found!' })
    }

    await CompanySchema.findByIdAndDelete(company._id)

    res.status(200).json('deleted')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}






