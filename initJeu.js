const Discord = require('discord.js');

// Fonctions pour débuter la partie
exports.initJeu = function initJeu(message, client, config) {

	if(!message.member.roles.some(r=>['Joueur'].includes(r.name))) {
		const eventName = 'Joueur';
		const rolePers = initRole(message, eventName, client);

		initChannel(message, rolePers, 'Hub');
		initChannel(message, rolePers, 'Informations');
		initChannel(message, rolePers, 'Personnage');

		message.delete();
		message.channel.send(message.author.name + ' a lancé une partie !');

		bienvenue(message, config);
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
		permissions: [],
	}).then(role => {
		message.member.addRole(role, nomRole)
		.catch(error => client.catch(error));
	})
	.catch(error => client.catch(error));

	return nomRole;
}

function initChannel(message, rolePers, channelName) {

	const server = message.guild;
	// Creation d'un channel textuel
	server.createChannel(channelName, 'text')

	.then((chan) => {
		const categ = message.guild.channels.find(channel => {
			if(channel.name == 'Jeu') {
				return channel;
			}
		});
		// Place le channel textuel dans la catégorie de jeu
		chan.setParent(categ.id)
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
		}
		).catch(console.error);
	}).catch(console.error);

	return '```Added```';
}

function bienvenue(message, config) {
	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle('Bienvenue dans Mellitus')

    .addField('Résumé', 'Texte qui explique le jeu')
    .addField(config.prefix + 'dgame', 'Commancer une partie')
    .addField(config.prefix + 'fgame', 'Terminer une partie');

    message.channel.send(embed);
}
