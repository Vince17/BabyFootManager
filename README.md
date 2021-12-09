# Projet BabyFoot Manager
## Description du projet
BabyFoot Manager est une application web de type RIA permettant de créer des parties de babyfoot. Sa particularité sera de pouvoir créer des parties de manière collaborative.
### Fonctionnalités
Le système de gestion des parties comprend la liste des fonctionnalités suivantes :
- [x] Pouvoir créer une partie
- [x] Pouvoir supprimer une partie
- [ ] Pouvoir terminer une partie
- [x] Dans la liste, différencier des autres les parties terminées
- [ ] Avoir un compteur des parties non terminées
- [ ] À chaque modification, création ou suppression, il doit y avoir propagation en temps réel sur les autres clients connectés
- [x] Avoir un tchat intégré

### Architecture
 - server.js
 - .env
	 - views
		 - partry.ejs
		 - chat.ejs
		 - index.ejs
	 - public
		 - css
			 - style.css
		 - js
			 - chat.js

### PostgresSQL
CREATE DATABASE dbbfm ;
CREATE TABLE babyfootparty (id SERIAL PRIMARY KEY NOT NULL, party TEXT, done BOOLEAN DEFAULT false);

**Technologies utilisées:**
- Node.js (16.13.1)
- Javascript (ES6)
- HTML & CSS
- PostgreSQL (14.1)

**Paquets NPM installés**

- pg (8.7.1)
- ejs (3.1.6)
- express (4.17.1)
- dotenv (10.0.0)
- body-parser
- socket .io (4.4.0)
- ent (2.2.0)

## Installation
**Nécessaire d'installer Node.js et PostgreSQL**

git clone https://github.com/Vince17/BabyFootManager.git
npm install
npm start

Mot de passe et utilisateur par défaut PostgreSQL : **postgresql**
Le serveur se lance sur le port 3000 ([http://localhost:3000](http://localhost:3000))

Vous pouvez modifier toutes les variables environnements depuis le fichier **.env**

## Utilisation

![Légende d'utilisation de BabyFootManager](https://raw.githubusercontent.com/Vince17/wc-smapshot-pictures/main/utilisation_bfm.png)