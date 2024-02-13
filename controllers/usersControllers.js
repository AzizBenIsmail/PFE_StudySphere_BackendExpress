const userModel = require('../models/userSchema')
const archivageModel  = require('../models/archivageSchema')

module.exports.getUsers = async (req, res, next) => {
  try {
    // Recherchez les utilisateurs sans référence d'archivage
    const users = await userModel.find({ 'archivage': { $exists: false } });

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
      throw new Error('Users not found!')
    }
    res.status(200).json({ users })
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
    const users = await userModel.find({ role: 'centre' })
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
    const user = await userModel.findById(id).populate('archivage');
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
          modifier_A: new Date(),
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
    console.log('test', req.bod)

    const { id } = req.body // Récupération de l'ID depuis le corps de la requête
    const checkIfUserExists = await userModel.findById(id)

    if (!checkIfUserExists) {
      throw new Error('User not found!')
    }

    const currentDate = new Date()
    const role = 'admin'

    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        role: role, etat: true, modifier_A: currentDate,
      },
    }, { new: true })

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.upgradeModerateur = async (req, res) => {
  try {
    console.log('test', req.bod)

    const { id } = req.body // Récupération de l'ID depuis le corps de la requête
    const checkIfUserExists = await userModel.findById(id)

    if (!checkIfUserExists) {
      throw new Error('User not found!')
    }

    const currentDate = new Date()
    const role = 'moderateur'

    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        role: role, etat: true, modifier_A: currentDate,
      },
    }, { new: true })

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.upgradeFormateur = async (req, res) => {
  try {
    console.log('test', req.bod)

    const { id } = req.body // Récupération de l'ID depuis le corps de la requête
    const checkIfUserExists = await userModel.findById(id)

    if (!checkIfUserExists) {
      throw new Error('User not found!')
    }

    const currentDate = new Date()
    const role = 'formateur'

    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        role: role, etat: true, modifier_A: currentDate,
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
        role: client, etat: true, modifier_A: currentDate,
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
        etat: false, modifier_A: currentDate,
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
        etat: true, modifier_A: currentDate,
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
    const { nom, prenom , password , email } = req.body
    console.log(req.body)
    const { id } = req.params

    const checkIfusertExists = await userModel.findById(id)
    if (!checkIfusertExists) {
      throw new Error('user not found !')
    }
    const currentDate = new Date()
    updateedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        password, nom, prenom, modifier_A: currentDate, email
      },
    }, { new: true })
    res.status(200).json(updateedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.updateCenterByID = async (req, res, next) => {
  try {
    const { nom, email, password } = req.body
    const { filename } = req.file
    const id = req.params.id

    const checkIfusertExists = await userModel.findById(id)
    if (!checkIfusertExists) {
      throw new Error('user not found !')
    }
    const currentDate = new Date()
    updateedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        password, nom, email, modifier_A: currentDate, image_user: filename,
      },
    }, { new: true })
    res.status(200).json(updateedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
