const fs = require('fs');

/**
* loadSave : function pour recuperer l'ojet de sauvegarde depuis le lireFichier
* userId : id du joueur
**/
exports.loadSave = function loadSave(userId) {
  let save = fs.readFileSync('./sauvegardesPartie/' + userId + '.json');
  save = JSON.parse(save);
  return save;
};

/**
* save : function pour enregister la sauvegarde modifiée
* userId : id du joueur
* partie : objet json de la partie
**/
exports.save = function save(userId, partie) {
  const fileName = './sauvegardesPartie/' + userId + '.json';
  fs.writeFileSync(fileName, JSON.stringify(partie, null, 2));
};


/**
* deleteSave : supprime un fichier de sauvegarde
* userId : id du Joueur
**/
exports.deleteSave = function deleteSave(userId) {
  fs.unlinkSync('./sauvegardesPartie/' + userId + '.json');
};
