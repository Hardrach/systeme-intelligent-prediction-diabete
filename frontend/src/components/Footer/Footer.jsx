import { Activity } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">
              <Activity size={18} />
            </div>
            <span>
              Diabet<span className="gradient-text">AI</span>
            </span>
          </Link>
          <p className="footer-desc">
            Système Intelligent de Prédiction du Diabète.
            <br />
            Projet universitaire — Data Science & IA Avancée.
          </p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-links-title">Navigation</h4>
          <Link to="/" className="footer-link">Accueil</Link>
          <Link to="/predict" className="footer-link">Prédiction</Link>
          <Link to="/about" className="footer-link">À propos</Link>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-links-title">Technologie</h4>
          <span className="footer-link">TensorFlow / Keras</span>
          <span className="footer-link">Flask API</span>
          <span className="footer-link">React + Vite</span>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} DiabetAI — Projet Universitaire. App développée par{" "}
            <a href="https://github.com/Hardrach" target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'none'}}>Hardrach</a>.
          </p>
          <p className="footer-disclaimer">
            ⚠ Cette application est un projet académique. Elle ne remplace en
            aucun cas un avis médical professionnel.
          </p>
        </div>
      </div>
    </footer>
  );
}
