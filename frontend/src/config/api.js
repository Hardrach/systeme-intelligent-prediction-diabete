/**
 * Configuration de l'API Backend
 * 
 * En production : l'URL pointe vers le backend Flask déployé sur Render.
 * En développement : l'URL pointe vers le serveur local Flask.
 * 
 * ⚠  Après déploiement sur Render, remplacer l'URL ci-dessous par
 *    l'URL réelle de votre service Render (ex: https://diabetes-api-xxxx.onrender.com)
 */

const API_CONFIG = {
  // ➡  Remplacer par votre URL Render après déploiement
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  ENDPOINTS: {
    predict: "/api/predict",
    health: "/api/health",
  },
};

export default API_CONFIG;
