// Fonctions pour terminer la partie
exports.finJeu = function finJeu(message) {

	if(message.member.roles.some(r=>['Joueur'].includes(r.name))) {
    deletChannel(message);
    deletRole(message);
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

	const listedChannels = listChan(message);

	// Suppression des channels nommés 'hub', 'informations' et 'personnage'
	listedChannels.forEach(channel => {
		if(channel === 'hub' || channel === 'informations' || channel === 'personnage') {
			const chan = message.guild.channels.find(chann => {
				if(chann.name == channel) {
					return chann;
				}
			});
			chan.delete();
		}
	});
}

// Fonction qui liste les channels visibles du joueur
function listChan(message) {

	// Creation d'une liste des channels que le joueur peut voir
	const listedChannels = [];
	message.guild.channels.forEach(channel => {
		if(channel.permissionsFor(message.author).has('VIEW_CHANNEL')) {listedChannels.push(channel.name);}
	});

	return listedChannels;
}
