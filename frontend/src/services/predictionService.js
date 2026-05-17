/**
 * Service de prédiction du diabète
 * Gère la communication avec l'API Flask backend.
 */

import axios from "axios";
import API_CONFIG from "../config/api";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000, // 30s — Render free tier peut être lent au cold start
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Vérifie la santé de l'API backend.
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.health);
    return response.data;
  } catch (error) {
    throw new Error("Le serveur de prédiction n'est pas accessible.");
  }
};

/**
 * Envoie les données patient à l'API pour prédiction.
 * 
 * @param {Object} patientData — les 8 features médicales
 * @returns {Object} — résultat de prédiction avec score, diagnostic, recommandation
 */
export const predictDiabetes = async (patientData) => {
  try {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.predict,
      patientData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Erreur côté serveur
      throw new Error(
        error.response.data?.error || "Erreur du serveur de prédiction."
      );
    } else if (error.request) {
      // Pas de réponse
      throw new Error(
        "Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez."
      );
    } else {
      throw new Error("Une erreur inattendue s'est produite.");
    }
  }
};

export default apiClient;
