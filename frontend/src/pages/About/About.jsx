import { motion } from "framer-motion";
import {
  Info,
  Brain,
  Database,
  Code2,
  Server,
  Globe,
  Layers,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Cpu,
  BarChart3,
  ArrowRight,
  FileHeart,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./About.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const techStack = [
  {
    category: "Data Science",
    icon: BarChart3,
    color: "#10B981",
    items: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn"],
  },
  {
    category: "Intelligence Artificielle",
    icon: Brain,
    color: "#6366F1",
    items: ["TensorFlow", "Keras", "ANN (Artificial Neural Network)", "StandardScaler", "Decision Layer"],
  },
  {
    category: "Backend",
    icon: Server,
    color: "#F59E0B",
    items: ["Flask", "Flask-CORS", "Gunicorn", "REST API", "Render"],
  },
  {
    category: "Frontend",
    icon: Code2,
    color: "#06B6D4",
    items: ["React", "Vite", "Framer Motion", "Axios", "Vercel"],
  },
];

const modules = [
  {
    icon: Database,
    title: "Module 1 : Science des Données",
    items: [
      "Collecte de données (Pima Indians Diabetes Dataset)",
      "Nettoyage : faux zéros, valeurs manquantes, doublons",
      "Analyse Exploratoire (EDA) avec visualisations",
      "Feature engineering et corrélations",
      "Normalisation avec StandardScaler",
      "Split Train/Test stratifié",
    ],
  },
  {
    icon: Cpu,
    title: "Module 2 : Intelligence Artificielle Avancée",
    items: [
      "Construction du réseau de neurones (ANN)",
      "Architecture multicouche (Dense layers)",
      "Entraînement avec optimiseur Adam",
      "Évaluation : Accuracy, Loss, Confusion Matrix",
      "Sauvegarde du modèle (.keras)",
      "Decision Layer avec 3 niveaux de risque",
    ],
  },
];

export default function About() {
  return (
    <div className="about-page page">
      <div className="container">
        {/* Header */}
        <motion.div
          className="about-header"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="section-tag">
            <Info size={14} />
            À propos du projet
          </div>
          <h1>
            Système Intelligent de{" "}
            <span className="gradient-text">Prédiction du Diabète</span>
          </h1>
          <p>
            Projet universitaire complet réalisé dans le cadre des modules de
            Science des Données et d'Intelligence Artificielle Avancée.
          </p>
        </motion.div>

        {/* Context */}
        <motion.div
          className="about-context glass-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="about-context-icon">
            <GraduationCap size={28} />
          </div>
          <div>
            <h2>Contexte Académique</h2>
            <p>
              Ce projet a été réalisé dans le cadre d'un cursus universitaire
              en <strong>Data Science & Intelligence Artificielle Avancée</strong>.
              L'objectif est de démontrer la maîtrise complète du pipeline de
              science des données — de la collecte des données brutes à la mise
              en production d'un modèle d'IA — en développant une application
              web fonctionnelle capable de prédire le risque de diabète.
            </p>
            <p>
              Le projet couvre deux modules académiques complets et illustre
              l'application concrète de l'apprentissage profond (Deep Learning)
              dans le domaine de la santé.
            </p>
          </div>
        </motion.div>

        {/* Modules */}
        <div className="about-modules">
          {modules.map((mod, i) => (
            <motion.div
              key={i}
              className="about-module glass-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <div className="about-module-header">
                <div className="about-module-icon">
                  <mod.icon size={22} />
                </div>
                <h3>{mod.title}</h3>
              </div>
              <ul>
                {mod.items.map((item, j) => (
                  <li key={j}>
                    <CheckCircle2 size={14} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Architecture */}
        <motion.div
          className="about-architecture"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="section-tag">
            <Layers size={14} />
            Architecture
          </div>
          <h2>
            Architecture{" "}
            <span className="gradient-text">Technique</span>
          </h2>

          <div className="architecture-flow">
            <div className="arch-node arch-node-frontend">
              <Globe size={24} />
              <span>Frontend React</span>
              <small>Vercel</small>
            </div>
            <div className="arch-arrow">
              <ArrowRight size={20} />
              <small>API REST</small>
            </div>
            <div className="arch-node arch-node-backend">
              <Server size={24} />
              <span>Flask API</span>
              <small>Render</small>
            </div>
            <div className="arch-arrow">
              <ArrowRight size={20} />
              <small>Predict</small>
            </div>
            <div className="arch-node arch-node-model">
              <Brain size={24} />
              <span>Modèle ANN</span>
              <small>TensorFlow</small>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className="about-tech"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="section-tag">
            <Code2 size={14} />
            Technologies
          </div>
          <h2>
            Stack{" "}
            <span className="gradient-text">Technologique</span>
          </h2>

          <div className="tech-grid">
            {techStack.map((cat, i) => (
              <motion.div
                key={i}
                className="tech-card glass-card"
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="tech-card-header">
                  <div
                    className="tech-card-icon"
                    style={{ background: `${cat.color}15`, color: cat.color }}
                  >
                    <cat.icon size={20} />
                  </div>
                  <h3>{cat.category}</h3>
                </div>
                <div className="tech-tags">
                  {cat.items.map((item, j) => (
                    <span key={j} className="tech-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dataset */}
        <motion.div
          className="about-dataset glass-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="about-dataset-header">
            <BookOpen size={24} />
            <h3>Dataset : Pima Indians Diabetes</h3>
          </div>
          <p>
            Le modèle est entraîné sur le célèbre dataset{" "}
            <strong>Pima Indians Diabetes Database</strong>, originaire du
            National Institute of Diabetes and Digestive and Kidney Diseases.
            Il contient 768 échantillons avec 8 features médicales permettant
            de prédire l'apparition du diabète de type 2.
          </p>
          <div className="dataset-features">
            {[
              "Pregnancies",
              "Glucose",
              "BloodPressure",
              "SkinThickness",
              "Insulin",
              "BMI",
              "DiabetesPedigreeFunction",
              "Age",
            ].map((f) => (
              <span key={f} className="tech-tag">{f}</span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="about-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Link to="/predict" className="btn btn-primary btn-lg">
            <FileHeart size={20} />
            Tester le système
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
