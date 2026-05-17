import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  Activity,
  Zap,
  FileHeart,
  ArrowRight,
  Database,
  Cpu,
  BarChart3,
  Layers,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import "./Home.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: Brain,
    title: "Réseau de Neurones",
    desc: "Modèle ANN profond entraîné sur des données cliniques réelles pour des prédictions fiables.",
    color: "#6366F1",
  },
  {
    icon: Shield,
    title: "Decision Layer",
    desc: "Couche décisionnelle intelligente avec 3 niveaux de risque et recommandations personnalisées.",
    color: "#06B6D4",
  },
  {
    icon: Zap,
    title: "Prédiction Instantanée",
    desc: "Résultats en temps réel grâce à une API haute performance et un traitement optimisé.",
    color: "#F59E0B",
  },
  {
    icon: BarChart3,
    title: "Data Science",
    desc: "Pipeline complet : collecte, nettoyage, EDA, visualisation, et feature engineering.",
    color: "#10B981",
  },
];

const pipeline = [
  { icon: Database, label: "Data Collection", sub: "Dataset Pima Indians" },
  { icon: Sparkles, label: "Data Cleaning", sub: "Faux zéros, outliers, NaN" },
  { icon: BarChart3, label: "EDA", sub: "Analyse exploratoire" },
  { icon: Layers, label: "Preprocessing", sub: "StandardScaler" },
  { icon: Cpu, label: "ANN Model", sub: "TensorFlow / Keras" },
  { icon: TrendingUp, label: "Prediction", sub: "Risque de diabète" },
  { icon: CheckCircle2, label: "Decision Layer", sub: "Recommandation" },
];

const stats = [
  { value: "8", label: "Features médicales" },
  { value: "768", label: "Échantillons" },
  { value: "3", label: "Niveaux de risque" },
  { value: "ANN", label: "Architecture IA" },
];

export default function Home() {
  return (
    <div className="home-page page">
      {/* ═══ Hero ═══ */}
      <section className="hero container">
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.div className="section-tag" variants={fadeUp} custom={0}>
            <Activity size={14} />
            Projet Universitaire — Data Science & IA Avancée
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeUp} custom={1}>
            Système Intelligent de
            <br />
            <span className="gradient-text">Prédiction du Diabète</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp} custom={2}>
            Application web propulsée par un réseau de neurones artificiels (ANN)
            pour analyser les données médicales d'un patient et prédire le risque
            de diabète avec une recommandation médicale adaptée.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeUp} custom={3}>
            <Link to="/predict" className="btn btn-primary btn-lg" id="hero-cta-predict">
              <FileHeart size={20} />
              Lancer une Prédiction
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg" id="hero-cta-about">
              En savoir plus
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div className="hero-stats" variants={fadeUp} custom={4}>
            {stats.map((s, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-value gradient-text">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="hero-visual-card glass-card">
            <div className="hero-visual-header">
              <div className="hero-visual-dot" style={{ background: "#EF4444" }} />
              <div className="hero-visual-dot" style={{ background: "#F59E0B" }} />
              <div className="hero-visual-dot" style={{ background: "#10B981" }} />
              <span>analyse_patient.py</span>
            </div>
            <div className="hero-visual-code">
              <code>
                <span className="code-keyword">import</span>{" "}
                <span className="code-module">tensorflow</span> as tf
                <br />
                <span className="code-keyword">from</span>{" "}
                <span className="code-module">keras.models</span>{" "}
                <span className="code-keyword">import</span> load_model
                <br />
                <br />
                <span className="code-comment"># Charger le modèle ANN</span>
                <br />
                model = load_model(
                <span className="code-string">"diabetes_model.h5"</span>)
                <br />
                <br />
                <span className="code-comment"># Prédiction</span>
                <br />
                risk = model.predict(patient_data)
                <br />
                <span className="code-keyword">print</span>(
                <span className="code-string">f"Risque: </span>
                <span className="code-accent">{"{risk:.2%}"}</span>
                <span className="code-string">"</span>)
              </code>
            </div>
            <div className="hero-visual-output">
              <span className="code-output">→ Risque: 73.45%</span>
              <span className="badge badge-high" style={{ fontSize: "0.7rem" }}>
                RISQUE ÉLEVÉ
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ Features ═══ */}
      <section className="features container">
        <motion.div
          className="features-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <div className="section-tag">
            <Sparkles size={14} />
            Fonctionnalités
          </div>
          <h2>
            Un projet complet,{" "}
            <span className="gradient-text">de A à Z</span>
          </h2>
          <p>
            Ce système combine la puissance du Data Science et de
            l'Intelligence Artificielle avancée pour offrir une prédiction
            médicale fiable.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card glass-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={i}
            >
              <div
                className="feature-icon"
                style={{
                  background: `${f.color}15`,
                  color: f.color,
                  boxShadow: `0 0 30px ${f.color}15`,
                }}
              >
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ Pipeline ═══ */}
      <section className="pipeline container">
        <motion.div
          className="pipeline-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <div className="section-tag">
            <Layers size={14} />
            Pipeline
          </div>
          <h2>
            Architecture du{" "}
            <span className="gradient-text">Pipeline Data</span>
          </h2>
          <p>
            De la collecte des données brutes à la recommandation médicale finale.
          </p>
        </motion.div>

        <div className="pipeline-steps">
          {pipeline.map((step, i) => (
            <motion.div
              key={i}
              className="pipeline-step"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <div className="pipeline-step-icon">
                <step.icon size={20} />
              </div>
              <div className="pipeline-step-content">
                <span className="pipeline-step-num">0{i + 1}</span>
                <h4>{step.label}</h4>
                <p>{step.sub}</p>
              </div>
              {i < pipeline.length - 1 && (
                <div className="pipeline-step-connector" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA Final ═══ */}
      <section className="cta-section container">
        <motion.div
          className="cta-card glass-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="cta-glow" />
          <h2>
            Prêt à tester le{" "}
            <span className="gradient-text">système ?</span>
          </h2>
          <p>
            Entrez les données médicales d'un patient et obtenez une
            prédiction instantanée du risque de diabète avec une
            recommandation personnalisée.
          </p>
          <Link to="/predict" className="btn btn-primary btn-lg" id="cta-bottom-predict">
            <FileHeart size={20} />
            Commencer l'analyse
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
