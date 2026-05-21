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
import pickle
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd

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

# ─── Chemins des fichiers ──────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "diabetes_model.keras")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

# Chemins des données (cherche d'abord ../data/, sinon ../notebook/)
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
if not os.path.isdir(DATA_DIR):
    DATA_DIR = os.path.join(BASE_DIR, "..", "notebook")

CLEANED_CSV = os.path.join(DATA_DIR, "diabetes_cleaned.csv")
HISTORY_CSV = os.path.join(DATA_DIR, "training_history.csv")
SCRAPED_CSV = os.path.join(DATA_DIR, "scraped_data.csv")

# ─── Chargement du modèle ANN ──────────────────────────────────────────────────
model = None
scaler = None

# Cache global pour les statistiques calculées depuis les modèles au démarrage
dashboard_stats = {}


def load_keras_model():
    """Charge le modèle Keras sauvegardé (.keras) au démarrage."""
    global model
    if keras_load_model is None:
        logger.warning("TensorFlow n'est pas installé. Le modèle ne sera pas chargé.")
        return
    try:
        model = keras_load_model(MODEL_PATH)
        logger.info("✅  Modèle ANN chargé avec succès depuis %s", MODEL_PATH)
    except Exception as e:
        logger.error("❌  Échec du chargement du modèle : %s", str(e))


def load_scaler():
    """Charge le StandardScaler sauvegardé (scaler.pkl) au démarrage."""
    global scaler
    try:
        with open(SCALER_PATH, "rb") as f:
            scaler = pickle.load(f)
        logger.info("✅  Scaler chargé avec succès depuis %s", SCALER_PATH)
    except Exception as e:
        logger.error("❌  Échec du chargement du scaler : %s", str(e))


def compute_dashboard_stats():
    """Calcule et met en cache les statistiques du dashboard au démarrage depuis les modèles et fichiers."""
    global dashboard_stats
    logger.info("📊  Récupération des statistiques du dashboard au démarrage...")
    try:
        if not os.path.exists(CLEANED_CSV):
            logger.error("❌  %s introuvable pour le calcul initial", CLEANED_CSV)
            return

        df = pd.read_csv(CLEANED_CSV)
        total_patients = len(df)
        diabetic = int(df["Outcome"].sum())
        non_diabetic = total_patients - diabetic

        # Récupération des performances (Train & Test/Validation Accuracy) depuis l'historique d'entraînement du modèle
        train_accuracy = 88.39
        test_accuracy = 72.7  # Valeur de test historique par défaut
        
        if os.path.exists(HISTORY_CSV):
            hist_df = pd.read_csv(HISTORY_CSV)
            # Récupérer l'exacte accuracy d'entraînement finale
            if "accuracy" in hist_df.columns:
                train_accuracy = round(float(hist_df["accuracy"].iloc[-1]) * 100, 2)
            # Récupérer la validation accuracy finale comme métrique de test historique du modèle
            if "val_accuracy" in hist_df.columns:
                test_accuracy = round(float(hist_df["val_accuracy"].iloc[-1]) * 100, 1)

        dashboard_stats = {
            "total_patients": total_patients,
            "diabetic": diabetic,
            "non_diabetic": non_diabetic,
            "train_accuracy": train_accuracy,
            "test_accuracy": test_accuracy,
            "ann_accuracy": test_accuracy,
        }
        logger.info("📊  Statistiques du dashboard chargées avec succès : %s", str(dashboard_stats))
    except Exception as e:
        logger.exception("❌ Échec du chargement des statistiques du dashboard au démarrage")


# Lancement du chargement et du calcul au démarrage
load_keras_model()
load_scaler()
compute_dashboard_stats()

# ─── Feature order (must match notebook training) ─────────────────────────────
FEATURE_ORDER = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age",
]


def preprocess_input(data: dict) -> np.ndarray:
    """
    Transforme les données patient brutes en array normalisé
    prêt pour la prédiction par le modèle ANN.

    Utilise le scaler.pkl chargé depuis le notebook (même que l'entraînement).
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

    # Normalisation identique au notebook via scaler.transform()
    features_scaled = scaler.transform(features)
    return features_scaled


# ─── Decision Layer — Système de recommandation ────────────────────────────────

def decision_layer(probability: float) -> dict:
    """
    Couche de décision intelligente :
    Convertit la probabilité brute du modèle en diagnostic clinique
    et recommandation médicale adaptée.

    Seuils (conformes au notebook) :
        • < 0.3   → Faible risque  (Low Risk)
        • 0.3–0.7 → Risque moyen   (Medium Risk)
        • ≥ 0.7   → Risque élevé   (High Risk)
    """
    score = round(float(probability) * 100, 2)

    if probability < 0.3:
        return {
            "score": score,
            "risk_level": "low",
            "risk": "Low Risk",
            "diagnostic": "Faible risque de diabète",
            "diagnostic_en": "Low diabetes risk",
            "color": "#10B981",
            "icon": "shield-check",
            "recommendation": (
                "Low diabetes risk detected. Maintain a healthy lifestyle with "
                "balanced nutrition, regular physical activity (30 min/day), "
                "and annual glucose monitoring. Stay vigilant if family history exists."
            ),
            "actions": [
                "Maintenir une alimentation équilibrée",
                "Pratiquer 30 minutes d'activité physique par jour",
                "Contrôle annuel de la glycémie",
                "Surveiller le poids corporel",
            ],
        }

    elif probability < 0.7:
        return {
            "score": score,
            "risk_level": "medium",
            "risk": "Medium Risk",
            "diagnostic": "Risque moyen de diabète",
            "diagnostic_en": "Moderate diabetes risk",
            "color": "#F59E0B",
            "icon": "alert-triangle",
            "recommendation": (
                "Moderate diabetes risk detected. Medical consultation recommended. "
                "Consider a complete glycemic assessment (fasting glucose, HbA1c). "
                "Reduce refined sugars, increase physical activity, and schedule "
                "follow-up every 6 months."
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
            "risk": "High Risk",
            "diagnostic": "Risque élevé de diabète",
            "diagnostic_en": "High diabetes risk",
            "color": "#EF4444",
            "icon": "alert-octagon",
            "recommendation": (
                "High diabetes risk detected. Medical consultation recommended. "
                "A complete assessment including fasting glucose, glucose tolerance "
                "test (OGTT), HbA1c, and lipid profile is strongly advised. "
                "Preventive or therapeutic treatment may be necessary."
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
        "version": "2.0.0",
        "model": "ANN (Artificial Neural Network)",
        "endpoints": {
            "predict": "/api/predict  [POST]",
            "health": "/api/health   [GET]",
            "dashboard": "/api/dashboard [GET]",
            "scraped": "/api/scraped   [GET]",
        },
    })


@app.route("/api/health", methods=["GET"])
def health_check():
    """Vérification de la santé de l'API et du modèle."""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
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
        "Pregnancies": 2,
        "Glucose": 120,
        "BloodPressure": 80,
        "SkinThickness": 20,
        "Insulin": 70,
        "BMI": 28,
        "DiabetesPedigreeFunction": 0.5,
        "Age": 35
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
        missing = [f for f in FEATURE_ORDER if f not in data]
        if missing:
            return jsonify({
                "success": False,
                "error": f"Champs manquants : {', '.join(missing)}",
            }), 400

        # ── Validation des valeurs numériques ──
        for field in FEATURE_ORDER:
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

        # ── Vérification du modèle et du scaler ──
        if model is None:
            return jsonify({
                "success": False,
                "error": "Le modèle ANN n'est pas chargé.",
            }), 503

        if scaler is None:
            return jsonify({
                "success": False,
                "error": "Le scaler n'est pas chargé.",
            }), 503

        # ── Preprocessing via scaler.transform() ──
        features_scaled = preprocess_input(data)
        logger.info("📊  Données patient reçues et normalisées")

        # ── Prédiction ──
        raw_prediction = model.predict(features_scaled, verbose=0)
        probability = float(raw_prediction[0][0])
        logger.info("🔮  Probabilité de diabète : %.4f", probability)

        # ── Decision Layer ──
        result = decision_layer(probability)

        # ── Prediction label (>0.5 = Diabetic) ──
        prediction_label = "Diabetic" if probability > 0.5 else "Non-Diabetic"
        confidence = round(probability * 100, 1) if probability > 0.5 else round((1 - probability) * 100, 1)

        # ── Construction de la réponse ──
        # Format compatible avec le spec ET l'existant
        response = {
            "success": True,
            # ── Flat fields (spec format) ──
            "prediction": prediction_label,
            "confidence": confidence,
            "risk": result["risk"],
            "recommendation": result["recommendation"],
            # ── Nested fields (existing frontend compat) ──
            "prediction_details": {
                "probability": round(probability, 4),
                **result,
            },
            "input_data": {k: float(data[k]) for k in FEATURE_ORDER},
            "model_info": {
                "type": "Artificial Neural Network (ANN)",
                "framework": "TensorFlow / Keras",
                "preprocessing": "StandardScaler",
            },
        }

        logger.info("✅  Prédiction envoyée — %s (Confiance: %.1f%%, Risque: %s)",
                     prediction_label, confidence, result["risk"])

        return jsonify(response), 200

    except Exception as e:
        logger.exception("❌  Erreur lors de la prédiction")
        return jsonify({
            "success": False,
            "error": f"Erreur interne du serveur : {str(e)}",
        }), 500


@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    """
    Retourne les données agrégées pour le tableau de bord :
    - Statistiques patients (total, diabétiques, non-diabétiques)
    - Précision du modèle ANN
    - Distribution des outcomes
    - Données histogramme glucose
    - Matrice de corrélation
    - Historique d'entraînement (accuracy & loss)
    """
    try:
        # ── Charger diabetes_cleaned.csv ──
        if not os.path.exists(CLEANED_CSV):
            return jsonify({"success": False, "error": "diabetes_cleaned.csv introuvable"}), 404

        df = pd.read_csv(CLEANED_CSV)

        # ── Stats générales ──
        total_patients = len(df)
        diabetic = int(df["Outcome"].sum())
        non_diabetic = total_patients - diabetic

        # ── Distribution outcome ──
        outcome_distribution = [
            {"name": "Non-Diabétique", "value": non_diabetic, "color": "#10B981"},
            {"name": "Diabétique", "value": diabetic, "color": "#EF4444"},
        ]

        # ── Histogramme glucose ──
        glucose_vals = df["Glucose"].dropna()
        hist_counts, hist_edges = np.histogram(glucose_vals, bins=15)
        glucose_histogram = []
        for i in range(len(hist_counts)):
            glucose_histogram.append({
                "range": f"{int(hist_edges[i])}-{int(hist_edges[i+1])}",
                "count": int(hist_counts[i]),
            })

        # ── Matrice de corrélation ──
        feature_cols = ["Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
                        "Insulin", "BMI", "DiabetesPedigreeFunction", "Age", "Outcome"]
        corr_matrix = df[feature_cols].corr().round(3)
        correlation = {
            "columns": feature_cols,
            "data": corr_matrix.values.tolist(),
        }

        # ── Historique d'entraînement (Train Accuracy & Loss) ──
        train_accuracy = None
        training_history = {"accuracy": [], "loss": [], "val_accuracy": [], "val_loss": []}
        if os.path.exists(HISTORY_CSV):
            hist_df = pd.read_csv(HISTORY_CSV)
            training_history = {
                "accuracy": hist_df["accuracy"].tolist(),
                "loss": hist_df["loss"].tolist(),
                "val_accuracy": hist_df["val_accuracy"].tolist(),
                "val_loss": hist_df["val_loss"].tolist(),
            }
            # Dernière accuracy d'entraînement (dynamique)
            train_accuracy = round(float(hist_df["accuracy"].iloc[-1]) * 100, 2)

        # ── Récupérer les stats pré-calculées depuis les modèles au démarrage ──
        test_accuracy = dashboard_stats.get("test_accuracy", 72.7)
        total_patients = dashboard_stats.get("total_patients", total_patients)
        diabetic = dashboard_stats.get("diabetic", diabetic)
        non_diabetic = dashboard_stats.get("non_diabetic", non_diabetic)
        train_acc_cached = dashboard_stats.get("train_accuracy", train_accuracy)

        return jsonify({
            "success": True,
            "stats": {
                "total_patients": total_patients,
                "diabetic": diabetic,
                "non_diabetic": non_diabetic,
                "train_accuracy": train_acc_cached if train_acc_cached is not None else 88.39,
                "test_accuracy": test_accuracy,
                "ann_accuracy": test_accuracy,  # la vraie accuracy (~72.7% ou 74.8% dynamique) pour le frontend
            },
            "outcome_distribution": outcome_distribution,
            "glucose_histogram": glucose_histogram,
            "correlation": correlation,
            "training_history": training_history,
        }), 200

    except Exception as e:
        logger.exception("❌  Erreur dashboard")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/scraped", methods=["GET"])
def scraped_data():
    """Retourne les données collectées par web scraping."""
    try:
        if not os.path.exists(SCRAPED_CSV):
            return jsonify({"success": False, "error": "scraped_data.csv introuvable"}), 404

        df = pd.read_csv(SCRAPED_CSV)
        items = df["Health_Information"].tolist()

        return jsonify({
            "success": True,
            "source": "https://www.diabetes.org/healthy-living",
            "data": items,
        }), 200

    except Exception as e:
        logger.exception("❌  Erreur scraped data")
        return jsonify({"success": False, "error": str(e)}), 500


# ─── Error Handlers ─────────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Route non trouvée. Consultez / pour la liste des endpoints.",
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
