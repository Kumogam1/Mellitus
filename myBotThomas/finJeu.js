const sfm = require('./saveFileManagement.js');
const fj = require('./finJeu.js');

// Fonctions pour terminer la partie
exports.finJeu = function finJeu(message) {

	if(message.member.roles.some(r=>['Joueur'].includes(r.name))) {
	    deletChannel(message);
	    deletRole(message);
	    fj.initStat(message.author);
	    //sfm.deleteSave(message.author.id);

	    message.delete();
	}
	else {
    	message.channel.send('Vous n\'êtes pas en jeu.');
	}
};

function deletRole(message) {
	const suppRoleJoueur = message.guild.roles.find(role => {
		if(role.name == 'Joueur') {
			return role;
		}
	});
	// let suppRolePerso = message.guild.roles.find("name", "Joueur-" + message.author.username);

	const suppRolePerso = message.guild.roles.find(role => {
		if(role.name == 'Joueur-' + message.author.username) {
			return role;
		}
	});
	message.member.removeRole(suppRoleJoueur);
	suppRolePerso.delete();
}

function deletChannel(message) {

	const listedChannels = fj.listChan(message);

	// Suppression des channels et du groupe de channels pour la partie
	listedChannels.forEach(channel => {
		channel.overwritePermissions(message.guild.roles.find(role => {
			if(role.name == '@everyone') {
				return role;
			}
		}), {
			'VIEW_CHANNEL': false,
			'CONNECT': false,
			'WRITE': false,
		})
		.then((chan) => {
			chan.delete();
		});
	}
  );
}

// Fonction qui liste les channels de la partie + le group de channels
exports.listChan = function listChan(message) {

  	const partie = sfm.loadSave(message.author.id);
	// Creation d'une liste des channels que le joueur peut voir
	const listedChannels = [];
	message.guild.channels.forEach(channel => {
		if (channel.parentID == partie.chanGrp || channel.id == partie.chanGrp) {
			listedChannels.push(channel);
		}
	});

	return listedChannels;
}

exports.initStat = function initStat(user) {
    const partie = {};

    partie.chanGrp = "";
    partie.player = user.id;
    partie.partJour = 0;
    partie.nbJour = 0;
    partie.numJour = 0;

    sfm.save(user.id, partie);
}