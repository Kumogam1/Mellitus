# W31 - Programmation web côté serveur

Ce dépôt constitue le point de départ de votre dépôt de travail pour le module.
Des ressources nécessaires à la réalisation des TPs y seront ajoutées au fur et à mesure.

## Comment utiliser ce dépôt ?

### 1. Créer un fork sur Gitlab

**Forkez** ce dépôt en cliquant sur le bouton "Fork".
Vous créez ainsi une copie qui vous appartient et dans laquelle vous ajouterez vos réalisations.

Ajoutez votre enseignant de TP en tant que "Reporter" de votre dépôt (menu "Settings" => "Members").

### 2. Cloner votre fork sur votre ordinateur

#### a. Prérequis

En premier lieu, assurez-vous que git est correctement installé sur votre machine de travail.
Si ce n'est pas encore fait, configurez les informations de l'utilisateur utilisé pour signer les commits :
```sh
git config --global user.name "[Prenom] [Nom]"
git config --global user.email "[username]@unistra.fr"
```

#### b. Clonage

Vous pouvez maintenant **cloner** votre dépôt sur votre ordinateur :
```sh
git clone git@git.unistra.fr:[username]/W31.git
```
Vous vous retrouvez alors avec un dossier W31 qui contient une copie locale de votre dépôt dans laquelle vous allez pouvoir travailler.

#### c. Remote "prof"

Placez-vous dans le répertoire cloné et ajoutez le dépôt initial en tant que remote (nommé ici "prof") :
```sh
cd W31
git remote add prof git@git.unistra.fr:W31/W31.git
git fetch prof
```
Vérifiez grâce à la commande suivante que vous avez bien 2 remotes, "origin" qui est votre dépôt personnel sur GitLab, et "prof" qui est celui de départ :
```sh
git remote -v
```

### 3. Utiliser votre fork

- Pour *inspecter l'état actuel* de votre dépôt :
```sh
git status
```

- Pour *ajouter au dépôt* des fichiers OU pour valider des fichiers déjà ajoutés précédemment et *modifiés* depuis:
```sh
git add [file]
```
Seuls les fichiers ajoutés avec cette commande seront pris en compte par Git et
apparaîtront donc sur Gitlab après votre prochain commit.

- Une fois que vous êtes contents de vos ajouts/modifications, vous pouvez **commiter** l'état de vôtre dépôt :
```sh
git commit -m "[message qui DÉTAILLE les modifications apportés depuis le dernier commit\
et qui peut être sur plusieurs lignes si vous utilisez le backslash"
```

- Pour propager ce commit vers le serveur Gitlab :
```sh
git push origin master
```

- Pour récupérer en local les fichiers ajouté par l'équipe pédagogique (sur le remote "prof") :
```sh
git pull prof master
```

- Si vous travaillez sur plusieurs ordinateurs, après avoir **commité** et **pushé** sur l'un des ordinateurs, vous pouvez récupérer ces changement sur le second ordinateur :
```sh
git pull prof master
```
