"""
=============================================================================
  Système Intelligent de Prédiction du Diabète — Backend API
  
  Auteur  : Projet Universitaire — Data Science & IA Avancée
  Date    : 2026
  Desc    : API Flask pour la prédiction du risque de diabète via un réseau
            de neurones artificiels (ANN) entraîné sur le dataset Pima Indians.
=============================================================================
"""

import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

try:
    from tensorflow.keras.models import load_model as keras_load_model
except ImportError:
    keras_load_model = None

# ─── Configuration du logging ──────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# ─── Initialisation de l'application Flask ──────────────────────────────────────
app = Flask(__name__)

# CORS : autoriser le frontend (Vercel, localhost, etc.)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ─── Chargement du modèle ANN ──────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "diabetes_model.h5")
model = None

def load_keras_model():
    """Charge le modèle Keras sauvegardé (.h5) au démarrage."""
    global model
    if keras_load_model is None:
        logger.warning("TensorFlow n'est pas installé. Le modèle ne sera pas chargé.")
        return
    try:
        model = keras_load_model(MODEL_PATH)
        logger.info("✅  Modèle ANN chargé avec succès depuis %s", MODEL_PATH)
        # model.summary() might print to stdout rather than returning string, let's avoid it here just in case
    except Exception as e:
        logger.error("❌  Échec du chargement du modèle : %s", str(e))

load_keras_model()

# ─── Paramètres du StandardScaler (issus du notebook) ──────────────────────────
# Ces valeurs DOIVENT correspondre exactement au scaler.mean_ et scaler.scale_
# calculés lors du preprocessing dans le notebook.
# Ordre : [Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI,
#           DiabetesPedigreeFunction, Age]
SCALER_MEAN = np.array([3.8450520, 121.6817, 72.25, 29.1534, 155.548, 32.457,
                         0.47187, 33.2409])
SCALER_SCALE = np.array([3.3699, 30.5360, 12.3822, 10.5163, 118.7758, 6.8753,
                          0.33133, 11.7602])

# NOTE : Ces valeurs sont des estimations basées sur le dataset Pima Indians.
# ➡  Pour une précision maximale, exporter scaler.mean_ et scaler.scale_
#    depuis le notebook et les coller ici.


def preprocess_input(data: dict) -> np.ndarray:
    """
    Transforme les données patient brutes en array normalisé
    prêt pour la prédiction par le modèle ANN.
    
    Applique la même transformation StandardScaler que dans le notebook :
        X_scaled = (X - mean) / scale
    """
    features = np.array([[
        float(data["Pregnancies"]),
        float(data["Glucose"]),
        float(data["BloodPressure"]),
        float(data["SkinThickness"]),
        float(data["Insulin"]),
        float(data["BMI"]),
        float(data["DiabetesPedigreeFunction"]),
        float(data["Age"]),
    ]])
    
    # Normalisation identique au notebook
    features_scaled = (features - SCALER_MEAN) / SCALER_SCALE
    return features_scaled


# ─── Decision Layer — Système de recommandation ────────────────────────────────

def decision_layer(probability: float) -> dict:
    """
    Couche de décision intelligente :
    Convertit la probabilité brute du modèle en diagnostic clinique
    et recommandation médicale adaptée.
    
    Seuils :
        • < 0.3   → Faible risque
        • 0.3–0.6 → Risque moyen
        • > 0.6   → Risque élevé
    """
    score = round(float(probability) * 100, 2)
    
    if probability < 0.3:
        return {
            "score": score,
            "risk_level": "low",
            "diagnostic": "Faible risque de diabète",
            "diagnostic_en": "Low diabetes risk",
            "color": "#10B981",
            "icon": "shield-check",
            "recommendation": (
                "Votre profil médical ne présente pas de signes significatifs "
                "de risque de diabète. Continuez à maintenir un mode de vie sain : "
                "alimentation équilibrée, activité physique régulière (30 min/jour), "
                "et contrôle annuel de la glycémie. Restez vigilant(e) si des "
                "antécédents familiaux existent."
            ),
            "actions": [
                "Maintenir une alimentation équilibrée",
                "Pratiquer 30 minutes d'activité physique par jour",
                "Contrôle annuel de la glycémie",
                "Surveiller le poids corporel",
            ],
        }
    
    elif probability < 0.6:
        return {
            "score": score,
            "risk_level": "medium",
            "diagnostic": "Risque moyen de diabète",
            "diagnostic_en": "Moderate diabetes risk",
            "color": "#F59E0B",
            "icon": "alert-triangle",
            "recommendation": (
                "Votre profil présente des facteurs de risque modérés pour le diabète. "
                "Il est recommandé de consulter un médecin pour un bilan glycémique "
                "complet (glycémie à jeun, HbA1c). Adoptez des mesures préventives : "
                "réduction des sucres raffinés, augmentation de l'activité physique, "
                "et suivi médical tous les 6 mois."
            ),
            "actions": [
                "Consulter un médecin pour un bilan complet",
                "Réduire la consommation de sucres raffinés",
                "Augmenter l'activité physique à 45 min/jour",
                "Effectuer un suivi glycémique tous les 6 mois",
                "Contrôler la tension artérielle régulièrement",
            ],
        }
    
    else:
        return {
            "score": score,
            "risk_level": "high",
            "diagnostic": "Risque élevé de diabète",
            "diagnostic_en": "High diabetes risk",
            "color": "#EF4444",
            "icon": "alert-octagon",
            "recommendation": (
                "Votre profil présente un risque élevé de diabète. Une consultation "
                "médicale urgente est fortement recommandée. Réalisez un bilan complet "
                "incluant : glycémie à jeun, test de tolérance au glucose (HGPO), "
                "HbA1c, et bilan lipidique. Un traitement préventif ou thérapeutique "
                "pourrait être nécessaire. Ne tardez pas à agir."
            ),
            "actions": [
                "Consultation médicale urgente recommandée",
                "Bilan complet : glycémie, HbA1c, HGPO",
                "Adopter un régime alimentaire strict anti-diabète",
                "Activité physique quotidienne obligatoire",
                "Suivi médical mensuel",
                "Évaluation du traitement médicamenteux si nécessaire",
            ],
        }


# ─── Routes API ─────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def index():
    """Route d'accueil — vérification du statut de l'API."""
    return jsonify({
        "status": "online",
        "project": "Système Intelligent de Prédiction du Diabète",
        "version": "1.0.0",
        "model": "ANN (Artificial Neural Network)",
        "endpoints": {
            "predict": "/api/predict  [POST]",
            "health":  "/api/health   [GET]",
        },
    })


@app.route("/api/health", methods=["GET"])
def health_check():
    """Vérification de la santé de l'API et du modèle."""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Route principale de prédiction.
    
    Reçoit les 8 features médicales du patient,
    effectue la prédiction via le modèle ANN,
    et retourne le diagnostic avec recommandations.
    
    Body JSON attendu :
    {
        "Pregnancies": 6,
        "Glucose": 148,
        "BloodPressure": 72,
        "SkinThickness": 35,
        "Insulin": 0,
        "BMI": 33.6,
        "DiabetesPedigreeFunction": 0.627,
        "Age": 50
    }
    """
    try:
        # ── Validation de la requête ──
        if not request.is_json:
            return jsonify({
                "success": False,
                "error": "Le Content-Type doit être application/json",
            }), 400
        
        data = request.get_json()
        
        # ── Validation des champs requis ──
        required_fields = [
            "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
            "Insulin", "BMI", "DiabetesPedigreeFunction", "Age",
        ]
        
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({
                "success": False,
                "error": f"Champs manquants : {', '.join(missing)}",
            }), 400
        
        # ── Validation des valeurs numériques ──
        for field in required_fields:
            try:
                val = float(data[field])
                if val < 0:
                    return jsonify({
                        "success": False,
                        "error": f"La valeur de '{field}' ne peut pas être négative.",
                    }), 400
            except (ValueError, TypeError):
                return jsonify({
                    "success": False,
                    "error": f"La valeur de '{field}' doit être un nombre valide.",
                }), 400
        
        # ── Preprocessing ──
        features_scaled = preprocess_input(data)
        logger.info("📊  Données patient reçues et normalisées")
        
        # ── Prédiction ──
        prediction = model.predict(features_scaled, verbose=0)
        probability = float(prediction[0][0])
        logger.info("🔮  Probabilité de diabète : %.4f", probability)
        
        # ── Decision Layer ──
        result = decision_layer(probability)
        
        # ── Construction de la réponse ──
        response = {
            "success": True,
            "prediction": {
                "probability": round(probability, 4),
                **result,
            },
            "input_data": {k: float(data[k]) for k in required_fields},
            "model_info": {
                "type": "Artificial Neural Network (ANN)",
                "framework": "TensorFlow / Keras",
                "preprocessing": "StandardScaler",
            },
        }
        
        logger.info("✅  Prédiction envoyée — Risque : %s (%.2f%%)",
                     result["risk_level"].upper(), result["score"])
        
        return jsonify(response), 200
    
    except Exception as e:
        logger.exception("❌  Erreur lors de la prédiction")
        return jsonify({
            "success": False,
            "error": f"Erreur interne du serveur : {str(e)}",
        }), 500


# ─── Error Handlers ─────────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Route non trouvée. Utilisez /api/predict [POST] ou /api/health [GET].",
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "success": False,
        "error": "Méthode HTTP non autorisée pour cette route.",
    }), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": "Erreur interne du serveur. Veuillez réessayer.",
    }), 500


# ─── Démarrage ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    
    logger.info("🚀  Démarrage du serveur Flask sur le port %d", port)
    logger.info("   ➜ Mode debug : %s", debug)
    logger.info("   ➜ URL : http://localhost:%d", port)
    
    app.run(host="0.0.0.0", port=port, debug=debug)
