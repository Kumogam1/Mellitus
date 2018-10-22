const fs = require('fs');

/**
* loadSave : fonction pour recuperer l'ojet de sauvegarde deupuis le lireFichier
* userId : id du joueur
**/
exports.loadSave = function(userId) {
  let save = fs.readFileSync('./sauvegardesPartie/' + userId + '.json');
  save = JSON.parse(save);
  return save;
};

/**
* save : function pour enrengister la sauvegarde modifiée
* userId : id du joueur
* partie : objet json de la partie
**/
exports.save = function save(userId, partie) {
  fs.writeFileSync('./sauvegardesPartie/' + userId + '.json', JSON.stringify(partie, null, 2), function(err) {
    if (err) throw err;
    console.log('Save file updatd for ' + userId);
  });
};


/**
* deleteSave : suprime un fichier de sauvegarde
* userId : id du Joueur
**/
exports.deleteSave = function deleteSave(userId) {
  fs.unlinkSync('./sauvegardesPartie/' + userId + '.json');
};
