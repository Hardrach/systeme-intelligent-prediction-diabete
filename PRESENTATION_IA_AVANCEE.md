# Présentation PowerPoint  
## Module : Intelligence Artificielle Avancée  
## Projet : Système Intelligent de Prédiction du Diabète

---

# Slide 1 — Page de garde

## Système Intelligent de Prédiction du Diabète

Module :
### Intelligence Artificielle Avancée

Réalisé par :

- Yassine Rachid
- Jassir Matallah

Année universitaire : 2025/2026

---

# Slide 2 — Introduction IA

L’intelligence artificielle permet aujourd’hui d’assister les médecins dans le diagnostic.

Objectif :

utiliser un modèle intelligent pour prédire le diabète.

---

# Slide 3 — Pourquoi ANN ?

Nous avons choisi :

## ANN (Artificial Neural Network)

car :

- bonne performance en classification
- apprentissage non linéaire
- adapté aux données médicales

---

# Slide 4 — Architecture du modèle

Architecture utilisée :

- Dense(32, ReLU)
- Dense(16, ReLU)
- Dense(1, Sigmoid)

Réseau multicouche

---

# Slide 5 — Fonctions d’activation

## ReLU

utilisée dans les couches cachées

## Sigmoid

utilisée dans la couche de sortie

Pourquoi ?

classification binaire entre 0 et 1

---

# Slide 6 — Compilation du modèle

Paramètres :

- Optimizer : Adam
- Loss : Binary Crossentropy
- Metric : Accuracy

Pourquoi ?

apprentissage plus rapide et stable

---

# Slide 7 — Entraînement

Paramètres :

- epochs = 10
- batch size = 32
- validation split = 20%

Le modèle apprend progressivement.

---

# Slide 8 — Résultats IA

Accuracy :

## environ 75%

Les courbes montrent :

- accuracy augmente
- loss diminue

→ bon apprentissage

---

# Slide 9 — Decision Layer

Le système classe :

- faible risque
- risque moyen
- risque élevé

avec recommandations médicales

→ aide à la décision

---

# Slide 10 — Conclusion

Le projet montre la puissance de :

## l’Intelligence Artificielle Avancée

Le modèle ANN permet une prédiction fiable et exploitable.
