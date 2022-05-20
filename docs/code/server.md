# Informations sur la configuration du serveur

## Arborescence

Le service se découpe en plusieurs parties:
+ page de présentation du service
+ l'application mobile
+ le serveur

La page de présentation sera a la racine du nom de domaine et les autres parties disposeront de leurs propres sous domaine. <br /> <br />

### Exemple d'organisation

"npm du service"/
    |-- site/                  --> "nom du service".com
        |-- inde.html
        |-- css/
            |-- index.css
            ...
        ...
    |-- app/                   --> app."nom du service".com
        |-- app.html
        |-- css/
            |-- app.css
            ...
        ...
    |-- server/                --> server."nom du service".com
        |-- sever.js
        ...
    ...