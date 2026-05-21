# Rapport de Projet  
## Système Intelligent de Prédiction du Diabète

---

## Réalisé par

Nom : Yassine Rachid  
Filière : Génie Informatique  
Modules :
- Science des Données
- Intelligence Artificielle Avancée

Année universitaire : 2025/2026

---

# Introduction

Le diabète est une maladie chronique qui touche un grand nombre de personnes dans le monde. Une détection précoce permet de réduire les risques de complications médicales graves.

L’objectif de ce projet est de développer un système intelligent capable de prédire le risque de diabète à partir de données médicales d’un patient, puis de fournir une recommandation adaptée selon le niveau de risque détecté.

Ce projet répond aux besoins de deux modules :
- Science des Données
- Intelligence Artificielle Avancée

Il combine :
- préparation des données
- analyse exploratoire
- modélisation intelligente
- prédiction automatique
- aide à la décision médicale

---

# Objectifs du projet

Les objectifs principaux sont :

- analyser les données médicales des patients
- nettoyer et préparer les données
- entraîner un modèle intelligent de prédiction
- évaluer les performances du modèle
- proposer une décision médicale adaptée
- préparer l’intégration future dans une application web

---

# Présentation du Dataset

Le dataset utilisé est :

## Pima Indians Diabetes Dataset

Il contient des informations médicales de plusieurs patientes ainsi qu’une variable cible indiquant la présence ou non du diabète.

### Variables principales

- Pregnancies
- Glucose
- BloodPressure
- SkinThickness
- Insulin
- BMI
- DiabetesPedigreeFunction
- Age
- Outcome

### Variable cible

Outcome :
- 0 = patient non diabétique
- 1 = patient diabétique

---

# Méthodologie

Le projet suit les étapes classiques de la Science des Données :

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

---

# Étape 1 — Importation des bibliothèques

Les bibliothques utilisées sont :

- pandas
- numpy
- matplotlib
- seaborn
- scikit-learn
- tensorflow keras

Elles permettent :
- la manipulation des données
- la visualisation
- le prétraitement
- l’évaluation
- la création du modèle ANN

---

# Étape 2 — Importation du dataset

Le fichier diabetes.csv a été importé dans Google Colab afin de commencer l’analyse des données.

---

# Étape 3 — Compréhension des données

Nous avons analysé :

- la taille du dataset
- les types des colonnes
- les statistiques descriptives
- les valeurs manquantes

Le dataset contient :

768 lignes  
9 colonnes

Aucune valeur manquante classique n’a été détectée.

---

# Étape 4 — Data Cleaning

Certaines colonnes contenaient des faux zéros :

- Glucose
- BloodPressure
- SkinThickness
- Insulin
- BMI

Ces valeurs sont médicalement impossibles.

Nous avons remplacé ces zéros par la médiane de chaque colonne.

Nous avons également vérifié les doublons.

Résultat :

Aucun doublon détecté.

---

# Étape 5 — Analyse exploratoire (EDA)

Plusieurs visualisations ont été réalisées :

## Countplot de Outcome

Permet de visualiser la répartition entre patients diabétiques et non diabétiques.

## Histogramme de Glucose

Permet d’observer la distribution du taux de glucose.

## Heatmap de corrélation

Permet d’analyser les relations entre les variables.

## Boxplot BMI

Permet de détecter les valeurs extrêmes.

---

# Étape 6 — Préparation des données

Nous avons séparé :

- X : variables explicatives
- y : variable cible

Puis nous avons appliqué :

## Train/Test Split

80% entraînement  
20% test

## StandardScaler

Pour normaliser les données et améliorer les performances du modèle.

---

# Étape 7 — Création du modèle ANN

Nous avons utilisé un réseau de neurones artificiels (ANN).

Architecture :

- Dense(32, ReLU)
- Dense(16, ReLU)
- Dense(1, Sigmoid)

Compilation :

- Optimizer : Adam
- Loss : Binary Crossentropy
- Metric : Accuracy

---

# Étape 8 — Entraînement du modèle

Le modèle a été entraîné avec :

- epochs = 10
- batch_size = 32
- validation_split = 0.2

Le modèle apprend progressivement les patterns présents dans les données.

---

# Étape 9 — Prédiction

Le modèle génère une probabilité entre :

0 et 1

Puis cette probabilité est transformée en :

- 0 = non diabétique
- 1 = diabétique

---

# Étape 10 — Évaluation

Nous avons utilisé :

- Classification Report
- Confusion Matrix
- Accuracy Score

## Résultat obtenu

Accuracy ≈ 75%

Cela montre que le modèle possède des performances satisfaisantes pour ce type de problème médical.

---

# Étape 11 — Decision Layer

Nous avons ajouté une couche métier :

### Risque faible

Suivi normal

### Risque moyen

Consultation recommandée

### Risque élevé

Consultation urgente

Cette étape transforme la prédiction en aide réelle à la décision médicale.

---

# Étape 12 — Graphiques Accuracy / Loss

Les courbes montrent :

- augmentation progressive de l’accuracy
- diminution progressive de la loss

Cela confirme que le modèle apprend correctement sans surapprentissage important.

---

# Étape 13 — Sauvegarde du modèle

Le modèle a été sauvegardé avec :

model.save("diabetes_model.h5")

Ce fichier sera utilisé dans le backend Flask pour l’application web finale.

---

# Résultats

Le projet a permis de :

- construire un système intelligent fiable
- prédire le risque de diabète
- fournir une aide à la décision médicale
- préparer l’intégration dans une application web moderne

---

# Conclusion

Ce projet montre l’importance de la Science des Données et de l’Intelligence Artificielle dans le domaine médical.

Grâce à l’utilisation du Deep Learning, il devient possible d’assister les professionnels de santé dans la détection précoce de maladies chroniques comme le diabète.

Ce travail pourra être amélioré par :

- l’ajout d’un frontend React
- le déploiement Flask + Render
- l’hébergement frontend sur Vercel
- l’amélioration des performances du modèle

Ce projet constitue une base solide pour une application médicale intelligente complète.

---