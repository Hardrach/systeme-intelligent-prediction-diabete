# Présentation PowerPoint  
## Système Intelligent de Prédiction du Diabète

---

# Slide 1 — Page de garde

## Système Intelligent de Prédiction du Diabète

Projet réalisé dans le cadre des modules :

- Science des Données
- Intelligence Artificielle Avancée

Réalisé par :

Yassine Rachid

Année universitaire : 2025/2026

---

# Slide 2 — Introduction

Le diabète est une maladie chronique très répandue.

Une détection précoce permet :

- de réduire les complications
- d’améliorer le suivi médical
- d’aider à la prise de décision

Objectif :

Créer un système intelligent de prédiction du diabète.

---

# Slide 3 — Objectifs du projet

- analyser les données médicales
- nettoyer les données
- entraîner un modèle intelligent
- prédire le risque de diabète
- fournir une recommandation médicale
- préparer l’intégration web

---

# Slide 4 — Dataset utilisé

## Pima Indians Diabetes Dataset

Contient :

- 768 lignes
- 9 colonnes

Variable cible :

## Outcome

- 0 → non diabétique
- 1 → diabétique

---

# Slide 5 — Variables utilisées

- Pregnancies
- Glucose
- BloodPressure
- SkinThickness
- Insulin
- BMI
- DiabetesPedigreeFunction
- Age

Ces variables permettent de prédire la présence du diabète.

---

# Slide 6 — Méthodologie

Data  
↓  
Clean  
↓  
Understand  
↓  
Model  
↓  
Predict  
↓  
Decide

Méthode complète de Science des Données.

---

# Slide 7 — Data Cleaning

Détection des faux zéros :

- Glucose
- BMI
- Insulin
- BloodPressure

Solution :

remplacement par la médiane

Résultat :

dataset propre et exploitable

---

# Slide 8 — Visualisation (EDA)

Visualisations réalisées :

- Countplot Outcome
- Histogramme Glucose
- Heatmap Corrélation
- Boxplot BMI

Objectif :

mieux comprendre les données

---

# Slide 9 — Préparation des données

- séparation X / y
- Train/Test Split
- StandardScaler

Pourquoi ?

Pour préparer les données avant l’apprentissage du modèle.

---

# Slide 10 — Modèle ANN

Architecture :

- Dense(32, ReLU)
- Dense(16, ReLU)
- Dense(1, Sigmoid)

Compilation :

- Adam
- Binary Crossentropy
- Accuracy

---

# Slide 11 — Entraînement

Paramètres :

- epochs = 10
- batch size = 32
- validation split = 20%

Le modèle apprend progressivement les patterns médicaux.

---

# Slide 12 — Résultats

Accuracy obtenue :

## 75%

Outils d’évaluation :

- Classification Report
- Confusion Matrix
- Accuracy Score

Résultat satisfaisant.

---

# Slide 13 — Decision Layer

3 niveaux de risque :

### Faible

Suivi normal

### Moyen

Consultation recommandée

### Élevé

Consultation urgente

Valeur ajoutée forte du projet.

---

# Slide 14 — Accuracy / Loss

Les courbes montrent :

- accuracy augmente
- loss diminue

Conclusion :

le modèle apprend correctement.

---

# Slide 15 — Conclusion

Le projet permet :

- une prédiction intelligente
- une aide à la décision médicale
- une future intégration web

Améliorations futures :

- Frontend React
- Backend Flask
- Déploiement Vercel + Render

---

# Slide 16 — Merci

## Merci pour votre attention


---