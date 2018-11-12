const Discord = require('discord.js');
const sfm = require('./saveFileManagement.js');
const myBot = require('./myBot.js');

/**
* Fonction installant la partie
* @param {string} message - Message discord
* @param {Client} client - Le Client utilisé pour le jeu
**/
exports.initJeu = function initJeu(message, client) {

	if(!message.member.roles.some(r=>['Joueur'].includes(r.name))) {

		// creation d'un fichier de sauvegarde de sauvegarde
		// lecture de ce fichier de sauvegarde
		const partie = sfm.loadSave(message.author.id);
		const eventName = 'Joueur';
		const rolePers = initRole(message, eventName, client);

		initChannelGrp(message, partie, message.author.username, rolePers);

		message.delete();
		message.channel.send(message.author.username + ' a lancé une partie !');

	}
	else {
		message.channel.send('Vous êtes déjà en jeu.');
	}
};

/**
* Fonction créant un role joueur à l'utilisateur
* @param {string} message - Message discord
* @param {string} eventName - Prefix du role de l'utilisateur
* @param {Client} client - Le Client utilisé pour le jeu
* @returns {string} Nom du role joueur de l'utilisateur
**/
function initRole(message, eventName, client) {

	const nomRole = eventName + '-' + message.author.username;
	// let myRole = message.guild.roles.find('name', 'Joueur');

	const myRole = message.guild.roles.find(role => {
		if(role.name == 'Joueur') {
			return role;
		}
	});
	message.member.addRole(myRole);

	message.guild.createRole({
		name: nomRole,
		color: 0x00FF00,
		permissions: 0,
	}).then(role => {
		message.member.addRole(role, nomRole)
		.catch(error => client.catch(error));
	})
	.catch(error => client.catch(error));
	return nomRole;
}

/**
* Fonction créant un channel visible que pour l'utilisateur
* @param {string} message - Message discord
* @param {Object} partie - Objet json de la partie
* @param {string} rolePers - Nom du role joueur de l'utilisateur
* @param {string} channelName - Nom du channel à créer
* @param {Snowflake} chanGrpId - Identifiant du channel catégorie
* @returns {string} Texte vérifiant l'ajout
**/
function initChannel(message, partie, rolePers, channelName, chanGrpId) {

	const server = message.guild;
	// Creation d'un channel textuel
	server.createChannel(channelName, 'text')

	.then((chan) => {
		// Place le channel textuel dans la catégorie de jeu
		chan.setParent(chanGrpId)
		.then((chan2) => {

			chan2.overwritePermissions(message.guild.roles.find(role => {
				if(role.name == '@everyone') {
					return role;
				}
			}), {
				'CREATE_INSTANT_INVITE' : false,
				'VIEW_CHANNEL': false,
				'CONNECT': false,
				'WRITE': false,
			});

			chan2.overwritePermissions(message.guild.roles.find(role => {
				if(role.name == rolePers) {
					return role;
				}
			}), {
				'VIEW_CHANNEL': true,
				'CONNECT': true,
				'WRITE': true,
			});
			// on ajoute le channel a la sauvegarde de partie
			partie[channelName] = chan2.id;

			if(channelName == 'Hub')
				bienvenue(message);
		}
		).catch(console.error);
	}).catch(console.error);

	return '```Added```';
}

/**
* Fonction initialisant les channels et les caractéristique de l'utilisateur
* @param {string} message - Message discord
* @param {Object} partie - Objet json de la partie
* @param {Snowflake} partie.chanGrp - Identifiant du channel catégorie
* @param {Snowflake} partie.player - Identifiant de l'utilisateur
* @param {number} partie.partJour - Partie de la journée
* @param {number} partie.numJour - Numéro du jour
* @param {number} partie.numEvent - Numéro de l'évenement
* @param {number} partie.insuline - Activateur de la prise d'insuline
* @param {string[]} partie.activite - Liste des actions faites par l'utilisateur
* @param {string[]} partie.consequence - Liste des consequences de l'utilisateur
* @param {number} partie.glycemie - Taux de glycémie de l'utilisateur
* @param {number[]} partie.tabGlycemie - Tableau de tous les taux de glycémie de l'utilisateur
* @param {string} channelGrpName - Nom du channel catégorie
* @param {string} rolePers - Nom du role joueur de l'utilisateur
* @returns {Snowflake} Identifiant du channel catégorie
**/
function initChannelGrp(message, partie, channelGrpName, rolePers) {
	const server = message.guild;
	let res = '';
	server.createChannel(channelGrpName, 'category')
	.then(async chanGrp => {
		res = chanGrp.id;
		partie.chanGrp = chanGrp.id;
		partie.player = message.author.id;
		partie.partJour = 0;
		partie.numJour = 0;
    	partie.numEvent = -1;
    	partie.insuline = 0;
		partie.activite = [];
		partie.consequence = [];
		partie.glycemie = 0;
		partie.tabGlycemie = [];
		initChannel(message, partie, rolePers, 'Hub', res);
		initChannel(message, partie, rolePers, 'Informations', res);
		initChannel(message, partie, rolePers, 'Personnage', res);
		initChannel(message, partie, rolePers, 'Journal', res);
		sfm.save(message.author.id, partie);
	})
	.catch(console.error);
	return res;
}

/**
* Fonction qui écrit le message de lancement de partie
* @param {string} message - Message discord
**/
function bienvenue(message) {

	const partie = sfm.loadSave(message.author.id);

	const chanId = myBot.messageChannel(message, "hub", partie);

	const embed = new Discord.RichEmbed()
    .setColor(15013890)
    .setTitle("Bienvenue dans Mellitus")

    .addField("Tutoriel", "Ceci est le tutoriel du jeu Mellitus.")
    .addField("Commencer la partie", "✅")

    message.guild.channels.get(chanId).send({embed})
    .then(async function (mess) {
    	await mess.react('✅');
    });	//----------Modifié----------//
}
