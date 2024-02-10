const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'].split(" ")[1];
  if (!token) {
    // console.log('Token manquant');
    return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
  }

  jwt.verify(token, 'votre_clé_secrète', (err, decoded) => {
    if (err) {
      // console.log('Erreur de vérification du token :', err);
      return res.status(401).json({ message: 'Accès non autorisé. Token invalide.' });
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;
