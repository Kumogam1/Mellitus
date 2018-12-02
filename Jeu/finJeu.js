const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./token.json');
client.login(config.token);

const sfm = require('./saveFileManagement.js');
const fj = require('./finJeu.js');

/**
* Fonction terminant la partie
* @param {string} message - Message discord
**/
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

/**
* Fonction enlevant les roles de l'utilisateur
* @param {string} message - Message discord
**/
function deletRole(message) {
	const suppRoleJoueur = message.guild.roles.find(role => {
		if(role.name == 'Joueur') {
			return role;
		}
	});

	message.member.removeRole(suppRoleJoueur)
	.then(() => {
		const suppRolePerso = message.guild.roles.find(role => {
			if(role.name == 'Joueur-' + message.author.username) {
				return role;
			}
		});
		suppRolePerso.delete();
	});
}

/**
* Fonction supprimant les channels de la partie de l'utilisateur
* @param {string} message - Message discord
**/
function deletChannel(message) {

	const partie = sfm.loadSave(message.author.id);

	const listedChannels = fj.listChan(message, partie);

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
	});
}

/**
* Fonction de message de fin de partie
* @param {string} message - Message discord
* @param {Object} partie - Objet json de la partie
* @param {number} partie.numJour - Numéro du jour actuel
**/
exports.msgFin = function msgFin(message, partie) {

	message.delete();

	if(message.member.roles.some(r=>['Joueur'].includes(r.name))) {
		if(message.channel.name == "hub"){

			async function clear() {
				fetched = await message.channel.fetchMessages();
				message.channel.bulkDelete(fetched);
			}

			clear()
			.catch((err) => {
				console.log(err)
			});

			let textMort = "";
			let text = "";

			if(partie.mort){
				if(partie.glycemie > 3)
					textMort = "Tu as fait une crise d'hyperglycémie. Consulte le channel 'Mellitus' pour en savoir plus.\n";
				else if(partie.glycemie == 0)
					textMort = "Tu as fait une crise d'hypoglycemie. Consulte le channel 'Mellitus' pour en savoir plus.\n";
				else
					textMort = "Tu as fait une crise de stress. Consulte le channel 'Mellitus' pour en savoir plus.\n";
			}

			if(partie.numJour < 5) {
				text = "Je suis sûr que tu peux aller plus loin.";
			}
			else if(partie.numJour < 10) {
				text = "Bien, un peu plus et tu seras le meilleur.";
			}
			else {
				text = "Toi, ça ce voit que tu es là pour être le meilleur."
			}

			const embed = new Discord.RichEmbed()
			.setColor(15013890)

			.addField("__**C'est perdu ou gagné ? A toi de juger !**__", textMort + 'Vous avez tenu ' + partie.numJour + ' jour(s).\n' + text + '\n\n')
			.addField('Pour quitter la partie : ', '/quit');

			message.channel.send({ embed });
		}
	}
	else {
		message.channel.send('Vous n\'êtes pas en jeu.');
	}
}

/**
* Fonction listant les channels de la partie de l'utilisateur
* @param {string} message - Message discord
* @param {Object} partie - Objet json de la partie
* @param {string} partie.chanGrp - Identifiant du channel catégorie
**/
exports.listChan = function listChan(message, partie) {

	// Creation d'une liste des channels que le joueur peut voir
	let listedChannels = [];

	message.guild.channels.forEach(channel => {
		if (channel.parentID == partie.chanGrp || channel.id == partie.chanGrp) {
			listedChannels.push(channel);
		}
	});

	return listedChannels;
};

/**
* Fonction initialisant les channels et les caractéristique de l'utilisateur
* @param {string} user - Message discord
**/
exports.initStat = function initStat(user) {
	const partie = {};

	partie.chanGrp = "";
	partie.player = user.id;
	partie.partJour = 0;
	partie.numEvent = 0;
	partie.nbJour = 0;
	partie.numJour = -1;
	partie.insuline = 0;
	partie.activite = [];
	partie.consequence = [];

	sfm.save(user.id, partie);
};