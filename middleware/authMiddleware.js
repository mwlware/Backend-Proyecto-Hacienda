const { loadTokens } = require('../controllers/authController');

const requireAuth = async (req, res, next) => {
  try {
    const isAuthenticated = await loadTokens();
    if (!isAuthenticated) {
      return res.redirect('/auth');
    }
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(401).json({ error: 'No autenticado' });
  }
};

module.exports = {
  requireAuth
}; 