# 🧠 DiabetAI — Système Intelligent de Prédiction du Diabète

> **Plateforme Full-Stack de Niveau Professionnel pour l'Aide à la Décision Clinique**
> 
> *Conçu et développé dans le cadre des modules académiques :*
> * **Science des Données**
> * **Intelligence Artificielle Avancée**
> 
> **Auteur :** Yassine Rachid (Filière Génie Informatique, 2025/2026)

---

## 📑 Table des Matières
1. [Introduction & Contextualisation](#1-introduction--contextualisation)
2. [Double Objectif Pédagogique & Académique](#2-double-objectif-pédagogique--académique)
3. [Architecture Globale du Système](#3-architecture-globale-du-système)
4. [Pipeline de Science des Données & IA](#4-pipeline-de-science-des-données--ia)
5. [Le Modèle Deep Learning (ANN)](#5-le-modèle-deep-learning-ann)
6. [Système Expert de Décision Clinique (Decision Layer)](#6-système-expert-de-décision-clinique-decision-layer)
7. [Dashboard Analytique Interactif & Web Scraping](#7-dashboard-analytique-interactif--web-scraping)
8. [Module de Test Rapide (Profils Types)](#8-module-de-test-rapide-profils-types)
9. [Documentation Complète de l'API REST](#9-documentation-complète-de-lapi-rest)
10. [Guide d'Installation & Déploiement Local](#10-guide-dinstallation--déploiement-local)
11. [Conclusion & Perspectives](#11-conclusion--perspectives)

---

## 1. Introduction & Contextualisation

Le diabète est l'une des maladies chroniques les plus répandues et les plus invalidantes au monde. Une détection précoce des facteurs de risque physiologiques permet d'éviter des complications cliniques graves (pathologies cardiovasculaires, insuffisance rénale, neuropathies).

**DiabetAI** est une application web intelligente full-stack conçue comme un outil d'aide à la décision pour le dépistage préventif. À partir de 8 constantes biométriques simples et non-invasives, le système estime instantanément le risque qu'a un patient de développer le diabète, génère des recommandations cliniques adaptées et propose un tableau de bord analytique complet des données d'entraînement.

---

## 2. Double Objectif Pédagogique & Académique

Le projet est conçu pour valider de manière pratique deux compétences majeures de la filière Génie Informatique :

### A. Volet Science des Données
* **Nettoyage rigoureux (Data Cleaning)** : Identification et traitement des données physiologiquement impossibles (les faux zéros dans l'insuline, le glucose, etc.) par imputation ciblée.
* **Analyse exploratoire (EDA)** : Détection des corrélations de Pearson, distribution statistique des constantes (Glucose, IMC) et visualisation analytique.
* **Dashboard interactif** : Présentation visuelle et dynamique des statistiques du dataset et des comportements de variables clés pour éclairer les cliniciens.
* **Web Scraping** : Collecte d'informations médicales complémentaires à partir de sites de référence (American Diabetes Association) pour l'éducation des patients.

### B. Volet Intelligence Artificielle Avancée
* **Réseau de Neurones Artificiels (ANN)** : Conception, entraînement et optimisation d'une architecture multi-couches (Deep Learning) sous TensorFlow/Keras.
* **Standardisation mathématique** : Normalisation rigoureuse des entrées par StandardScaler (`scaler.pkl`) exporté depuis le notebook, garantissant l'intégrité de la prédiction en production.
* **Couche décisionnelle clinique** : Traduction de la probabilité mathématique brute (sortie sigmoïdienne 0 à 1) en paliers cliniques de risque (*Faible*, *Moyen*, *Élevé*) assortis de protocoles d'examens médicaux précis.

---

## 3. Architecture Globale du Système

L'application repose sur une architecture full-stack découplée de niveau professionnel :

```mermaid
graph TD
    subgraph Client [Frontend - React 19 / Vite]
        A[Interface Medical Glassmorphism]
        A1[Formulaire de Prédiction avec Test Rapide]
        A2[Dashboard Recharts Interactif]
    end

    subgraph Serveur [Backend - Flask API]
        B[API REST Flask]
        B1[Chargeur de Modèle ANN .keras]
        B2[Chargeur de StandardScaler .pkl]
        B3[Parseur de Données CSV]
    end

    subgraph Moteur IA [Pipeline TensorFlow]
        C[Standardisation StandardScaler]
        D[Réseau de Neurones ANN]
        E[Decision Layer Clinique]
    end

    A1 -->|POST JSON (8 Constantes)| B
    B --> B2 --> C
    C -->|Vecteur standardisé| D
    D -->|Probabilité brute 0-1| E
    E -->|Diagnostic & Recommandations| B
    B -->|Réponse JSON| A1

    A2 -->|GET /api/dashboard| B
    B -->|Lecture diabetes_cleaned.csv / history.csv| B3
    B3 -->|Métriques & Graphiques JSON| A2
```

---

## 4. Pipeline de Science des Données & IA

Le flux de traitement des données suit une méthodologie scientifique rigoureuse documentée dans le notebook de recherche :

### A. Nettoyage et Imputation des Faux Zéros
Dans le dataset *Pima Indians*, plusieurs valeurs manquantes étaient encodées par le chiffre `0`. C'est une aberration physiologique pour des variables comme la glycémie, la pression artérielle, l'épaisseur de la peau, l'insuline et l'IMC.
* **Solution appliquée** : Les valeurs égales à `0` ont été remplacées par la **médiane** des valeurs non-nulles de la classe d'appartenance correspondante (Patient sain vs Patient diabétique) afin de préserver la fidélité clinique du dataset sans distordre les distributions.

### B. Prétraitement et Centrage-Réduction
Afin d'éviter que les caractéristiques possédant de grandes amplitudes (comme l'Insuline) n'étouffent les variables à faible valeur numérique (comme la fonction Pedigree), nous appliquons une standardisation :
$$z = \frac{x - \mu}{\sigma}$$
* Le serveur Flask charge dynamiquement le modèle standard de normalisation `scaler.pkl` ajusté lors de la phase d'entraînement, ce qui élimine tout biais ou décalage de distribution en production.

---

## 5. Le Modèle Deep Learning (ANN)

Le modèle prédictif est un Réseau de Neurones Artificiels (ANN) entraîné sous **TensorFlow / Keras** et sauvegardé au format standard moderne `.keras`.

### A. Architecture du Réseau
* **Couche d'entrée** : 8 neurones (un par variable physiologique du patient).
* **Première couche cachée** : 32 neurones, fonction d'activation **ReLU** (Rectified Linear Unit) pour capter les relations non-linéaires.
* **Deuxième couche cachée** : 16 neurones, fonction d'activation **ReLU**.
* **Couche de sortie** : 1 neurone, fonction d'activation **Sigmoïde** pour condenser le signal en une probabilité de risque continue comprise entre `0` (Sain) et `1` (Diabétique).

### B. Métriques de performance
* **Loss** : Binary Crossentropy (idéale pour la classification binaire).
* **Optimiseur** : Adam (taux d'apprentissage adaptatif).
* **Précision d'entraînement (Accuracy)** : **88.39%** (lue directement depuis l'historique d'apprentissage final).
* **Précision de Test (Validation)** : **74.8%** (obtenue sur des données que le modèle n'a jamais vues lors de l'entraînement).

---

## 6. Système Expert de Décision Clinique (Decision Layer)

Pour dépasser le cadre d'un simple classifieur binaire (0 ou 1), le backend intègre une couche de décision experte clinique qui catégorise la probabilité en 3 niveaux de risque :

| Palier de Probabilité | Niveau de Risque | Diagnostic Clinique | Actions Recommandées |
| :--- | :--- | :--- | :--- |
| **P < 0.3** | **Risque Faible** (Low Risk) | Pas de signe de diabète détecté. | Maintenir une bonne hygiène de vie, alimentation équilibrée, sport (30 min/jour), contrôle annuel de la glycémie. |
| **0.3 ≤ P < 0.7** | **Risque Moyen** (Medium Risk) | Vigilance, risque modéré de diabète. | Consultation médicale, bilan glycémique complet (à jeun, HbA1c), réduction des sucres raffinés, suivi tous les 6 mois. |
| **P ≥ 0.7** | **Risque Élevé** (High Risk) | Alerte critique de risque élevé. | **Consultation médicale urgente conseillée**, bilan complet approfondi (glycémie, HbA1c, test d'effort, HGPO), régime anti-diabète strict. |

---

## 7. Dashboard Analytique Interactif & Web Scraping

Le tableau de bord permet de visualiser en temps réel les données de recherche clinique :

1. **Distribution globale (Pie Chart)** : Affiche le ratio exact de patients Sains (500) vs Diabétiques (268) dans le dataset nettoyé.
2. **Distribution de la Glycémie (Bar Chart)** : Histogramme des tranches de Glucose pour comprendre visuellement la répartition des patients.
3. **Courbes de Performance (Line Charts)** : Représentation dynamique de la perte (*Loss*) et de la précision (*Accuracy*) au fil des époques de l'entraînement pour auditer la qualité d'apprentissage du modèle ANN.
4. **Matrice de corrélation (Heatmap)** : Affichage interactif des corrélations biométriques (ex: lien fort entre l'IMC et l'épaisseur de la peau).
5. **Recommandations scrapées** : Des articles de nutrition et d'exercice physique collectés automatiquement sur les portails de santé pour accompagner le patient.

---

## 8. Module de Test Rapide (Profils Types)

Pour simplifier les présentations académiques et le débogage rapide, la page de prédiction intègre une barre de **chargement de profils en 1 clic** :

* **Bouton Profil Sain (Risque Négatif)** : Pré-remplit automatiquement le formulaire avec un profil idéal (Glucose à 85, IMC à 24.3, Âge 22, etc.). Le modèle ANN génère alors systématiquement un diagnostic de **Risque Faible** (faible probabilité).
* **Bouton Profil Diabétique (Risque Positif)** : Pré-remplit automatiquement le formulaire avec des constantes physiologiques typiques à haut risque (Glucose à 168, IMC à 36.5, Âge 52, etc.). Le modèle ANN produit alors un diagnostic de **Risque Élevé** (forte probabilité).

---

## 9. Documentation Complète de l'API REST

Le backend Flask fournit une API REST structurée et documentée.

### A. Accueil API
* **Route** : `GET /`
* **Description** : Renvoie le statut en ligne et la liste des endpoints disponibles.

### B. Contrôle d'Intégrité (Health Check)
* **Route** : `GET /api/health`
* **Description** : S'assure que le modèle ANN et le scaler sont chargés correctement en mémoire vive.
* **Réponse (200 OK)** :
  ```json
  {
    "status": "healthy",
    "model_loaded": true,
    "scaler_loaded": true,
    "model_path": "D:\\...\\backend\\diabetes_model.keras"
  }
  ```

### C. Moteur de Prédiction
* **Route** : `POST /api/predict`
* **Headers** : `Content-Type: application/json`
* **Payload attendu** :
  ```json
  {
    "Pregnancies": 2,
    "Glucose": 120,
    "BloodPressure": 80,
    "SkinThickness": 20,
    "Insulin": 70,
    "BMI": 28.5,
    "DiabetesPedigreeFunction": 0.627,
    "Age": 35
  }
  ```
* **Réponse structurée (200 OK)** :
  ```json
  {
    "success": true,
    "prediction": "Non-Diabetic",
    "confidence": 64.7,
    "risk": "Medium Risk",
    "recommendation": "Moderate diabetes risk detected. Medical consultation recommended...",
    "prediction_details": {
      "probability": 0.353,
      "score": 35.3,
      "risk_level": "medium",
      "risk": "Medium Risk",
      "diagnostic": "Risque moyen de diabète",
      "color": "#F59E0B",
      "icon": "alert-triangle",
      "recommendation": "...",
      "actions": [ ... ]
    },
    "input_data": { ... },
    "model_info": { ... }
  }
  ```

### D. Analyses Statistiques du Dashboard
* **Route** : `GET /api/dashboard`
* **Description** : Calcule dynamiquement les indicateurs clés du dataset propre et renvoie l'historique d'entraînement ainsi que la matrice de corrélation.

### E. Articles de Santé Scrapés
* **Route** : `GET /api/scraped`
* **Description** : Extrait et renvoie des conseils de santé scrapés pour l'accompagnement des patients.

---

## 10. Guide d'Installation & Déploiement Local

### Prérequis
* **Python 3.11+**
* **Node.js 18+**

### A. Lancement du Serveur Backend (Flask)
1. Ouvrez une console dans le dossier `backend/`.
2. Créez et activez un environnement virtuel :
   ```bash
   python -m venv venv
   # Sur Windows (PowerShell) :
   .\venv\Scripts\activate
   # Sur Mac/Linux :
   source venv/bin/activate
   ```
3. Installez les paquets requis :
   ```bash
   pip install -r requirements.txt
   ```
4. Démarrez l'API :
   ```bash
   python app.py
   ```
   *L'API est maintenant disponible sur `http://localhost:5000`.*

### B. Lancement du Client Frontend (React)
1. Ouvrez une console dans le dossier `frontend/`.
2. Installez les dépendances Node :
   ```bash
   npm install
   ```
3. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```
   *L'application est accessible sur `http://localhost:5173`.*

---

## 11. Conclusion & Perspectives

Le projet **DiabetAI** est une démonstration complète de l'application concrète des sciences cognitives et algorithmiques au secteur de la santé. 

En intégrant un pipeline d'analyse exploratoire rigoureux et un réseau de neurones artificiels (ANN) optimisé à une interface utilisateur moderne et accessible aux praticiens, ce système d'aide au diagnostic préventif est pleinement fonctionnel.

### Pistes d'évolution futures :
* **Apprentissage continu** : Permettre au modèle de se réentraîner à intervalle régulier à mesure que de nouveaux profils cliniques anonymisés sont soumis.
* **Sécurisation des données** : Cryptage de bout en bout des métriques physiologiques transmises.
* **Extension multi-classes** : Classifier le niveau de gravité en plusieurs sous-types de diabète.
