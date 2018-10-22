const Discord = require('discord.js');
const sfm = require('./saveFileManagement.js');
const myBot = require('./myBot.js');

// Fonctions pour débuter la partie
exports.initJeu = function initJeu(message, client, config) {

	if(!message.member.roles.some(r=>['Joueur'].includes(r.name))) {

		// creation d'un fichier de sauvegarde de sauvegarde
		// lecture de ce fichier de sauvegarde
		const partie = sfm.loadSave(message.author.id);
		const eventName = 'Joueur';
		const rolePers = initRole(message, eventName, client);

		initChannelGrp(message, partie, message.author.username, rolePers, config);

		message.delete();
		message.channel.send(message.author.username + ' a lancé une partie !');

	}
	else {
		message.channel.send('Vous êtes déjà en jeu.');
	}
};

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

function initChannel(message, partie, rolePers, channelName, chanGrpId, config) {

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
				bienvenue(message, config);
		}
		).catch(console.error);
	}).catch(console.error);

	return '```Added```';
}

function initChannelGrp(message, partie, channelGrpName, rolePers, config) {
	const server = message.guild;
	let res = '';
	server.createChannel(channelGrpName, 'category')
	.then(async chanGrp => {
		res = chanGrp.id;
		partie.chanGrp = chanGrp.id;
		partie.player = message.author.id;
<<<<<<< HEAD
		partie.partJour = 0;
		partie.poids = 0;
		partie.glycemie = 0;
=======
		partie.activite = [];
		partie.consequence = [];
>>>>>>> 1798c246493b7de548603f51c0b67ba49c76ee00
		initChannel(message, partie, rolePers, 'Hub', res, config);
		initChannel(message, partie, rolePers, 'Informations', res, config);
		initChannel(message, partie, rolePers, 'Personnage', res, config);
		console.log(JSON.stringify(partie, null, 2));
		sfm.save(message.author.id, partie);
	})
	.catch(console.error);
	return res;
}

function bienvenue(message, config) {
	const chanId = myBot.messageChannel(message, "hub");

	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Bienvenue dans Mellitus")

    .addField("Tutoriel", "Ceci est le tutoriel du jeu Mellitus.")
    .addField("Mellitus", "Mellitus est un jeu sérieux qui apprend au joueur comment vivre avec un diabète.")
    .addField("Debut", "Commencer la partie")

    message.guild.channels.get(chanId).send({embed})
    .then(async function (mess) {
    	await mess.react('✅');
    });	//----------Modifié----------//
}
