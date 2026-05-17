import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Home,
  FileHeart,
  Info,
  Menu,
  X,
} from "lucide-react";
import "./Navbar.css";

const navLinks = [
  { path: "/", label: "Accueil", icon: Home },
  { path: "/predict", label: "Prédiction", icon: FileHeart },
  { path: "/about", label: "À propos", icon: Info },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav
      className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Activity size={22} />
          </div>
          <span className="navbar-logo-text">
            Diabet<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`navbar-link ${
                location.pathname === path ? "navbar-link-active" : ""
              }`}
            >
              <Icon size={16} />
              {label}
              {location.pathname === path && (
                <motion.div
                  className="navbar-link-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link to="/predict" className="navbar-cta btn btn-primary">
          <FileHeart size={16} />
          Analyser
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`navbar-mobile-link ${
                  location.pathname === path ? "navbar-mobile-link-active" : ""
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <Link to="/predict" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
              <FileHeart size={16} />
              Analyser maintenant
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
