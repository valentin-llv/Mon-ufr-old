# Programmation

## HML:

Séparaton en plusieurs fichiers qui seront ensuite regroupé en un seul au moment du chagement de l'app.

Pour reduire le temps de chargement initial de l'app, on ne charge que le minimum d'html (sans image) et le minimum de css

## CSS:
 
Utilisation de Tailwind pour le style. Comme pour le html, séparation du code en plusieurs fichiers chacun lié un bloc de html.

Création de classes perso en plus de tailwind, pour les couleurs, les tailles de fonts et certaine marges.

## Javascript:

Utilisation de typescript pour minimiser les bugs. Ajout de petite vue pour une meilleur gestion des éléments du DOM.

Bien séparer le javascript en plusieurs parties et bien crée des classes pour chaques parties.

## Cycle de vie

Ouverture de l'app, l'index html et index css sont chargés. Ils contiennent le minimum de code possible, siffisament pour afficher la page d'accueil avec les animations de chargement. <br />
En cas de premiere connexion un script javascript doit être capable de modifier l'affichage pour afficher l'onboarding.

Une fois le chargement de tout les scripts terminé l'app est entièrement fonctionnelles et les interactions sont initialisées a ce moment. <br />
Début de chargement des données depuis le serveur.

## Mode d'utilisation

L'utilisateur pour installer l'application depuis un navigateur. Il passes d'abord pour le site de présentation qui le redirige ensuite vers la page pour installer l'application. <br />
Sur cette page un petit bouton "utiliser dans le navigateur est disponible".

L'utilisateur peut utiliser l'application directement dans le navigateur. Dans ce cas une pop-up apparaitra pour l'inciter à télécharger l'application.

L'utilisateur peut ouvrir l'application directement depuis la page d'accueil de téléphone, auquel cas l'app fonctionne dans l'envirenoment optimal.

(potentiellement) L'utilisateur peut aussi installer l'app depuis un store et l'utiliser comme une vraie application.