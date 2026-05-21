import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileHeart,
  Send,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Heart,
  Droplets,
  Gauge,
  Baby,
  Ruler,
  Dna,
  Clock,
  Syringe,
  Loader2,
  ArrowRight,
  Activity,
  Info,
} from "lucide-react";
import { predictDiabetes } from "../../services/predictionService";
import "./Predict.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" },
  }),
};

const formFields = [
  {
    name: "Pregnancies",
    label: "Grossesses",
    icon: Baby,
    placeholder: "Ex: 3",
    hint: "Nombre de grossesses",
    min: 0,
    max: 20,
    step: 1,
  },
  {
    name: "Glucose",
    label: "Glucose",
    icon: Droplets,
    placeholder: "Ex: 120",
    hint: "Concentration de glucose (mg/dL)",
    min: 0,
    max: 300,
    step: 1,
  },
  {
    name: "BloodPressure",
    label: "Pression artérielle",
    icon: Heart,
    placeholder: "Ex: 72",
    hint: "Pression diastolique (mm Hg)",
    min: 0,
    max: 200,
    step: 1,
  },
  {
    name: "SkinThickness",
    label: "Épaisseur de la peau",
    icon: Ruler,
    placeholder: "Ex: 25",
    hint: "Épaisseur du pli cutané (mm)",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    name: "Insulin",
    label: "Insuline",
    icon: Syringe,
    placeholder: "Ex: 80",
    hint: "Insuline sérique 2h (mu U/ml)",
    min: 0,
    max: 900,
    step: 1,
  },
  {
    name: "BMI",
    label: "IMC (BMI)",
    icon: Gauge,
    placeholder: "Ex: 28.5",
    hint: "Indice de masse corporelle (kg/m²)",
    min: 0,
    max: 80,
    step: 0.1,
  },
  {
    name: "DiabetesPedigreeFunction",
    label: "Fonction Pedigree",
    icon: Dna,
    placeholder: "Ex: 0.627",
    hint: "Score d'hérédité diabétique",
    min: 0,
    max: 3,
    step: 0.001,
  },
  {
    name: "Age",
    label: "Âge",
    icon: Clock,
    placeholder: "Ex: 45",
    hint: "Âge du patient (années)",
    min: 1,
    max: 120,
    step: 1,
  },
];

const initialFormData = Object.fromEntries(
  formFields.map((f) => [f.name, ""])
);

export default function Predict() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      const val = formData[field.name];
      if (val === "" || val === undefined || val === null) {
        newErrors[field.name] = "Ce champ est requis";
      } else {
        const num = parseFloat(val);
        if (isNaN(num)) {
          newErrors[field.name] = "Valeur numérique attendue";
        } else if (num < field.min) {
          newErrors[field.name] = `Minimum: ${field.min}`;
        } else if (num > field.max) {
          newErrors[field.name] = `Maximum: ${field.max}`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
      );
      const response = await predictDiabetes(payload);
      setResult(response);
    } catch (err) {
      setApiError(err.message || "Erreur lors de la prédiction.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setResult(null);
    setApiError(null);
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case "low": return ShieldCheck;
      case "medium": return AlertTriangle;
      case "high": return ShieldAlert;
      default: return AlertCircle;
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case "low": return "Faible";
      case "medium": return "Moyen";
      case "high": return "Élevé";
      default: return level;
    }
  };

  return (
    <div className="predict-page page">
      <div className="container">
        {/* Header */}
        <motion.div
          className="predict-header"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="section-tag">
            <FileHeart size={14} />
            Module de Prédiction
          </div>
          <h1>
            Analyse du Risque de{" "}
            <span className="gradient-text">Diabète</span>
          </h1>
          <p>
            Renseignez les données médicales du patient ci-dessous. Le modèle
            ANN analysera les 8 indicateurs cliniques pour produire une
            prédiction fiable.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            /* ═══ Form ═══ */
            <motion.form
              key="form"
              className="predict-form"
              onSubmit={handleSubmit}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              variants={fadeUp}
            >
              <div className="predict-form-grid">
                {formFields.map((field, i) => (
                  <motion.div
                    key={field.name}
                    className={`form-group ${
                      errors[field.name] ? "form-group-error" : ""
                    }`}
                    variants={fadeUp}
                    custom={i}
                  >
                    <label className="form-label" htmlFor={field.name}>
                      <field.icon size={14} />
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="number"
                      className="form-input"
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                    />
                    {errors[field.name] ? (
                      <span className="form-error">
                        <AlertCircle size={12} />
                        {errors[field.name]}
                      </span>
                    ) : (
                      <span className="form-hint">{field.hint}</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* API Error */}
              {apiError && (
                <motion.div
                  className="predict-api-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AlertCircle size={18} />
                  <div>
                    <strong>Erreur de connexion</strong>
                    <p>{apiError}</p>
                  </div>
                </motion.div>
              )}

              <div className="predict-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  id="btn-predict"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Lancer la Prédiction
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleReset}
                  id="btn-reset"
                >
                  <RotateCcw size={16} />
                  Réinitialiser
                </button>
              </div>

              {/* Info Box */}
              <div className="predict-info glass-card">
                <Info size={18} className="predict-info-icon" />
                <p>
                  Les données sont envoyées de manière sécurisée à notre API de
                  prédiction propulsée par un réseau de neurones artificiels
                  (ANN) entraîné sur le dataset Pima Indians Diabetes.
                </p>
              </div>
            </motion.form>
          ) : (
            /* ═══ Results ═══ */
            <motion.div
              key="results"
              className="predict-results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ResultCard result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultCard({ result, onReset }) {
  // Support both new flat format and legacy nested format
  const pred = result.prediction_details || result.prediction || {};
  const predictionLabel = typeof result.prediction === "string"
    ? result.prediction
    : (pred.probability > 0.5 ? "Diabetic" : "Non-Diabetic");
  const confidence = result.confidence ?? pred.score ?? 0;
  const riskText = result.risk ?? pred.risk ?? "";
  const recommendation = result.recommendation ?? pred.recommendation ?? "";
  const riskLevel = pred.risk_level || (
    riskText.toLowerCase().includes("low") ? "low" :
    riskText.toLowerCase().includes("medium") ? "medium" : "high"
  );
  const riskColor = pred.color || (
    riskLevel === "low" ? "#10B981" :
    riskLevel === "medium" ? "#F59E0B" : "#EF4444"
  );
  const probability = pred.probability ?? (confidence / 100);
  const score = pred.score ?? confidence;

  const RiskIcon = (() => {
    switch (riskLevel) {
      case "low": return ShieldCheck;
      case "medium": return AlertTriangle;
      case "high": return ShieldAlert;
      default: return AlertCircle;
    }
  })();

  const riskClass = `risk-${riskLevel}`;

  return (
    <div className="result-container">
      {/* Score Card */}
      <motion.div
        className={`result-score-card glass-card ${riskClass}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
      >
        <div className="result-score-header">
          <span className={`badge badge-${riskLevel}`}>
            <RiskIcon size={14} />
            {riskText || (riskLevel === "low" ? "Low Risk" : riskLevel === "medium" ? "Medium Risk" : "High Risk")}
          </span>
          <span className="result-model-tag">
            <Activity size={12} />
            ANN Prediction
          </span>
        </div>

        <div className="result-score-circle">
          <svg viewBox="0 0 120 120" className="result-score-svg">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={riskColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - probability)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 54 * (1 - probability),
              }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="result-score-value">
            <motion.span
              className="result-score-number"
              style={{ color: riskColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}
            </motion.span>
            <span className="result-score-percent">%</span>
          </div>
        </div>

        <h2 className="result-diagnostic" style={{ color: riskColor }}>
          {predictionLabel === "Diabetic" ? "Diabétique" : "Non-Diabétique"} — Confiance {confidence}%
        </h2>
      </motion.div>

      {/* Recommendation */}
      <motion.div
        className="result-recommendation glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3>
          <CheckCircle2 size={20} style={{ color: riskColor }} />
          Recommandation Médicale
        </h3>
        <p className="result-recommendation-text">{recommendation}</p>

        {pred.actions && (
          <div className="result-actions-list">
            <h4>Actions recommandées :</h4>
            <ul>
              {pred.actions.map((action, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <CheckCircle2 size={14} style={{ color: riskColor }} />
                  {action}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Patient Data Summary */}
      {result.input_data && (
        <motion.div
          className="result-summary glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>
            <FileHeart size={20} />
            Données Patient Analysées
          </h3>
          <div className="result-data-grid">
            {Object.entries(result.input_data).map(([key, value]) => (
              <div key={key} className="result-data-item">
                <span className="result-data-label">{key}</span>
                <span className="result-data-value">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Model Info */}
      {result.model_info && (
        <motion.div
          className="result-model-info glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>
            <Activity size={20} />
            Informations du Modèle
          </h3>
          <div className="result-model-grid">
            <div className="result-model-item">
              <span className="result-model-label">Type</span>
              <span className="result-model-value">{result.model_info.type}</span>
            </div>
            <div className="result-model-item">
              <span className="result-model-label">Framework</span>
              <span className="result-model-value">{result.model_info.framework}</span>
            </div>
            <div className="result-model-item">
              <span className="result-model-label">Preprocessing</span>
              <span className="result-model-value">{result.model_info.preprocessing}</span>
            </div>
            <div className="result-model-item">
              <span className="result-model-label">Probabilité brute</span>
              <span className="result-model-value">{probability}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Back Button */}
      <motion.div
        className="result-back"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <button
          className="btn btn-primary btn-lg"
          onClick={onReset}
          id="btn-new-prediction"
        >
          <RotateCcw size={18} />
          Nouvelle Prédiction
        </button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        className="result-disclaimer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <AlertCircle size={14} />
        <p>
          Ce résultat est généré par un modèle d'intelligence artificielle à
          titre informatif. Il ne constitue pas un diagnostic médical. Veuillez
          consulter un professionnel de santé.
        </p>
      </motion.div>
    </div>
  );
}

