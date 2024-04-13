const Badge = require('../models/badgeSchema')
const fs = require('fs')
const User = require('../models/userSchema')
const XP = require('../models/xpSchema')
const { addNotification } = require('./notificationControllers') // Assurez-vous que le chemin d'importation est correct
const Notification = require('../models/notificationSchema')

// Créer un nouveau badge
exports.createBadge = async (req, res) => {
  try {
    const { filename } = req.file

    const { nom, description } = req.body
    const badge = new Badge({ nom, description, image_badge: filename })
    const newBadge = await badge.save()

    res.status(201).json(newBadge)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer tous les badges
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find()
    res.status(200).json(badges)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer un badge par son ID
exports.getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id)
    if (!badge) {
      return res.status(404).json({ message: 'Badge introuvable' })
    }
    res.status(200).json(badge)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mettre à jour un badge
exports.updateBadge = async (req, res) => {
  try {
    const { nom, description } = req.body
    const id = req.params.id
    const checkIfBadgeExists = await Badge.findById(id)
    if (!checkIfBadgeExists) {
      throw new Error('Badge non trouvé !')
    }
    const updateFields = {
      nom,
      description,
    }
    if (req.file) {
      const { filename } = req.file
      updateFields.image_badge = filename
    }
    const updatedBadge = await Badge.findByIdAndUpdate(id, {
      $set: updateFields,
    }, { new: true })
    res.status(200).json(updatedBadge)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}

// Supprimer un badge
exports.deleteBadge = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id)
    if (!badge) {
      return res.status(404).json({ message: 'Badge introuvable' })
    }
    await Badge.findByIdAndDelete(req.params.id)
    if (badge.image_badge) {
      const imagePath = `public/images/Badges/${badge.image_badge}`
      fs.unlinkSync(imagePath) // Supprimer le fichier
    }
    res.status(200).json({ message: 'Badge supprimé avec succès' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports.affecterBadgeUtilisateur = async (userId, badgeNom,url, req, res) => {
  try {
    // Rechercher l'utilisateur
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('Utilisateur introuvable')
    }
    // Rechercher le badge par son nom
    const badge = await Badge.findOne({ nom: badgeNom })
    if (!badge) {
      throw new Error(`Badge avec le nom '${badgeNom}' non trouvé`)
    }

    // Vérifier si l'utilisateur a déjà ce badge
    const xp = await XP.findOne({ user: userId })
    if (xp.badgeIds.includes(badge._id)) {
      throw new Error(`L'utilisateur a déjà le badge '${badgeNom}'`)
    }

    await addNotification(user._id, `Vous avez obtenu le badge ${badgeNom}!`, 'Badge', 'AccountManagement/BadgesNiveauXp', req, res)

    xp.badgeIds.push(badge._id)
    await xp.save()

  } catch (error) {
    console.log(error)
  }
}
