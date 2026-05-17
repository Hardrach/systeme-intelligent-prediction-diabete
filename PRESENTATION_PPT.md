# 🎯 Présentation de Soutenance (Slide par Slide)

*Voici la structure complète de votre présentation PowerPoint. Pour chaque slide, vous trouverez le contenu visuel ainsi que le "Discours" (ce que vous devez dire à l'oral).*

---

## Slide 1 : Titre
**Visuel :**
- Titre : Système Intelligent de Prédiction du Diabète
- Sous-titre : Approche combinée en Data Science, IA et Ingénierie Web
- Présenté par : Yassine Rachid
- Modules : Science des Données & IA Avancée

**🗣️ Discours (Notes du présentateur) :**
> "Bonjour à tous et merci d'être présents. Je vais vous présenter mon projet de fin de module portant sur la conception et le développement d'un Système Intelligent de Prédiction du Diabète. L'objectif de ce travail est de faire le pont entre la recherche en intelligence artificielle et une application pratique utilisable dans le domaine médical."

---

## Slide 2 : Le Contexte & La Problématique
**Visuel :**
- Le Diabète : un enjeu de santé publique majeur.
- Le Problème : Le diagnostic tardif aggrave les complications cliniques.
- La Solution proposée : Utiliser les données biométriques pour anticiper le risque grâce à l'IA.

**🗣️ Discours :**
> "Le diabète est l'une des maladies chroniques les plus répandues. Le défi majeur est que le diagnostic intervient souvent trop tard. Notre problématique était donc de trouver comment analyser efficacement les données cliniques d'un patient pour prévenir la maladie avant son apparition. La réponse que j'apporte aujourd'hui repose sur le Machine Learning."

---

## Slide 3 : La Méthodologie Scientifique
**Visuel :**
- Schéma du pipeline Data Science :
  `Collecte ➜ Nettoyage ➜ Exploration (EDA) ➜ Modélisation ➜ Évaluation`

**🗣️ Discours :**
> "Pour aborder ce problème, j'ai suivi une méthodologie stricte de Data Science. Cela commence par l'acquisition du Dataset 'Pima Indians', reconnu mondialement. Ensuite, j'ai nettoyé ces données, je les ai analysées visuellement, avant d'entraîner et d'évaluer notre modèle de Deep Learning."

---

## Slide 4 : Analyse et Nettoyage des Données
**Visuel :**
- Problème : Présence de valeurs impossibles (Pression artérielle = 0, IMC = 0).
- Solution : Imputation statistique (Remplacement par la médiane).
- Préparation : Normalisation avec `StandardScaler`.

**🗣️ Discours :**
> "Lors de l'analyse, j'ai repéré des anomalies critiques : certains patients avaient une tension ou un IMC à zéro, ce qui est biologiquement impossible. Au lieu de supprimer ces données précieuses, je les ai remplacées par la médiane. Enfin, j'ai normalisé toutes les données pour que le réseau de neurones apprenne de manière équilibrée."

---

## Slide 5 : L'Intelligence Artificielle (Modèle ANN)
**Visuel :**
- Architecture du Réseau de Neurones :
  - Input Layer : 8 variables médicales
  - Couches Cachées : 32 neurones (ReLU) ➜ 16 neurones (ReLU)
  - Output Layer : 1 neurone (Sigmoid)

**🗣️ Discours :**
> "Au cœur du projet se trouve un Réseau de Neurones Artificiels créé avec TensorFlow/Keras. L'architecture est composée de deux couches cachées utilisant la fonction d'activation ReLU pour une meilleure convergence, et d'une couche de sortie avec une fonction Sigmoïde, qui nous donne un pourcentage précis de risque allant de 0 à 100%."

---

## Slide 6 : Couche de Décision Métier (L'Innovation)
**Visuel :**
- Probabilité ➜ Recommandation Clinique
- 🟢 Risque Faible : Prévention classique
- 🟡 Risque Moyen : Consultation suggérée
- 🔴 Risque Élevé : Urgence médicale

**🗣️ Discours :**
> "C'est l'un des points forts du projet : une probabilité pure n'est pas très utile pour un patient. J'ai donc développé une 'Decision Layer', une couche logique qui intercepte le résultat de l'IA et le traduit en un diagnostic clair, accompagné de recommandations médicales spécifiques en fonction du niveau de risque."

---

## Slide 7 : L'Architecture Web Full-Stack
**Visuel :**
- Frontend : React.js (Vite), Interface Moderne, Glassmorphism
- Backend : Python (Flask), API REST, Modèle .h5 embarqué
- Communication : Requêtes JSON via API.

**🗣️ Discours :**
> "Un modèle d'IA seul n'est pas suffisant. J'ai donc conçu une architecture moderne pour le rendre accessible. D'un côté, une API backend robuste développée en Python Flask qui héberge le modèle Keras. De l'autre, une interface web premium développée en React, offrant une expérience utilisateur fluide et immédiate."

---

## Slide 8 : Démonstration de l'Application
**Visuel :**
- *Insérer des captures d'écran de l'application React (Formulaire et Résultat).*
- Lien de la démo en ligne.

**🗣️ Discours :**
> "(Pendant cette slide, vous montrez les captures d'écran ou faites une démonstration live). Comme vous pouvez le voir, l'utilisateur entre ses paramètres médicaux. En un clic, la donnée est envoyée au backend, normalisée, analysée par l'ANN, et le résultat est affiché instantanément avec une jauge visuelle de risque."

---

## Slide 9 : Bilan & Conclusion
**Visuel :**
- Réussite technique : Modèle performant (75-80% Accuracy).
- Application fonctionnelle et déployable.
- Perspectives : Amélioration du dataset (SMOTE), ajout d'une base de données.

**🗣️ Discours :**
> "Pour conclure, ce projet prouve la viabilité de l'IA dans l'assistance au diagnostic. Techniquement, le modèle offre une excellente précision et l'application est totalement fonctionnelle en local ou en production. À l'avenir, j'envisage d'utiliser des techniques comme SMOTE pour améliorer encore la précision, et d'ajouter une base de données pour le suivi des patients. Merci pour votre attention, je suis à votre disposition pour vos questions."