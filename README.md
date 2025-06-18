
Hey!

I- Introduction :

Ce projet consiste en une application Vue.js 3 utilisant l'API SpaceX pour afficher les lancements de fusées. L'application permet de visualiser le prochain lancement, filtrer et regarder les lancements (clickez) passés et consulter les détails de chaque mission.

II- Difficultés Rencontrées et Solutions :

Problèmes d'Installation avec WSL Problème : Configuration initiale difficile avec Vite et WSL, avec des erreurs de chemin et de dépendances. Solution : Réinstallation propre de Node.js dans WSL et utilisation de PNPM pour gérer les dépendances. Configuration manuelle de Tailwind CSS.

Filtrage des Lancements Problème : Difficulté à implémenter correctement le filtre pour les lancements à venir. Solution : Révision de la logique de filtrage dans la propriété calculée filteredLaunches en différenciant clairement les lancements passés (avec succès/échec) et les lancements à venir.

Countdown en Temps Réel Problème : Création d'un compte à rebours précis qui se met à jour chaque seconde. Solution : Implémentation d'un composant dédié utilisant setInterval pour mettre à jour le temps restant, avec nettoyage propre lors de la destruction du composant.

Mise en Page Grid Problème : Affichage incohérent des cartes dans une grille responsive. J'ai initialement considéré l'utilisation d'un élèment mère et child element prédéfini Solution : Utilisation de CSS Grid avec grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) combinée à des media queries pour différents breakpoints.

Récupération des Données Supplémentaires Problème : Chargement efficace des données de launchpad et payloads pour les modals. Solution : Implémentation d'un système de chargement à la demande avec mise en cache des résultats pour éviter les appels API répétitifs.

Intégration YouTube Problème : Extraction de l'ID YouTube à partir des URLs variables. Solution : Création d'une expression régulière robuste pour extraire l'ID quelle que soit la forme de l'URL.

III- Guide de Déploiement Cloner le dépôt : git clone https://github.com/DiahBenamor/SpaceX-API-Front-End-VueJs.git

Installer les dépendances : pnpm install (ou npm install)

Démarrer le serveur de développement : pnpm dev / npm run dev

Pour la production : pnpm build (les fichiers seront dans dist/)

IV- Structure des Fichiers

text src/ ├── assets/ ├── components/ │ ├── LaunchCard.vue │ └── Countdown.vue ├── views/ │ └── Home.vue ├── App.vue └── main.ts

V- Conclusion

Ce projet a permis de démontrer une maîtrise de Vue.js 3 avec TypeScript et une capacité à intégrer une API externe complexe. Les défis techniques ont été résolus par une combinaison de recherche documentaire et d'expérimentation. L'application répond à toutes les exigences fonctionnelles tout en offrant une interface utilisateur intuitive et esthétique.

VI- Ressources Utilisées Documentation SpaceX API : https://github.com/r-spacex/SpaceX-API

Vue.js 3 Composition API : https://vuejs.org/

Tailwind CSS : https://tailwindcss.com/

Fait avec ❤️ par Benamor Dhia le 14/06/2025. Git Pulssh final le 17/06/2025.