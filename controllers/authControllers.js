const userModel = require('../models/userSchema')
const archivageModel  = require('../models/archivageSchema')

const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

const maxAge = 2 * 60 * 60 // 2 heures

const createToken = (id) => {
  return jwt.sign({ id }, 'net StudySphere secret', {
    expiresIn: maxAge,
  })
}

const createTokenmdp = (id) => {
  return jwt.sign({ id, exp: Math.floor(Date.now() / 1000) + 120 }, 'net StudySphere secret');
};

// module.exports.signup_post = async (req, res) => {
//   const { filename } = req.file
//   const { email, password, surnom } = req.body
//   consolo.log(req.body)
//   try {
//     const user = await userModel.create({
//       surnom, password, email, image_user: filename,
//     })
//     sendWelcomeEmail(email, surnom)
//     const token = createToken(user._id)
//     res.cookie('jwt_token', token, { httpOnly: true, maxAge: maxAge * 1000 })
//     res.status(201).json({ user })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// module.exports.signupclient = async (req, res) => {
//   const { email, password, nom, prenom } = req.body
//   const role = 'client'
//   const etat = true
//   console.log(req.body)
//   try {
//     if (!email) {
//       return res.status(200).json({ message: 'Email required' })
//     }
//       const checkIfUserExists = await userModel.findOne({ email })
//       console.log(email)
//       if (checkIfUserExists) {
//         // If user is found, respond with 409 (Conflict)
//         return res.status(200).json({ message: 'Email exists deja' })
//       }
//     const user = await userModel.create({
//       nom, prenom, password, email, role , etat
//     })
//     // sendWelcomeEmail(email, nom);
//     const token = createToken(user._id)
//     res.cookie('jwt_token', token, { httpOnly: true, maxAge: maxAge * 1000 })
//     res.status(201).json({ user })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

module.exports.signupclient = async (req, res) => {
  const { email, password, nom, prenom , role } = req.body
  // const role = 'client'
  const etat = true
  console.log(req.body)
  try {
    if (!email) {
      return res.status(200).json({ message: 'Email required' })
    }
    const checkIfUserExists = await userModel.findOne({ email })
    console.log(email)
    if (checkIfUserExists) {
      // If user is found, respond with 409 (Conflict)
      return res.status(200).json({ message: 'Email exists deja' })
    }
    const user = await userModel.create({
      nom, prenom, password, email, role , etat
    })
    // sendWelcomeEmail(email, nom);
    const token = createToken(user._id)
    res.cookie('jwt_token', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.signupcentre = async (req, res) => {
  console.log(req.body)
  const { filename } = req.file
  const { email, password, nom } = req.body
  const role = 'centre'
  const etat = false
  try {
    if (!email) {
      return res.status(200).json({ message: 'Email required' })
    }
    const checkIfUserExists = await userModel.findOne({ email })
    if (checkIfUserExists) {
      // If user is found, respond with 409 (Conflict)
      return res.status(200).json({ message: 'Email exists deja' })
    }
    if (!nom) {
      return res.status(200).json({ message: 'nom required' })
    }
    if (!filename) {
      return res.status(200).json({ message: 'Image required' })
    }
    if (!password) {
      return res.status(200).json({ message: 'Password required' })
    }
    const user = await userModel.create({
      nom, password, email, role , image_user: filename, etat
    })
    sendWelcomeEmail(email, nom);
    // const token = createToken(user._id)
    // // res.cookie('jwt_token', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.activation = async (req, res) => {
  try {
    const email = req.query.email
    const checkIfUserExists = await userModel.findOne({ email })

    if (!checkIfUserExists) {
      throw new Error('User not found!')
    }
    if (checkIfUserExists.etat) {
      return res.redirect('http://localhost:3000/auth/login/?message=Compte_Verifier_Avec_Succee')
    }

    const currentDate = new Date()
    const updatedUser = await userModel.findByIdAndUpdate(checkIfUserExists._id, {
        $set: {
          etat: true, updatedAt: currentDate,
        },
      }, { new: true } // Set the { new: true } option to return the updated user
    )

    return res.redirect('http://localhost:3000/login-page/?message=Utilisateur_Activee_Avec_Succes')
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await userModel.login(email, password)
    const updatedUser = await userModel.findByIdAndUpdate(user._id, {
        $set: {
          statu: true,
          visitsCount: user.visitsCount +1 ,
        },
      }, { new: true } // Set the { new: true } option to return the updated user
    )
    const token = createToken(user._id)
    res.cookie('jwt_token', token, { httpOnly: false, maxAge: maxAge * 1000 })
    req.session.user = user
    // console.log(req.session);
    res.status(200).json({
      message: 'User successfully authenticated', user: user,
    })
  } catch (error) {
    res.status(400).json({
      erreur: error.message,
    })
  }
}

// Fonction pour envoyer un e-mail de bienvenue à l'utilisateur
function sendWelcomeEmail (email, nom, id) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
      user: 'studyspheretn@gmail.com', pass: 'uqct kspi rgnt yzre',
    },
  })
  const activationLink = `http://localhost:5000/auth/validation?email=${encodeURIComponent(email)}`
  const mailOptions = {
    from: 'studyspheretn@gmail.com', to: email, subject: 'Bienvenue sur notre site', html: `
      <html>
        <head>
          <style>
            /* Add your custom styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              padding: 20px;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 5px;
              box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
            }
            p {
              color: #555555;
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
            <h1>Bienvenue sur notre site</h1>
            <p>Cher</p> <h2> ${nom},</h2>
            <p>Nous sommes ravis de vous accueillir parmi nous !</p>
            <p>Veuillez cliquer sur le bouton ci-dessous pour activer votre compte :</p>
            <a href="${activationLink}" ${id} class="button">Activer mon compte</a>
            <p>Cordialement,<br>L'équipe du site</p>
          </div>
        </body>
      </html>
    `,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de bienvenue :', error)
    } else {
      console.log('E-mail de bienvenue envoyé avec succès !')
    }
  })
}

  async function sendPasswordEmail(email, activationLink) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
      user: 'studyspheretn@gmail.com ', pass: 'uqct kspi rgnt yzre',
    },
  })


  const mailOptions = {
    from: 'studyspheretn@gmail.com', to: email, subject: 'Bienvenue sur notre site', html: `
            <html>
<head>
    <style>
        /* Add your custom styles here */
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            padding: 20px;
        }

        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333333;
            text-align: center;
        }

        p {
            color: #555555;
        }

        h2 {
            color: #0000FF;
            margin-bottom: 20px;
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
        <h1>Bienvenue sur notre site</h1>
        <p>Cher <span class="username">client</span>,</p>
        <p>Nous sommes ravis de vous accueillir parmi nous !</p>
        <p>Veuillez cliquer sur le bouton ci-dessous pour modifier votre Mots de Passe :</p>
        <a href="${activationLink}" class="button">Se Connecte</a>
        <p>Cordialement,<br>L'équipe du Study Sphere</p>
    </div>
</body>
</html>
        `,
  }

  // Envoyer l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('E-mail de bienvenue envoyé : ' + info.response)
    }
  })
}
module.exports.sendforgetPassword = async (req, res) => {
  try {
    const email = req.body.email
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(200).json({ message: 'email non enregistre' })
    }

    // Create a unique token for each password reset request
    const token = createTokenmdp(user._id);

    // Save the token and set the 'used' flag to false in the user document
    user.resetPasswordToken = token;
    user.resetPasswordUsed = false;
    await user.save();

    const activationLink = `http://localhost:3000/auth/Resetmdp?token=${token}&message=tu_peux_changer_votre_mdp&email=${email}`;

    sendPasswordEmail(email,activationLink)
    res.status(200).json({
      message: 'mot de passe modifié avec succès vérifier votre boîte mail'
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports.forgetpassword = async (req, res) => {
  try {
    const email = req.body.user.email;
    const Password = req.body.user.password;
    const token = req.body.user.token; // Récupérer le jeton depuis la requête
    console.log(token,email);
    const checkIfUserExists = await userModel.findOne({ email });

    if (!checkIfUserExists) {
      return res.status(200).json({ message: 'Email non enregistré' });
    }

    const currentDate = new Date();

    if (!Password || Password.trim() === '') {
      return res.status(200).json({ message: 'Le mot de passe est manquant ou vide' });
    }

    // Vérifier la validité du jeton
    jwt.verify(token, 'net StudySphere secret', async (err, decoded) => {
      if (err) {
        return res.status(200).json({ message: 'Le lien a expiré.' });
      }

      const user = await userModel.findOne({ email, resetPasswordToken: token, resetPasswordUsed: false });

      if (!user) {
        return res.status(200).json({ message: 'Le lien deja utiliser.' });
      }

      const salt = await bcrypt.genSalt();
      const Pwd = await bcrypt.hash(Password, salt);

      const updatedUser = await userModel.findOneAndUpdate(
        { email },
        {
          $set: {
            etat: true,
            updatedAt: currentDate,
            resetPasswordUsed : true,
            password: Pwd,
          },
        },
      );

      console.log(updatedUser);
      res.status(200).json({
        message: 'Mot de passe modifié avec succès. Veuillez vérifier votre boîte mail.',
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la modification du mot de passe.' });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const id = req.params.id;
    // Utilisez findById pour trouver l'utilisateur par son ID
    const user = await userModel.findById(id);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Utilisez findOneAndUpdate pour mettre à jour le champ statu
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: id }, // Utilisez _id pour correspondre à l'ID MongoDB
      { statu: false },
      { new: true } // Pour obtenir le document mis à jour
    );

    console.log(updatedUser);

    res.cookie('jwt_token', '', { httpOnly: false, maxAge: 1 });
    req.session.destroy();
    res.status(200).json({
      message: 'User successfully logged out',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find()
    if (!users || users.length === 0) {
      throw new Error('users not found !')
    }
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getAdmin = async (req, res, next) => {
  try {
    const users = await userModel.find({ role: 'admin' })
    if (!users || users.length === 0) {
      throw new Error('Users not found!')
    }
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getSimpleUser = async (req, res, next) => {
  try {
    const users = await userModel.find({ role: 'client' })
    if (!users || users.length === 0) {
      throw new Error('Users not found!')
    }
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getUserActive = async (req, res, next) => {
  try {
    const users = await userModel.find({ etat: 'true' })
    if (!users || users.length === 0) {
      throw new Error('Users not found!')
    }
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getUserConnecter = async (req, res, next) => {
  try {
    const users = await userModel.find({ statu: 'true' })
    if (!users || users.length === 0) {
      throw new Error('Users not found!')
    }
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getUserDeConnecter = async (req, res, next) => {
  try {
    const users = await userModel.find({ statu: 'false' })
    if (!users || users.length === 0) {
      throw new Error('Users not found!')
    }
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getUserArchive = async (req, res, next) => {
  try {
    // Recherche des utilisateurs archivés en fonction de la valeur de archi
    const archivedUsers = await userModel.find({ archivage: { $exists: true } })
    .populate({
      path: 'archivage',
      match: { archi: true }, // Filtrer les archivages avec archi à true
    });

    if (!archivedUsers || archivedUsers.length === 0) {
      throw new Error('Aucun utilisateur archivé trouvé !');
    }

    // Filtrer les utilisateurs avec au moins un archivage correspondant à archi=true
    const filteredUsers = archivedUsers.filter(user => user.archivage !== null);

    res.status(200).json({ users: filteredUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.getUserDesactive = async (req, res, next) => {
  try {
    const users = await userModel.find({ etat: 'false' })
    if (!users || users.length === 0) {
      throw new Error('Users not found!')
    }
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.searchUsers = async (req, res, next) => {
  try {
    const searchTerm = req.query.term // Récupérer le terme de recherche à partir de la requête

    // Utiliser la méthode find avec un critère de recherche basé sur le terme
    const users = await userModel.find({
      $or: [
        { nom: { $regex: searchTerm, $options: 'i' } }, // Recherche insensible à la casse dans le nom d'utilisateur
        { email: { $regex: searchTerm, $options: 'i' } } // Recherche insensible à la casse dans l'e-mail
      ]
    })

    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getUser = async (req, res, next) => {
  try {
    const id = req.session.user._id.toString();
    const user = await userModel.findById(id).populate('notifications')
    .populate({
      path: 'xp',
      populate: {
        path: 'niveauAtteint',
        model: 'Niveau' // Assurez-vous que le modèle de niveau est correctement référencé ici
      }
    })
    .populate({
      path: 'xp',
      populate: {
        path: 'badgeIds',
        model: 'Badge' // Assurez-vous que le modèle de badge est correctement référencé ici
      },
      options: { strictPopulate: false } // Utilisez l'option strictPopulate avec la valeur false pour peupler un champ non défini dans le schéma
    });
    if (!user) {
      throw new Error('Utilisateur introuvable !');
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.UserByID = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await userModel.findById(id).populate('xp')

    if (!user || user.length === 0) {
      throw new Error('users not found !')
    }
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// module.exports.addUser = async (req, res, next) => {
//   try {
//     const { filename } = req.file
//     console.log('filename', req.file)
//     const {
//       surnom, password, email, nom, prenom, phoneNumber, role,
//     } = req.body
//     console.log(req.body)
//     const user = new userModel({
//       surnom, password, email, nom, prenom, phoneNumber, role, image_user: filename,
//     })
//
//     const addeduser = await user.save()
//
//     res.status(200).json(addeduser)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }
// module.exports.deleteUser = async (req, res, next) => {
//   try {
//
//     const { id } = req.params;
//     const user = await userModel.findById(id);
//
//     if (!user) {
//       return res.status(404).json({ message: 'User not found!' });
//     }
//
//     await userModel.findByIdAndDelete(user._id);
//
//     // Envoyez la réponse JSON après la suppression
//     res.status(200).json('User deleted successfully.');
//   } catch (error) {
//     // Gérez les erreurs
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports.archiver = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the user exists
    const user = await userModel.findById(id);

    if (!user) {
      throw new Error('User not found!');
    }

    // Check if the user already has an archive
    let existingArchivage = await archivageModel.findOne({ user: user._id });

    if (existingArchivage) {
      // User already has an archive, toggle the archi field
      const updatedArchivage = await archivageModel.findByIdAndUpdate(existingArchivage._id, {
        $set: {
          archi: !existingArchivage.archi, // Toggle the archi field
          updatedAt: new Date(),
        },
      }, { new: true });

      // Update the user
      const updatedUser = await userModel.findByIdAndUpdate(id, {
        $set: {
          archivage: updatedArchivage._id,
        },
      }, { new: true });

      res.status(200).json(updatedUser);
    } else {
      // User doesn't have an archive, create a new one with archi set to true
      const archivage = new archivageModel({
        dateArchivage: new Date(),
        raison: 'YourReasonHere', // Provide a reason for archiving
        user: user._id, // Reference to the user
        archi: true,
      });

      // Save the Archivage document
      await archivage.save();

      // Update the user
      const updatedUser = await userModel.findByIdAndUpdate(id, {
        $set: {
          archivage: archivage._id,
        },
      }, { new: true });

      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports.forgotpwd = async (req, res) => {
  const { email } = req.body
  const URL = 'http://localhost:3000/resetpwd'

  try {
    res.status(200).json({ message: 'Welcome' })
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email, from: 'greencrowdproject@gmail.com', subject: 'Welcome to Green Crowd Project', html: `
				<h2>Click the link to reset your password</h2>
				<p>${URL}</p>
			`, //templateId: 'd-e09cf57a0a0e45e894027ffd5b6caebb',
    }
    sgMail.send(msg).then(() => {
      console.log('Email sent')
    }).catch((error) => {
      console.error(error)
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports.upgrade = async (req, res) => {
  try {
    // console.log('test', req.bod)

    const { id } = req.body // Récupération de l'ID depuis le corps de la requête
    const checkIfUserExists = await userModel.findById(id)

    if (!checkIfUserExists) {
      throw new Error('User not found!')
    }

    const currentDate = new Date()
    const role = 'admin'

    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        role: role, etat: true, updatedAt: currentDate,
      },
    }, { new: true })

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.downgrade = async (req, res) => {
  try {
    const { id } = req.body
    const checkIfusertExists = await userModel.findById(id)
    if (!checkIfusertExists) {
      throw new Error('user not found !')
    }
    const currentDate = new Date()
    const client = 'client'
    updateedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        role: client, etat: true, updatedAt: currentDate,
      },
    }, { new: true })
    res.status(200).json(updateedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.Desactive = async (req, res) => {
  try {
    const { id } = req.body
    const checkIfusertExists = await userModel.findById(id)
    if (!checkIfusertExists) {
      throw new Error('user not found !')
    }
    const currentDate = new Date()
    updateedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        etat: false, updatedAt: currentDate,
      },
    }, { new: true })
    res.status(200).json(updateedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.Active = async (req, res) => {
  try {
    const { id } = req.body
    const checkIfusertExists = await userModel.findById(id)
    if (!checkIfusertExists) {
      throw new Error('user not found !')
    }
    const currentDate = new Date()
    updateedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        etat: true, updatedAt: currentDate,
      },
    }, { new: true })
    res.status(200).json(updateedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.verification = async (req, res) => {
  const { email } = req.body
  // Check if email is provided
  try {
    if (!email) {
      return res.status(200).json({ message: 'Email is required' })
    }
    const checkIfUserExists = await userModel.findOne({ email })
    console.log(email,checkIfUserExists)
    if (checkIfUserExists) {
      // If user is found, respond with 409 (Conflict)
      return res.status(200).json({ message: 'cette email exists déja' })
    }
    sendWelcomeEmailverfication(email)
    res.status(201).json({ email })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

function sendWelcomeEmailverfication (email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
      user: 'studyspheretn@gmail.com', pass: 'uqct kspi rgnt yzre',
    },
  })
  const activationLink = `http://localhost:5000/auth/VerificationEmail?email=${encodeURIComponent(email)}`
  const mailOptions = {
    from: 'studyspheretn@gmail.com', to: email, subject: 'Bienvenue sur notre site', html: `
      <html>
        <head>
          <style>
            /* Add your custom styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              padding: 20px;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 5px;
              box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
            }
            p {
              color: #555555;
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
            <h1>Bienvenue sur notre site</h1>
            <p>Cher</p> <h2> </h2>
            <p>Nous sommes ravis de vous accueillir parmi nous !</p>
            <p>Veuillez cliquer sur le bouton ci-dessous pour activer votre compte :</p>
            <a href="${activationLink}" class="button">Cree mon compte</a>
            <p>Cordialement,<br>L'équipe du site</p>
          </div>
        </body>
      </html>
    `,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de bienvenue :', error)
    } else {
      console.log('E-mail de bienvenue envoyé avec succès !')
    }
  })
}

module.exports.VerificationEmail = async (req, res) => {
  try {
    const email = req.query.email

    return res.redirect(`http://localhost:3000/auth/register/?message=Email_verifier_avec_succee&email=${email}`)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
