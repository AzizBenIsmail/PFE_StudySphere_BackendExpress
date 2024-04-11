const userModel = require('../models/userSchema')
const archivageModel  = require('../models/archivageSchema')
const bcrypt = require('bcrypt')
const fs = require('fs')
const XP = require('../models/xpSchema')
const pref = require('../models/preferencesSchema')
const jwt = require('jsonwebtoken')
const { addNotification } = require('./notificationControllers')

module.exports.getUsers = async (req, res, next) => {
  try {
    // Recherchez les utilisateurs sans référence d'archivage
    const users = await userModel.find({ 'archivage': { $exists: false } }).populate('preferences');

    if (!users || users.length === 0) {
      throw new Error('Utilisateurs non trouvés !')
    }

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

module.exports.getFormateur = async (req, res, next) => {
  try {
    const users = await userModel.find({ role: 'formateur' })
    if (!users || users.length === 0) {
      res.status(200).json({ message : 'Users not found!' })
    }else {
      res.status(200).json({ users })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getModerateur = async (req, res, next) => {
  try {
    const users = await userModel.find({ role: 'moderateur' })
    if (!users || users.length === 0) {
      throw new Error('Users not found!')
    }
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.getCentre = async (req, res, next) => {
  try {
    const users = await userModel.find({ role: 'centre' }).populate('preferences');
    if (!users || users.length === 0) {
      res.status(200).json({ message : 'Users not found!' })
    }else {
      res.status(200).json({ users })
    }
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
    const id = req.session.user._id.toString()
    const user = await userModel.findById(id)
    if (!user || user.length === 0) {
      throw new Error('users not found !')
    }
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.UserByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id).populate('archivage').populate("Formations").populate("preferences");
    if (!user) {
      throw new Error('User not found!');
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await userModel.findById(id)

    if (!user) {
      return res.status(404).json({ message: 'user not found!' })
    }

    await userModel.findByIdAndDelete(user._id)
    if (user.image_user) {
      const imagePath = `public/images/Users/${user.image_user}`;
      fs.unlinkSync(imagePath); // Supprimer le fichier
    }
    await XP.deleteMany({ user: user._id });
    await pref.deleteMany({ user: user._id });

    res.status(200).json('deleted')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.desarchiver = async (req, res) => {
  try {
    const { id } = req.body;

    // Rechercher l'utilisateur
    const user = await userModel.findById(id);

    if (!user) {
      throw new Error('Utilisateur non trouvé!');
    }

    // Rechercher l'archive de l'utilisateur
    let existingArchivage = await archivageModel.findOne({ user: user._id });

    if (existingArchivage) {
      // Supprimer la référence à l'archivage dans l'utilisateur
      await userModel.findByIdAndUpdate(id, { $unset: { archivage: 1 } });

      await archivageModel.findByIdAndDelete(existingArchivage._id);

      // Mettre à jour l'archivage pour définir archi à false
      const updatedArchivage = await archivageModel.findByIdAndUpdate(existingArchivage._id, {
        $set: {
          archi: false,
          updatedAt: new Date(),
        },
      }, { new: true });

      res.status(200).json(updatedArchivage);
    } else {
      // Aucun archivage trouvé pour cet utilisateur
      res.status(404).json({ message: 'Aucune archive trouvée pour cet utilisateur.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

module.exports.upgradeModerateur = async (req, res) => {
  try {
    // console.log('test', req.bod)

    const { id } = req.body // Récupération de l'ID depuis le corps de la requête
    const checkIfUserExists = await userModel.findById(id)

    if (!checkIfUserExists) {
      throw new Error('User not found!')
    }

    const currentDate = new Date()
    const role = 'moderateur'

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

module.exports.upgradeFormateur = async (req, res) => {
  try {
    // console.log('test', req.bod)

    const { id } = req.body // Récupération de l'ID depuis le corps de la requête
    const checkIfUserExists = await userModel.findById(id)

    if (!checkIfUserExists) {
      throw new Error('User not found!')
    }

    const currentDate = new Date()
    const role = 'formateur'

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

module.exports.isUserArchived = async (userId) => {
  try {
    const user = await userModel.findById(userId).populate('archivage');

    if (!user) {
      throw new Error('Utilisateur non trouvé !');
    }

    // Vérifier si l'utilisateur est archivé en fonction de la valeur de l'attribut 'archi' dans l'archivage
    const isArchived = user.archivage ? user.archivage.archi : false;

    return isArchived;
  } catch (error) {
    throw new Error(`Erreur lors de la détermination de l'état d'archivage de l'utilisateur : ${error.message}`);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { nom, prenom, password, email } = req.body;
    const { id } = req.params;

    const checkIfUserExists = await userModel.findById(id);
    if (!checkIfUserExists) {
      throw new Error('Utilisateur non trouvé !');
    }

    const currentDate = new Date();
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(password, salt);

    const updateFields = {
      // password: hashedPassword,
      nom,
      prenom,
      email,
      updatedAt: currentDate,
    };

    // Vérifier s'il existe une propriété req.file
    if (req.file) {
      const { filename } = req.file;
      updateFields.image_user = filename;

      if (checkIfUserExists.image_user && fs.existsSync(`public/images/Users/${checkIfUserExists.image_user}`)) {
        fs.unlinkSync(`public/images/Users/${checkIfUserExists.image_user}`);
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: updateFields,
    }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateCenterByID = async (req, res, next) => {
  try {
    const { nom, email, password } = req.body;
    const id = req.params.id;

    const checkIfUserExists = await userModel.findById(id);
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(password, salt);

    if (!checkIfUserExists) {
      throw new Error('Utilisateur non trouvé !');
    }

    const currentDate = new Date();
    const updateFields = {
      // password: hashedPassword,
      nom,
      email,
      updatedAt: currentDate,
    };

    // Vérifier s'il existe une propriété req.file
    if (req.file) {
      const { filename } = req.file;
      updateFields.image_user = filename;

      if (checkIfUserExists.image_user && fs.existsSync(`public/images/Users/${checkIfUserExists.image_user}`)) {
        fs.unlinkSync(`public/images/Users/${checkIfUserExists.image_user}`);
      }

    }

    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: updateFields,
    }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.forgetpasswordByAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log("id",id)
    const { password } = req.body;
    const checkIfUserExists = await userModel.findById(id);

    if (!checkIfUserExists) {
      return res.status(200).json({ message: 'User non enregistré' });
    }

    const currentDate = new Date();

    if (!password || password.trim() === '') {
      return res.status(200).json({ message: 'Le mot de passe est manquant ou vide' });
    }
      console.log(password)
      const salt = await bcrypt.genSalt();
      const Pwd = await bcrypt.hash(password, salt);

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          updatedAt: currentDate,
          password: Pwd,
        },
      },
    );

    await addNotification( id,"Alert ! votre mots de passe a ete modifier par un admin.","Securite",`/Info/warningAuth`, req, res);


    console.log(updatedUser);
      res.status(200).json({
        message: 'Mot de passe modifié avec succès. Veuillez vérifier votre boîte mail.',
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la modification du mot de passe.' });
  }
};

module.exports.forgetpassword = async (req, res) => {
  try {
    const id = req.session.user._id;
    const { password } = req.body;
    console.log(id,password)

    const checkIfUserExists = await userModel.findById(id);

    if (!checkIfUserExists) {
      return res.status(200).json({ message: 'User non enregistré' });
    }

    const currentDate = new Date();

    if (!password || password.trim() === '') {
      return res.status(200).json({ message: 'Le mot de passe est manquant ou vide' });
    }
    console.log(password)
    const salt = await bcrypt.genSalt();
    const Pwd = await bcrypt.hash(password, salt);

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          updatedAt: currentDate,
          password: Pwd,
        },
      },
    );

    await addNotification( id,"Alert ! votre mots de passe a ete modifier.","Securite",`Info/warningAuth`, req, res);


    console.log(updatedUser);
    res.status(200).json({
      message: 'Mot de passe modifié avec succès. Veuillez vérifier votre boîte mail.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la modification du mot de passe.' });
  }
};
