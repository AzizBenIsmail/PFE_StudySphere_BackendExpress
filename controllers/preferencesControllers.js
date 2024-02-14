const userModel = require('../models/userSchema')
const preferencesModel = require('../models/preferencesSchema')

module.exports.AddPreferences = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the user exists
    const user = await userModel.findById(id);

    if (!user) {
      throw new Error('User not found!');
    }
    // // Check if the user already has an archive
    // let existingArchivage = await preferencesModel.findOne({ user: user._id });


    // User doesn't have an archive, create a new one with archi set to true
    const preferences = new preferencesModel({
      domaine: 'VotreDomaine',
      emplacement_actuelle: 'VotreEmplacement',
      langue: 'VotreLangue',
      reputation: 0,
    });

    // Save the Archivage document
    await preferences.save();

    // Update the user
    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        preferences: preferences._id,
      },
    }, { new: true });

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

