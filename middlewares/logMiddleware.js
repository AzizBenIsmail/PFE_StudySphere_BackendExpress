  const { requireAuth_checkUser } = require("../middlewares/authMiddleware");
  const jwt = require("jsonwebtoken");
  const fs = require("fs");
  const userModel = require("../models/userSchema");

  function logMiddleware(req, res, next) {
    const token = req.cookies.jwt_token;
    const startTime = new Date(); // Temps de début de la requête
    if (token) {
      jwt.verify(token, "net attijari secret", async (err, decodedToken) => {
        if (err) {
          req.user = null;
        } else {
          let user = await userModel.findById(decodedToken.id);
          req.user = user;
        }
        appendLog(req, res, startTime);
        next();
      });
    } else {
      req.user = null;
      appendLog(req, res, startTime);
      next();
    }
  }

  function appendLog(req, res, startTime) {
    const headers = JSON.stringify(req.headers);
    const endTime = new Date(); // Temps de fin de la requête
    const executionTime = endTime - startTime; // Temps d'exécution en millisecondes
    const body = Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : 'N/A';
    const referer = req.headers.referer || 'N/A';
    const log = `${new Date().toISOString()} - ${req.method} - ${req.originalUrl} - ${req.ip} - Referer: ${referer} - ${res.statusCode} - User_id: ${req.user ? req.user._id : 'N/A'} | username: ${req.user ? req.user.username : 'N/A'} \nHeaders: ${headers}\nExecution Time: ${executionTime} ms\nBody: ${body}\n - ${res.locals.data}\n`;
    
    try {
      fs.appendFileSync("app.log", log);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement dans le fichier journal :", err);
    }
  }

  module.exports = logMiddleware;
