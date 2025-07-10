# Spécifications - Simulateur de Portefeuille Boursier

## Vue d'ensemble

Ce projet est un simulateur de portefeuille boursier utilisant les données de la bourse de New York. Il permet aux utilisateurs de gérer leurs investissements et de calculer leur rendement personnel.

## Fonctionnalités principales

### 1. Gestion des transactions
- **Saisie manuelle** : Formulaire permettant d'entrer les transactions de titres
- **Importation** : Possibilité d'importer des transactions depuis un fichier
- **Types de transactions** : Achat, vente, dividendes

### 2. Calcul de rendement
- **Calcul XIRR** : Calcul du taux de rendement interne (XIRR) du portefeuille
- **Analyse historique** : Possibilité de calculer le rendement à un moment donné dans le passé
- **Analyse actuelle** : Calcul du rendement au moment présent

### 3. Source de données
- **Bourse de New York** : Utilisation des données NYSE pour les prix des titres
- **Mise à jour en temps réel** : Données actualisées pour les calculs

## Exigences techniques

### Données
- Stockage des transactions (date, titre, quantité, prix)
- Historique des prix des titres
- Calculs financiers (XIRR)

### Interface utilisateur
- Formulaire de saisie des transactions
- Interface d'importation de fichiers
- Affichage des résultats de rendement
- Visualisation du portefeuille

### Calculs financiers
- Implémentation de l'algorithme XIRR
- Gestion des dates et périodes
- Calculs de performance sur différentes périodes

## Cas d'usage

1. **Saisie d'une transaction**
   - L'utilisateur sélectionne un titre
   - Renseigne la quantité, le prix et la date
   - Valide la transaction

2. **Importation de transactions**
   - L'utilisateur sélectionne un fichier
   - Le système parse et valide les données
   - Les transactions sont ajoutées au portefeuille

3. **Calcul de rendement**
   - L'utilisateur sélectionne une période d'analyse
   - Le système calcule le XIRR
   - Les résultats sont affichés avec des détails

## Contraintes

- Données limitées aux titres de la bourse de New York
- Calculs basés sur les prix historiques disponibles
- Précision des calculs XIRR selon les données disponibles