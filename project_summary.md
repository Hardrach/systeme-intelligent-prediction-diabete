# 🧠 DiabetAI — Projet Complet Livré

## ✅ Résumé de ce qui a été créé

### PARTIE 1 — Backend Flask (Prêt pour Render)

| Fichier | Description |
|---------|-------------|
| `backend/app.py` | API Flask complète avec routes `/api/predict`, `/api/health`, decision layer 3 niveaux |
| `backend/requirements.txt` | Dépendances Python (Flask, TensorFlow-CPU, Gunicorn) |
| `backend/Procfile` | Configuration Gunicorn pour Render |
| `backend/runtime.txt` | Python 3.11.9 |
| `backend/render.yaml` | Blueprint Render pour déploiement automatique |
| `backend/diabetes_model.h5` | Modèle ANN (existant) |

### PARTIE 2 — Frontend React (Prêt pour Vercel)

| Page | Description |
|------|-------------|
| **Home** (`/`) | Hero section, features, pipeline data, stats, CTA |
| **Predict** (`/predict`) | Formulaire 8 champs validé, loading, résultats avec jauge circulaire animée |
| **About** (`/about`) | Contexte académique, modules, architecture, tech stack, dataset |

| Composant | Description |
|-----------|-------------|
| `Navbar` | Glassmorphism, responsive, mobile menu, route active indicator |
| `Footer` | Branding, navigation, technologies, disclaimer médical |

### PARTIE 3 — Déploiement

| Fichier | Description |
|---------|-------------|
| `frontend/vercel.json` | Config SPA routing pour Vercel |
| `frontend/.env` | URL API locale |
| `frontend/.env.production` | URL API production (à configurer) |
| `README.md` | Documentation complète avec architecture, API reference, guide déploiement |

---

## 🚀 Guide de Déploiement Rapide

### Étape 1 — Pousser sur GitHub

```bash
cd "d:\DataScience & IA Avancee\application\Projet"
git init
git add .
git commit -m "🧠 DiabetAI — Système Intelligent de Prédiction du Diabète"
git remote add origin https://github.com/VOTRE_USERNAME/diabetai.git
git push -u origin main
```

### Étape 2 — Déployer le Backend sur Render

1. Aller sur [render.com](https://render.com) → **New** → **Web Service**
2. Connecter votre repo GitHub
3. Configurer :
   - **Name** : `diabetes-prediction-api`
   - **Root Directory** : `backend`
   - **Runtime** : Python 3
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120`
   - **Plan** : Free
4. Cliquer **Create Web Service**
5. **Copier l'URL** (ex: `https://diabetes-prediction-api-xxxx.onrender.com`)

### Étape 3 — Déployer le Frontend sur Vercel

1. Aller sur [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Importer votre repo GitHub
3. Configurer :
   - **Root Directory** : `frontend`
   - **Framework Preset** : Vite
   - **Environment Variables** :
     - `VITE_API_URL` = `https://diabetes-prediction-api-xxxx.onrender.com` *(votre URL Render)*
4. Cliquer **Deploy**

### Étape 4 — Vérification

- Ouvrir l'URL Vercel
- Aller sur `/predict`
- Remplir le formulaire et cliquer **Lancer la Prédiction**

> [!IMPORTANT]
> Le premier appel au backend Render (plan Free) peut prendre **30-60 secondes** car le serveur se réveille (cold start). Les appels suivants seront rapides.

---

## ⚠️ Action Requise — Valeurs du Scaler

> [!WARNING]
> Les valeurs de `SCALER_MEAN` et `SCALER_SCALE` dans `backend/app.py` sont des estimations.
> Pour des prédictions précises, vous devez exporter les valeurs exactes depuis votre notebook :
>
> ```python
> print("MEAN:", scaler.mean_)
> print("SCALE:", scaler.scale_)
> ```
>
> Puis remplacer les valeurs dans `app.py` lignes 54-57.

---

## 📸 Aperçu de l'application

````carousel
![Home Page — Pipeline Section](file:///C:/Users/yassi/.gemini/antigravity/brain/d62426bd-494a-4660-aadb-b6bcfea4563f/home_page_1779015804539.png)
<!-- slide -->
![Predict Page — Formulaire Patient](file:///C:/Users/yassi/.gemini/antigravity/brain/d62426bd-494a-4660-aadb-b6bcfea4563f/predict_page_1779015811736.png)
<!-- slide -->
![About Page — Contexte Académique](file:///C:/Users/yassi/.gemini/antigravity/brain/d62426bd-494a-4660-aadb-b6bcfea4563f/about_page_1779015820287.png)
````

---

## 📁 Structure Finale

```
Projet/
├── backend/
│   ├── app.py                    ← API Flask + Decision Layer
│   ├── diabetes_model.h5         ← Modèle ANN
│   ├── requirements.txt          ← Dépendances Python
│   ├── Procfile                  ← Gunicorn config
│   ├── runtime.txt               ← Python 3.11.9
│   ├── render.yaml               ← Blueprint Render
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/           ← Navbar, Footer
│   │   ├── pages/                ← Home, Predict, About
│   │   ├── config/api.js         ← Config API
│   │   ├── services/             ← Prediction service
│   │   ├── App.jsx               ← Router + Layout
│   │   ├── main.jsx              ← Entry point
│   │   └── index.css             ← Design system
│   ├── vercel.json               ← Vercel SPA config
│   ├── .env / .env.production    ← API URLs
│   └── package.json
├── notebook/                     ← Jupyter Notebook
├── .gitignore
└── README.md                     ← Documentation complète
```
