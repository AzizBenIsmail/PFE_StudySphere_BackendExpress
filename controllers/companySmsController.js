const CompanySchema = require('../models/CompanySMSSchema')
const xlsx = require('xlsx')
const moment = require('moment')
const dayjs = require('dayjs')
const fs = require('fs')

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
  const errorLog = []
  try {
    const company = await CompanySchema.create({
      nomCompagne: companyName,
      fichierExcel: excelFile,
      image_Compagne: image,
      validation:false,
      createdAt : new Date()

    })

    const excelData = readExcelFile(`C:/Users/aziz2/OneDrive/Bureau/Attijari-Bank-BackendExpress/public/Xcl/${excelFile}`)
    const newContacts = excelData.map((row, index) => {
      const num = row[0]
      const content = row[1]
      const dateEnvoi = dayjs(row[2], ['DD/MM/YYYY', 'MM/DD/YYYY'], 'fr').format('YYYY-MM-DD')
      const currentDate = dayjs().format('YYYY-MM-DD')
      if (dayjs(dateEnvoi).isBefore(currentDate)) {
        errorLog.push(`Date Envoi Invalide à la ligne ${index + 1}`)
      }

      if (num.length !== 8) {
        errorLog.push(`num Invalid à la ligne ${index + 1}`);
      }

      if (content.length >= 200) {
        errorLog.push(`continue Invalid Sum a 200 Char à la ligne ${index + 1}`);
      }
      return {  num, content, dateEnvoi }
    })


    const totalRows = excelData.length
    console.log(totalRows, errorLog.length)
    if (errorLog.length === totalRows) {
      errorLog.unshift('Le fichier est gravement endommagé. Il y a une grande probabilité que le fichier saisi soit incorrect.')
    }

    fs.writeFileSync('errorLog.txt', errorLog.join('\n'))

    const hasErrors = errorLog.length > 0 ? 1 : 0

    res.status(201).json({ company, hasErrors })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getErrorLogContent = async (req, res, next) => {
  try {
    const filePath = 'errorLog.txt';

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Le fichier errorLog.txt n\'existe pas' });
      return;
    }

    // Lire le contenu du fichier
    const logContent = fs.readFileSync(filePath, 'utf8');
    res.status(200).json({ logContent });
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la lecture du fichier :', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
  }
};

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
      const num = row[0]
      const content = row[1]
      const dateEnvoi = dayjs(row[2], ['DD/MM/YYYY', 'MM/DD/YYYY'], 'fr').format('YYYY-MM-DD')
      const currentDate = dayjs().format('YYYY-MM-DD')
      if (dayjs(dateEnvoi).isBefore(currentDate)) {
        throw new Error(`DateEnvoiInvalide a la ligne ${index + 1}`)
      }

      if (num.length !== 8) {
        errorLog.push(`num Invalid à la ligne ${index + 1}`);
      }

      if (content.length >= 200) {
        errorLog.push(`continue Invalid à la ligne ${index + 1}`);
      }

      return { num, content, dateEnvoi }
    })
    company.validation = true ;
    company.updatedAt = new Date();
    company.contacts = [...company.contacts, ...newContacts]
    await company.save()
    res.status(201).json({ company })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
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
// module.exports.updateCompany = async (req, res, next) => {
//   try {
//     const companyId = req.params.id
//     const companyName = req.body.companyName
//     const checkIfcompanyExists = await CompanySchema.findById(id)
//     if (!checkIfcompanyExists) {
//       throw new Error('company not found !')
//     }
//     // const currentDate = new Date();
//     updateedcompany = await CompanySchema.findByIdAndUpdate(companyId, {
//       $set: {
//         companyName
//       },
//     }, { new: true })
//     res.status(200).json(updateedcompany)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

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






