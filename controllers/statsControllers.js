const express = require('express');
const User = require('../models/userSchema');
const Log = require('../models/logSchema');
const Formation = require('../models/formationSchema');

module.exports.getTotals = async (req, res) => {
  try {
    // Obtenir le nombre total d'utilisateurs
    const totalUsersCount = await User.getTotalUsersCount();
    // Obtenir le nombre total de visites
    const totalVisitsCount = await User.getTotalVisitsCount();
    // Obtenir le nombre total de logs
    const totalLogsCount = await Log.getTotalLogsCount();
    // Obtenir le nombre total de formations
    const totalFormationsCount = await Formation.getTotalFormationsCount();

    // Retourner tous les totaux dans une seule réponse JSON
    res.status(200).json({
      totalUsersCount,
      totalVisitsCount,
      totalLogsCount,
      totalFormationsCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du calcul des totaux', error });
  }
};
