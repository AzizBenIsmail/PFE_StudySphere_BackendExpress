const CompanySchema = require('../models/CompanySchema')
const xlsx = require('xlsx')
const dayjs = require('dayjs')
const fs = require('fs');
const path = require('path');
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const ngrokUrl = "http://randomstring.ngrok.io"; // Replace this with your actual ngrok URL

const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: false, // Ajoutez cette option pour obtenir les valeurs formatées
  });
  return jsonData;
};

module.exports.createCompany = async (req, res, next) => {
  fs.unlink('errorLog.txt', (err) => {
    if (err) {
      console.error('Erreur lors de la suppression du fichier :', err);
    } else {
      console.log('Fichier errorLog.txt supprimé avec succès !');
    }
  });

  const { companyName } = req.body;
  const excelFile = req.files['excelFile'][0].originalname;
  const image = req.files['image_Compagne'][0].originalname;
  const errorLog = [];

  try {
    const company = await CompanySchema.create({
      nomCompagne: companyName,
      fichierExcel: excelFile,
      image_Compagne: image,
      validation: false,
      createdAt: new Date(),
    });

    const excelData = readExcelFile(`C:/Users/aziz2/OneDrive/Bureau/Attijari-Bank-BackendExpress/public/Xcl/${excelFile}`);

    if (excelData.length === 0) {
      // The excelData array is empty, indicating an empty file or invalid format
      const hasErrors = 1;
      res.status(201).json({ company, hasErrors });
      return;
    }

    const newContacts = excelData.map((row, index) => {
      const nom = row[0];
      const email = row[1];
      const content = row[2];
      const dateEnvoi = dayjs(row[3], ['DD/MM/YYYY', 'MM/DD/YYYY'], 'fr').format('YYYY-MM-DD');
      const currentDate = dayjs().format('YYYY-MM-DD');

      if (dayjs(dateEnvoi).isBefore(currentDate)) {
        errorLog.push(`Date Envoi Invalide à la ligne ${index + 1}`);
      }

      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        errorLog.push(`Email Invalid à la ligne ${index + 1}`);
      }

      return { nom, email, content, dateEnvoi };
    });

    const hasErrors = errorLog.length > 0 ? 1 : 0;
    const totalRows = excelData.length;
console.log(excelData.length);
    if (errorLog.length === totalRows) {
      errorLog.unshift('Le fichier est gravement endommagé. Il y a une grande probabilité que le fichier saisi soit incorrect.');
    }

    fs.writeFileSync('errorLog.txt', errorLog.join('\n'));

    res.status(201).json({ company, hasErrors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function sendWelcomeEmail(email, username, imageUrl) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "greencrowd2223@gmail.com",
      pass: "zothevkvkhobyyzw",
    },
  });

  const mailOptions = {
    from: "greencrowd2223@gmail.com",
    to: email,
    subject: "Bienvenue sur notre site",
    html: `
      <html>
        <head>
          <style>
            /* Add your custom styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #000000; /* Set the background color to black */
              color: #ffffff; /* Set the text color to white */
              padding: 20px;
              margin: 0; /* Remove default margin */
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background-color: #3b2b2b;
              padding: 30px;
              border-radius: 5px;
              box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
              position: relative; /* Added to position the image and text */
            }
            .image-container {
              position: absolute;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              width: 100px; /* Adjust the width of the image as needed */
              height: 100px; /* Adjust the height of the image as needed */
              background-repeat: no-repeat;
              background-size: cover;
              border-radius: 50%; /* To create a circular image */
            }
            h1 {
              color: #003cff;
            }
            p {
              color: #ffffff; /* Set the text color to white */
            }
            h2 {
              color: #0000FF;
            }
            .button {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 4px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Salut nous sommes Attijari Bank</h1>
            <p>Cher <strong>${username}</strong>,</p>
            <p>Nous sommes ravis de vous informer de cette événement !</p>
            <img src="${imageUrl}">
            <p>Cordialement,<br>L'équipe du Attijari Bank</p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail de bienvenue envoyé avec succès !");
    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de bienvenue :", error);
    throw error;
  }
}


module.exports.getErrorLogContent = async (req, res, next) => {
  try {
    const filePath = 'errorLog.txt'

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Le fichier errorLog.txt n\'existe pas' })
      return
    }

    // Lire le contenu du fichier
    const logContent = fs.readFileSync(filePath, 'utf8')
    res.status(200).json({ logContent })
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la lecture du fichier :', error)
    res.status(500).json({ error: 'Erreur lors de la lecture du fichier' })
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
    company.validation = true
    company.updatedAt = new Date()
    company.contacts = [...company.contacts, ...newContacts]
    await company.save()

    newContacts.forEach((contact) => {
      sendWelcomeEmail(contact.email, contact.nom, `${ngrokUrl}/Xcl/${company.image_Compagne}`);
    });

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






