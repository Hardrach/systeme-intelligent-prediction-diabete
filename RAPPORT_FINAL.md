# Rapport de Projet — Soutenance Académique

<div align="center">
  <h2>Système Intelligent de Prédiction du Diabète</h2>
  <p>Une approche combinant Science des Données, Intelligence Artificielle Avancée et Ingénierie Full-Stack</p>
</div>

<br/>

**Réalisé par :** Yassine Rachid  
**Filière :** Génie Informatique  
**Année universitaire :** 2025/2026  
**Modules concernés :** Science des Données & Intelligence Artificielle Avancée  

---

## 📑 Table des Matières
1. [Introduction Générale](#1-introduction-générale)
2. [Contexte et Problématique](#2-contexte-et-problématique)
3. [Chapitre 1 : Science des Données et Méthodologie](#3-chapitre-1--science-des-données-et-méthodologie)
4. [Chapitre 2 : Modélisation et Intelligence Artificielle (ANN)](#4-chapitre-2--modélisation-et-intelligence-artificielle-ann)
5. [Chapitre 3 : Architecture Logicielle et Développement Web](#5-chapitre-3--architecture-logicielle-et-développement-web)
6. [Bilan et Analyse des Résultats](#6-bilan-et-analyse-des-résultats)
7. [Conclusion et Perspectives](#7-conclusion-et-perspectives)

---

## 1. Introduction Générale
L'intelligence artificielle (IA) et la science des données transforment profondément de nombreux secteurs, dont celui de la santé. La capacité d'analyser de vastes volumes de données médicales permet aujourd'hui de développer des systèmes d'aide au diagnostic clinique particulièrement précis. Ce projet s'inscrit dans cette dynamique en proposant une solution technologique de bout en bout destinée à la prédiction précoce du diabète.

Ce rapport détaille la conception et la réalisation de notre **Système Intelligent de Prédiction du Diabète**, depuis le nettoyage rigoureux des données jusqu'à son déploiement sous la forme d'une application web interactive.

## 2. Contexte et Problématique
Le diabète est une pathologie chronique affectant des millions de personnes. Une détection tardive engendre des complications sévères. L'objectif principal de notre système est de répondre à la problématique suivante :
> *Comment exploiter les données biométriques d'un patient pour fournir, en temps réel, une estimation fiable de son risque de développer le diabète, tout en traduisant cette donnée statistique en recommandation médicale compréhensible ?*

Pour y répondre, le projet a été structuré autour de trois axes :
- L'analyse et la préparation d'un jeu de données cliniques.
- La conception d'un modèle d'apprentissage profond (Deep Learning).
- La mise en place d'une architecture applicative (Backend/Frontend).

---

## 3. Chapitre 1 : Science des Données et Méthodologie

### 3.1. Description du Dataset
Nous avons exploité le dataset public *Pima Indians Diabetes*, reconnu dans la communauté scientifique pour ce type d'étude. Il rassemble 768 observations et 9 variables biométriques (Grossesses, Glucose, Pression artérielle, Épaisseur de la peau, Insuline, IMC, Fonction généalogique du diabète, Âge) ainsi que la variable cible `Outcome` (0 = Sain, 1 = Diabétique).

### 3.2. Analyse Exploratoire (EDA)
L'analyse exploratoire a révélé une distribution déséquilibrée de la variable cible, ainsi que de fortes corrélations entre certaines caractéristiques (notamment entre le Glucose, l'IMC et le Diabète). 

### 3.3. Nettoyage des Données (Data Cleaning)
Une étape critique a été l'identification des "faux zéros". Des variables telles que la pression artérielle ou l'IMC ne peuvent physiologiquement pas être égales à zéro. Nous avons imputé ces valeurs manquantes déguisées en les remplaçant par la médiane de leurs distributions respectives afin de ne pas fausser l'apprentissage du modèle.

### 3.4. Prétraitement (Preprocessing)
Pour garantir la stabilité de notre modèle, nous avons appliqué un `StandardScaler`. Les réseaux de neurones étant sensibles à l'échelle des données, cette normalisation assure que chaque paramètre clinique a un poids équitable lors du calcul des gradients.

---

## 4. Chapitre 2 : Modélisation et Intelligence Artificielle (ANN)

### 4.1. Architecture du Réseau de Neurones
Contrairement aux algorithmes de machine learning traditionnels (Random Forest, SVM), nous avons opté pour un Réseau de Neurones Artificiels (ANN) multicouche via **TensorFlow/Keras**, particulièrement adapté à la détection de patterns non linéaires complexes dans des données médicales.

- **Couches Cachées :** Deux couches denses successives (32 puis 16 neurones) utilisant la fonction d'activation `ReLU` (Rectified Linear Unit) pour éviter le problème de disparition du gradient.
- **Couche de Sortie :** Un neurone unique avec une fonction d'activation `Sigmoid`, délivrant une probabilité continue entre 0 et 1.

### 4.2. Entraînement et Optimisation
Le modèle a été compilé avec l'optimiseur `Adam` et une fonction de perte `Binary Crossentropy`. L'entraînement sur 10 époques (avec un split de validation de 20%) a démontré une courbe de convergence saine, minimisant la perte tout en augmentant la précision globale.

### 4.3. Couche de Décision Métier (Decision Layer)
Une probabilité mathématique n'a de sens que si elle est interprétable. Nous avons donc implémenté une couche algorithmique traduisant le score prédictif en niveaux d'alerte clinique :
- **Risque Faible (< 40%) :** Mesures préventives classiques.
- **Risque Moyen (40% - 70%) :** Consultation médicale recommandée.
- **Risque Élevé (> 70%) :** Urgence clinique et prise en charge immédiate.

---

## 5. Chapitre 3 : Architecture Logicielle et Développement Web

Pour rendre le modèle accessible, nous l'avons encapsulé dans une architecture web moderne.

### 5.1. Backend : API REST (Flask)
Développé en Python, le backend charge le modèle pré-entraîné `diabetes_model.h5`. Lors d'une requête `POST`, l'API applique le même `StandardScaler` qu'à l'entraînement, interroge le modèle, puis retourne la probabilité accompagnée de la décision métier via JSON.

### 5.2. Frontend : Application React (Vite)
L'interface utilisateur a été développée avec React. Conçue autour d'un design professionnel "Medical Dark Theme" avec un effet de *Glassmorphism*, elle assure une expérience utilisateur (UX) fluide. Les données sont validées en temps réel avant d'être envoyées au backend via `Axios`.

---

## 6. Bilan et Analyse des Résultats

### 6.1. Performances Techniques
Notre modèle a atteint une précision moyenne variant entre **75% et 82%** sur l'ensemble de test. La matrice de confusion indique une bonne capacité à identifier les vrais positifs (vrais malades) tout en minimisant les faux négatifs, ce qui est crucial dans un contexte médical.

### 6.2. Atouts du Système
- **Interopérabilité :** Séparation propre entre l'IA (Python/Flask) et l'IHM (React), permettant d'évoluer indépendamment.
- **Extensibilité :** Possibilité d'intégrer facilement d'autres pathologies (hypertension, maladies cardiaques) en rajoutant de nouveaux modèles Keras au backend.

---

## 7. Conclusion et Perspectives

Ce projet illustre parfaitement l'alliance entre la Science des Données et l'ingénierie logicielle. Nous avons réussi à transformer des données brutes en un système prédictif intelligent, fiable et utilisable par un utilisateur final. 

**Perspectives d'amélioration :**
1. **Amélioration IA :** Enrichir le dataset et implémenter des techniques d'Oversampling (SMOTE) pour corriger le léger déséquilibre des classes et viser les 90% de précision.
2. **Fonctionnalités Web :** Ajout d'une base de données (MongoDB) pour historiser les prédictions des patients et suivre leur évolution dans le temps.
3. **Sécurité :** Mise en place d'une authentification (JWT) pour garantir la confidentialité des données médicales.