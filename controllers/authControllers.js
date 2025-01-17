const userModel = require('../models/userSchema')
const archivageModel  = require('../models/archivageSchema')

const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const { addNotification } = require('./notificationControllers')

const maxAge = 72 * 60 * 60 // 2 heures

const createToken = (id) => {
  return jwt.sign({ id }, process.env.Net_Secret, {
    expiresIn: maxAge,
  })
}

const createTokenmdp = (id) => {
  return jwt.sign({ id, exp: Math.floor(Date.now() / 1000) + 120 }, process.env.Net_Secret);
};

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
      return res.redirect(`${process.env.Origin_Back}/auth/login/?message=Compte_Verifier_Avec_Succee`)
    }

    const currentDate = new Date()
    const updatedUser = await userModel.findByIdAndUpdate(checkIfUserExists._id, {
        $set: {
          etat: true, updatedAt: currentDate,
        },
      }, { new: true } // Set the { new: true } option to return the updated user
    )

    return res.redirect(`${process.env.Origin_Front}/login-page/?message=Utilisateur_Activee_Avec_Succes`)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await userModel.login(email, password)
    if (user && user.statu === "true") {
      await addNotification( user._id,"Alert ! Une nouvelle connexion a été détectée sur votre compte.","Securite",`Info/warningAuth`, req, res);
    }
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
      message: 'User successfully authenticated', user: user,      token: token, // Inclure le token dans la réponse
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
  const activationLink = `${process.env.Origin_Front}/auth/validation?email=${encodeURIComponent(email)}`
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
        <h1>Réinitialiser votre mot de passe</h1>
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
    const email = req.body.email;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: 'email non enregistre' });
    }

    // Create a unique token for each password reset request
    const token = createTokenmdp(user._id);

    // Find the user by ID and update the resetPasswordToken and resetPasswordUsed fields
    await userModel.findByIdAndUpdate(
      user._id,
      {
        resetPasswordToken: token,
        resetPasswordUsed: false
      }
    );

    const activationLink = `${process.env.Origin_Front}/auth/Resetmdp?token=${token}&message=tu_peux_changer_votre_mdp&email=${email}`;

    sendPasswordEmail(email, activationLink);
    res.status(200).json({
      message: 'mot de passe modifié avec succès vérifier votre boîte mail'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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
    jwt.verify(token, process.env.Net_Secret, async (err, decoded) => {
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

module.exports.getUser = async (req, res, next) => {
  try {
    const id = req.session.user._id.toString();
    const user = await userModel.findById(id).populate('notifications').populate('staff_enseignant').populate("centresTravailAssocies").populate("preferences").populate('Formations')
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
  const activationLink = `${process.env.Origin_Back}/auth/VerificationEmail?email=${encodeURIComponent(email)}`
  const mailOptions = {
    from: 'studyspheretn@gmail.com', to: email, subject: 'Bienvenue sur notre site', html: `
     <html
  dir="ltr"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="fr"
>
  <head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta content="telephone=no" name="format-detection" />
    <title>New Template</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Nunito:wght@600&display=swap"
      rel="stylesheet"
    />
    <style type="text/css">
      .rollover:hover .rollover-first {
        max-height: 0px !important;
        display: none !important;
      }
      .rollover:hover .rollover-second {
        max-height: none !important;
        display: block !important;
      }
      .rollover span {
        font-size: 0px;
      }
      u + .body img ~ div div {
        display: none;
      }
      #outlook a {
        padding: 0;
      }
      span.MsoHyperlink,
      span.MsoHyperlinkFollowed {
        color: inherit;
        mso-style-priority: 99;
      }
      a.es-button {
        mso-style-priority: 100 !important;
        text-decoration: none !important;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      .es-desk-hidden {
        display: none;
        float: left;
        overflow: hidden;
        width: 0;
        max-height: 0;
        line-height: 0;
        mso-hide: all;
      }
      .es-button-border:hover > a.es-button {
        color: #ffffff !important;
      }
      @media only screen and (max-width: 600px) {
        .es-m-p0r {
          padding-right: 0px !important;
        }
        .es-m-p20b {
          padding-bottom: 20px !important;
        }
        .es-m-p0l {
          padding-left: 0px !important;
        }
        *[class="gmail-fix"] {
          display: none !important;
        }
        p,
        a {
          line-height: 150% !important;
        }
        h1,
        h1 a {
          line-height: 120% !important;
        }
        h2,
        h2 a {
          line-height: 120% !important;
        }
        h3,
        h3 a {
          line-height: 120% !important;
        }
        h4,
        h4 a {
          line-height: 120% !important;
        }
        h5,
        h5 a {
          line-height: 120% !important;
        }
        h6,
        h6 a {
          line-height: 120% !important;
        }
        h1 {
          font-size: 50px !important;
          text-align: center;
        }
        h2 {
          font-size: 34px !important;
          text-align: center;
        }
        h3 {
          font-size: 20px !important;
          text-align: center;
        }
        h4 {
          font-size: 24px !important;
          text-align: left;
        }
        h5 {
          font-size: 20px !important;
          text-align: left;
        }
        h6 {
          font-size: 16px !important;
          text-align: left;
        }
        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
          font-size: 50px !important;
        }
        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
          font-size: 34px !important;
        }
        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
          font-size: 20px !important;
        }
        .es-header-body h4 a,
        .es-content-body h4 a,
        .es-footer-body h4 a {
          font-size: 24px !important;
        }
        .es-header-body h5 a,
        .es-content-body h5 a,
        .es-footer-body h5 a {
          font-size: 20px !important;
        }
        .es-header-body h6 a,
        .es-content-body h6 a,
        .es-footer-body h6 a {
          font-size: 16px !important;
        }
        .es-menu td a {
          font-size: 10px !important;
        }
        .es-header-body p,
        .es-header-body a {
          font-size: 14px !important;
        }
        .es-content-body p,
        .es-content-body a {
          font-size: 14px !important;
        }
        .es-footer-body p,
        .es-footer-body a {
          font-size: 12px !important;
        }
        .es-infoblock p,
        .es-infoblock a {
          font-size: 12px !important;
        }
        .es-m-txt-c,
        .es-m-txt-c h1,
        .es-m-txt-c h2,
        .es-m-txt-c h3,
        .es-m-txt-c h4,
        .es-m-txt-c h5,
        .es-m-txt-c h6 {
          text-align: center !important;
        }
        .es-m-txt-r,
        .es-m-txt-r h1,
        .es-m-txt-r h2,
        .es-m-txt-r h3,
        .es-m-txt-r h4,
        .es-m-txt-r h5,
        .es-m-txt-r h6 {
          text-align: right !important;
        }
        .es-m-txt-j,
        .es-m-txt-j h1,
        .es-m-txt-j h2,
        .es-m-txt-j h3,
        .es-m-txt-j h4,
        .es-m-txt-j h5,
        .es-m-txt-j h6 {
          text-align: justify !important;
        }
        .es-m-txt-l,
        .es-m-txt-l h1,
        .es-m-txt-l h2,
        .es-m-txt-l h3,
        .es-m-txt-l h4,
        .es-m-txt-l h5,
        .es-m-txt-l h6 {
          text-align: left !important;
        }
        .es-m-txt-r img,
        .es-m-txt-c img,
        .es-m-txt-l img {
          display: inline !important;
        }
        .es-m-txt-r .rollover:hover .rollover-second,
        .es-m-txt-c .rollover:hover .rollover-second,
        .es-m-txt-l .rollover:hover .rollover-second {
          display: inline !important;
        }
        .es-m-txt-r .rollover span,
        .es-m-txt-c .rollover span,
        .es-m-txt-l .rollover span {
          line-height: 0 !important;
          font-size: 0 !important;
        }
        .es-spacer {
          display: inline-table;
        }
        a.es-button,
        button.es-button {
          font-size: 18px !important;
          line-height: 120% !important;
        }
        a.es-button,
        button.es-button,
        .es-button-border {
          display: inline-block !important;
        }
        .es-m-fw,
        .es-m-fw.es-fw,
        .es-m-fw .es-button {
          display: block !important;
        }
        .es-m-il,
        .es-m-il .es-button,
        .es-social,
        .es-social td,
        .es-menu {
          display: inline-block !important;
        }
        .es-adaptive table,
        .es-left,
        .es-right {
          width: 100% !important;
        }
        .es-content table,
        .es-header table,
        .es-footer table,
        .es-content,
        .es-footer,
        .es-header {
          width: 100% !important;
          max-width: 600px !important;
        }
        .adapt-img {
          width: 100% !important;
          height: auto !important;
        }
        .es-mobile-hidden,
        .es-hidden {
          display: none !important;
        }
        .es-desk-hidden {
          width: auto !important;
          overflow: visible !important;
          float: none !important;
          max-height: inherit !important;
          line-height: inherit !important;
        }
        tr.es-desk-hidden {
          display: table-row !important;
        }
        table.es-desk-hidden {
          display: table !important;
        }
        td.es-desk-menu-hidden {
          display: table-cell !important;
        }
        .es-menu td {
          width: 1% !important;
        }
        table.es-table-not-adapt,
        .esd-block-html table {
          width: auto !important;
        }
        .es-social td {
          padding-bottom: 10px;
        }
        .h-auto {
          height: auto !important;
        }
      }
      @media screen and (max-width: 384px) {
        .mail-message-content {
          width: 414px !important;
        }
      }
    </style>
  </head>
  <body class="body" style="width: 100%; height: 100%; padding: 0; margin: 0">
    <div
      dir="ltr"
      class="es-wrapper-color"
      lang="fr"
      style="background-color: #02687f"
    >
      <table
        class="es-wrapper"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          border-collapse: collapse;
          border-spacing: 0px;
          padding: 0;
          margin: 0;
          width: 100%;
          height: 100%;
          background-image: url(https://fiahjxx.stripocdn.email/content/guids/CABINET_8fbba731b18c07448ff3a0b3cb247c11/images/group_nUw.png);
          background-repeat: repeat;
          background-position: center top;
          background-color: #02687f;
        "
        background="https://fiahjxx.stripocdn.email/content/guids/CABINET_8fbba731b18c07448ff3a0b3cb247c11/images/group_nUw.png"
        role="none"
      >
        <tr>
          <td valign="top" style="padding: 0; margin: 0">
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-header"
              align="center"
              role="none"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                width: 100%;
                table-layout: fixed !important;
                background-color: transparent;
                background-repeat: repeat;
                background-position: center top;
              "
            >
              <tr>
                <td align="center" style="padding: 0; margin: 0">
                  <table
                    bgcolor="#ffffff"
                    class="es-header-body"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: #ffffff;
                      border-radius: 20px 20px 0 0;
                      width: 600px;
                    "
                    role="none"
                  >
                    <tr>
                      <td align="left" style="padding: 0; margin: 0">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-left"
                          align="left"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: left;
                          "
                        >
                          <tr>
                            <td
                              class="es-m-p0r es-m-p20b"
                              valign="top"
                              align="center"
                              style="padding: 0; margin: 0; width: 200px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      font-size: 0px;
                                    "
                                  >
                                    <a
                                      target="_blank"
                                      href="https://viewstripo.email"
                                      style="
                                        mso-line-height-rule: exactly;
                                        text-decoration: underline;
                                        color: #02687f;
                                        font-size: 12px;
                                      "
                                      ><img
                                        src="https://fiahjxx.stripocdn.email/content/guids/CABINET_91d49613e04b725cb8a0153006e5d1a341f48ebb4b1c539495f1f0631e813e19/images/logo.png"
                                        alt="Logo"
                                        style="
                                          display: block;
                                          font-size: 14px;
                                          border: 0;
                                          outline: none;
                                          text-decoration: none;
                                        "
                                        width="95"
                                        title="Logo"
                                        class="adapt-img"
                                        height="42"
                                    /></a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          align="right"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 380px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="left"
                                    style="padding: 0; margin: 0"
                                  >
                                    <p
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: arial, 'helvetica neue',
                                          helvetica, sans-serif;
                                        line-height: 18px;
                                        letter-spacing: 0;
                                        color: #02687f;
                                        font-size: 12px;
                                      "
                                    >
                                      ​
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        style="
                          padding: 0;
                          margin: 0;
                          padding-right: 20px;
                          padding-left: 20px;
                        "
                      >
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tr>
                            <td
                              align="center"
                              valign="top"
                              style="padding: 0; margin: 0; width: 560px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0; font-size: 0"
                                  >
                                    <table
                                      border="0"
                                      width="100%"
                                      height="100%"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr>
                                        <td
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            border-bottom: 2px solid #53c7b4;
                                            background: none;
                                            height: 1px;
                                            width: 100%;
                                            margin: 0px;
                                          "
                                        ></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-content"
              align="center"
              role="none"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                width: 100%;
                table-layout: fixed !important;
              "
            >
              <tr>
                <td align="center" style="padding: 0; margin: 0">
                  <table
                    bgcolor="#ffffff"
                    class="es-content-body"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    role="none"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: #ffffff;
                      width: 600px;
                    "
                  >
                    <tr>
                      <td
                        align="left"
                        style="
                          padding: 0;
                          margin: 0;
                          padding-right: 20px;
                          padding-left: 20px;
                        "
                      >
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tr>
                            <td
                              align="center"
                              valign="top"
                              style="padding: 0; margin: 0; width: 560px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      font-size: 0px;
                                    "
                                  >
                                    <a
                                      target="_blank"
                                      href="https://viewstripo.email"
                                      style="
                                        mso-line-height-rule: exactly;
                                        text-decoration: underline;
                                        color: #53c7b4;
                                        font-size: 14px;
                                      "
                                      ><img
                                        class="adapt-img"
                                        src="https://fiahjxx.stripocdn.email/content/guids/CABINET_91d49613e04b725cb8a0153006e5d1a341f48ebb4b1c539495f1f0631e813e19/images/giphy.gif"
                                        alt="Happy Fathers Day"
                                        style="
                                          display: block;
                                          font-size: 14px;
                                          border: 0;
                                          outline: none;
                                          text-decoration: none;
                                        "
                                        width="300"
                                        title="Happy Fathers Day"
                                        height="225"
                                    /></a>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0"
                                  >
                                    <h2
                                      style="
                                        margin: 0;
                                        font-family: Nunito, Roboto, sans-serif;
                                        mso-line-height-rule: exactly;
                                        letter-spacing: 0;
                                        font-size: 36px;
                                        font-style: normal;
                                        font-weight: bold;
                                        line-height: 43px;
                                        color: #d40c29;
                                      "
                                    >
                                      — Bienvenue —
                                    </h2>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0"
                                  >
                                    <h1
                                      style="
                                        margin: 0;
                                        font-family: Nunito, Roboto, sans-serif;
                                        mso-line-height-rule: exactly;
                                        letter-spacing: 0;
                                        font-size: 54px;
                                        font-style: normal;
                                        font-weight: bold;
                                        line-height: 65px;
                                        color: #013f49;
                                      "
                                    >
                                      sur notre site ForMe
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        style="
                          padding: 0;
                          margin: 0;
                          padding-right: 20px;
                          padding-left: 20px;
                          padding-top: 10px;
                        "
                      >
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tr>
                            <td
                              class="es-m-p20b"
                              align="left"
                              style="padding: 0; margin: 0; width: 560px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    class="es-m-p0r es-m-p0l"
                                    style="
                                      padding: 0;
                                      margin: 0;
                                      padding-right: 40px;
                                      padding-left: 40px;
                                    "
                                  >
                                    <p
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: arial, 'helvetica neue',
                                          helvetica, sans-serif;
                                        line-height: 21px;
                                        letter-spacing: 0;
                                        color: #02687f;
                                        font-size: 14px;
                                      "
                                    >
                                      Nous sommes ravis de vous accueillir parmi
                                      nous !
                                    </p>
                                    <p
                                      style="
                                        margin: 0;
                                        mso-line-height-rule: exactly;
                                        font-family: arial, 'helvetica neue',
                                          helvetica, sans-serif;
                                        line-height: 21px;
                                        letter-spacing: 0;
                                        color: #02687f;
                                        font-size: 14px;
                                      "
                                    >
                                      Veuillez cliquer sur le bouton ci-dessous
                                      pour compléter le creation de votre
                                      compte&nbsp;
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 580px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0"
                                  >
                                    <span
                                      class="es-button-border"
                                      style="
                                        border-style: solid;
                                        border-color: #2cb543;
                                        background: #53c7b4;
                                        border-width: 0px;
                                        display: inline-block;
                                        border-radius: 30px;
                                        width: auto;
                                      "
                                      ><a
                                        href="${activationLink}"
                                        class="es-button"
                                        target="_blank"
                                        style="
                                          mso-style-priority: 100 !important;
                                          text-decoration: none !important;
                                          mso-line-height-rule: exactly;
                                          color: #ffffff;
                                          font-size: 18px;
                                          padding: 10px 20px 10px 20px;
                                          display: inline-block;
                                          background: #53c7b4;
                                          border-radius: 30px;
                                          font-family: Nunito, Roboto,
                                            sans-serif;
                                          font-weight: normal;
                                          font-style: normal;
                                          line-height: 22px;
                                          width: auto;
                                          text-align: center;
                                          letter-spacing: 0;
                                          mso-padding-alt: 0;
                                          mso-border-alt: 10px solid #53c7b4;
                                        "
                                        >Cree Mon Compte</a
      
                                      >
                                    </span>
                                  </td>
                                        <p>Cordialement,<br>L'équipe du site</p>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-footer"
              align="center"
              role="none"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                width: 100%;
                table-layout: fixed !important;
                background-color: transparent;
                background-repeat: repeat;
                background-position: center top;
              "
            >
              <tr>
                <td align="center" style="padding: 0; margin: 0">
                  <table
                    class="es-footer-body"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    bgcolor="#FFFFFF"
                    style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: #ffffff;
                      border-radius: 0 0 10px 10px;
                      width: 600px;
                    "
                    role="none"
                  >
                    <tr>
                      <td
                        align="left"
                        style="
                          padding: 0;
                          margin: 0;
                          padding-right: 20px;
                          padding-left: 20px;
                        "
                      >
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tr>
                            <td
                              align="center"
                              valign="top"
                              style="padding: 0; margin: 0; width: 560px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0; font-size: 0"
                                  >
                                    <table
                                      border="0"
                                      width="100%"
                                      height="100%"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr>
                                        <td
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            border-bottom: 2px solid #53c7b4;
                                            background: none;
                                            height: 1px;
                                            width: 100%;
                                            margin: 0px;
                                          "
                                        ></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        style="
                          padding: 0;
                          margin: 0;
                          padding-right: 20px;
                          padding-left: 20px;
                        "
                      >
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 560px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td style="padding: 0; margin: 0">
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      class="es-menu"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr class="links">
                                        <td
                                          align="center"
                                          valign="top"
                                          width="100.00%"
                                          id="esd-menu-id-3"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            border: 0;
                                            padding-right: 5px;
                                            padding-left: 5px;
                                          "
                                        >
                                          <a
                                            target="_blank"
                                            href="https://viewstripo.email"
                                            style="
                                              mso-line-height-rule: exactly;
                                              text-decoration: none;
                                              font-family: arial,
                                                'helvetica neue', helvetica,
                                                sans-serif;
                                              display: block;
                                              color: #02687f;
                                              font-size: 12px;
                                              font-weight: normal;
                                            "
                                          ></a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="center"
                                    style="padding: 0; margin: 0; font-size: 0"
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="es-table-not-adapt es-social"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        border-collapse: collapse;
                                        border-spacing: 0px;
                                      "
                                    >
                                      <tr>
                                        <td
                                          align="center"
                                          valign="top"
                                          class="es-m-p0r"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-right: 20px;
                                          "
                                        >
                                          <a
                                            target="_blank"
                                            href="https://www.facebook.com/9antra.tn"
                                            style="
                                              mso-line-height-rule: exactly;
                                              text-decoration: underline;
                                              color: #02687f;
                                              font-size: 12px;
                                            "
                                            ><img
                                              title="Facebook"
                                              src="https://fiahjxx.stripocdn.email/content/assets/img/social-icons/logo-colored/facebook-logo-colored.png"
                                              alt="Fb"
                                              width="24"
                                              height="24"
                                              style="
                                                display: block;
                                                font-size: 14px;
                                                border: 0;
                                                outline: none;
                                                text-decoration: none;
                                              "
                                          /></a>
                                        </td>
                                        <td
                                          align="center"
                                          valign="top"
                                          class="es-m-p0r"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-right: 20px;
                                          "
                                        >
                                          <a
                                            target="_blank"
                                            href="https://www.instagram.com/9antra.tn_the_bridge/"
                                            style="
                                              mso-line-height-rule: exactly;
                                              text-decoration: underline;
                                              color: #02687f;
                                              font-size: 12px;
                                            "
                                            ><img
                                              title="Instagram"
                                              src="https://fiahjxx.stripocdn.email/content/assets/img/social-icons/logo-colored/instagram-logo-colored.png"
                                              alt="Inst"
                                              width="24"
                                              height="24"
                                              style="
                                                display: block;
                                                font-size: 14px;
                                                border: 0;
                                                outline: none;
                                                text-decoration: none;
                                              "
                                          /></a>
                                        </td>
                                        <td
                                          align="center"
                                          valign="top"
                                          class="es-m-p0r"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-right: 20px;
                                          "
                                        >
                                          <a
                                            target="_blank"
                                            href="https://www.youtube.com/@9antra.tn_the_bridge"
                                            style="
                                              mso-line-height-rule: exactly;
                                              text-decoration: underline;
                                              color: #02687f;
                                              font-size: 12px;
                                            "
                                            ><img
                                              title="Youtube"
                                              src="https://fiahjxx.stripocdn.email/content/assets/img/social-icons/logo-colored/youtube-logo-colored.png"
                                              alt="Yt"
                                              width="24"
                                              height="24"
                                              style="
                                                display: block;
                                                font-size: 14px;
                                                border: 0;
                                                outline: none;
                                                text-decoration: none;
                                              "
                                          /></a>
                                        </td>
                                        <td
                                          align="center"
                                          valign="top"
                                          style="padding: 0; margin: 0"
                                        >
                                          <img
                                            title="TikTok"
                                            src="https://fiahjxx.stripocdn.email/content/assets/img/social-icons/logo-colored/tiktok-logo-colored.png"
                                            alt="Tt"
                                            width="24"
                                            height="24"
                                            style="
                                              display: block;
                                              font-size: 14px;
                                              border: 0;
                                              outline: none;
                                              text-decoration: none;
                                            "
                                          />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding: 0; margin: 0">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="none"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tr>
                            <td
                              align="left"
                              style="padding: 0; margin: 0; width: 600px"
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                "
                              >
                                <tr>
                                  <td
                                    align="center"
                                    class="made_with"
                                    style="padding: 0; margin: 0; font-size: 0"
                                  >
                                    <a
                                      target="_blank"
                                      href="https://viewstripo.email/?utm_source=templates&utm_medium=email&utm_campaign=business_1&utm_content=say_thanks_to_dad"
                                      style="
                                        mso-line-height-rule: exactly;
                                        text-decoration: underline;
                                        color: #02687f;
                                        font-size: 12px;
                                      "
                                      ><img
                                        src="https://fiahjxx.stripocdn.email/content/guids/CABINET_91d49613e04b725cb8a0153006e5d1a341f48ebb4b1c539495f1f0631e813e19/images/favicon.png"
                                        alt=""
                                        width="35"
                                        style="
                                          display: block;
                                          font-size: 14px;
                                          border: 0;
                                          outline: none;
                                          text-decoration: none;
                                        "
                                        height="35"
                                    /></a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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

    return res.redirect(`${process.env.Origin_Front}/auth/register/?message=Email_verifier_avec_succee&email=${email}`)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
