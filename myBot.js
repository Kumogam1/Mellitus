const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./token.json");

const fs = require("fs");

var prenom = ['Archibald', 'Karim', 'Bernold', 'Magellan', 'Philastère', 'Cheyenne', 'Gabry-Aile', 'Loréole', 'Shar-Lee-Rose-Megane', 'Zénobie'];
var nom = ['Gossa', 'Haristoy', 'Bertot', 'Zimmerman', 'Wemmert', 'Kraemer', 'Grançarski', 'Schneider', 'Mazo', 'Wessler', 'Thal', 'Richard', 'Lachiche', 'Divoux', 'Zaroli', 'Blindauer', 'Torregrossa'];
var emoteEvent = ['🏀','🍴'];



const pseudoJ = prenom[getRandomInt(prenom.length)] + " " + nom[getRandomInt(nom.length)];

client.on("ready", () => {
  	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  	client.user.setActivity(`manger des ventilateurs`);
});

client.on("message", (message) => {

	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  	if (message.content.startsWith(config.prefix)) {

  		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

    	switch(command) {
        	case "start":
        		initJeu(message);
        		break;
        	case "end":
        		finJeu(message);
        		break;
        	case "event":
        		event(message);
        		break;
        	case "info":
        		messageChannel(message, 'hub');
        		break;
        	case "faux":
        		messageChannel(message, 'hubhub');
        		break;
    		default:
    			message.channel.send("Commande inconnue");
		}
  	}
});

client.on("messageReactionAdd", (reaction, user) => {

	if(user.bot) return;

	if(reaction.emoji.name == emoteEvent[0]){
		reaction.message.channel.send("Vous avez choisi de faire du sport");
	}
	else{
		reaction.message.channel.send("Vous avez choisi de manger");
	}
	//console.log(reaction.emoji.name);
	//messageReaction
});

//Fonctions pour débuter la partie
function initJeu(message){
	
	if(!message.member.roles.some(r=>["Joueur"].includes(r.name)) )  {
		let eventName = 'Joueur';
	  	let rolePers = initRole(message, eventName);

		initChannel(message, rolePers, 'Hub');
		initChannel(message, rolePers, 'Informations');
		initChannel(message, rolePers, 'Personnage');

		message.delete();
	    message.channel.send(pseudoJ + " a lancé une partie !");

	    bienvenue(message);
	} 
	else {
	 	message.channel.send("Vous êtes déjà en jeu.")
	}
}

function initRole(message, eventName){

	let nomRole = eventName + "-" + message.author.username;
	let myRole = message.guild.roles.find("name", "Joueur");
	message.member.addRole(myRole);

	message.guild.createRole({
	    name: nomRole,
	    color: 0x00FF00,
	    permissions: []
	}).then(role => {
	    message.member.addRole(role,nomRole)
	    .catch(error => client.catch(error));
	})
	.catch(error => client.catch(error));

	return nomRole;
}

function initChannel(message, rolePers, channelName){

	let server = message.guild;
	server.createChannel(channelName, 'text') // Creation d'un channel textuel

	.then((chan) => {
		let categ = message.guild.channels.find('name', 'Jeu');
		chan.setParent(categ.id)	// Place le channel textuel dans la catégorie de jeu
	    .then((chan2) => {
	        chan2.overwritePermissions(message.guild.roles.find('name', '@everyone'), {
			   'CREATE_INSTANT_INVITE' : false,        'VIEW_CHANNEL': false,
			   'CONNECT': false,                       'WRITE': false
			});
			chan2.overwritePermissions(message.guild.roles.find('name', rolePers),   {
			    'VIEW_CHANNEL': true,                   'CONNECT': true,            'WRITE': true,
			});
	    }
	    ).catch(console.error);
	}).catch(console.error);

	return '```Added```';
}

function bienvenue(message){
	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Bienvenue dans Mellitus")

    .addField("Résumé", "Texte qui explique le jeu")
    .addField(config.prefix + "dgame", "Commancer une partie")
    .addField(config.prefix + "fgame", "Terminer une partie")

    message.channel.send({embed});
}

//Fonctions pour terminer la partie
function finJeu(message){

	if(message.member.roles.some(r=>["Joueur"].includes(r.name)) )  {
	  	deletChannel(message);
	  	deletRole(message);
	} 
	else {
	 	message.channel.send("Vous n'êtes pas en jeu.")
	}
}

function deletRole(message){
	let suppRoleJoueur = message.guild.roles.find("name", "Joueur");
	let suppRolePerso = message.guild.roles.find("name", "Joueur-" + message.author.username);
	message.member.removeRole(suppRoleJoueur);
	suppRolePerso.delete();
}

function deletChannel(message){

	var listedChannels = listChan(message);

	// Suppression des channels nommés 'hub', 'informations' et 'personnage'
	listedChannels.forEach(channel => {
		if(channel === 'hub' || channel === 'informations' || channel === 'personnage'){
			let chan = message.guild.channels.find("name", channel);
			chan.delete();
		}
	});
}

//Fonction qui liste les channels visibles du joueur
function listChan(message){

	// Creation d'une liste des channels que le joueur peut voir
	var listedChannels = [];
	message.guild.channels.forEach(channel => { 
		if(channel.permissionsFor(message.author).has('VIEW_CHANNEL')) 
			listedChannels.push(channel.name);
	});

	return listedChannels;
}

//Fonction qui cherche un channel
function messageChannel(message, chanName){
	
	var listChan2 = listChan(message);

	listChan2.forEach(channel => {
		if(channel === chanName){
			let chan = message.guild.channels.find("name", channel);
			message.channel.send("Trouvé");
			return chan;
		}
	})
	message.channel.send("J'ai pas trouvé");
}

//Fonction test qui avertit le joueur d'un evenement
function event(message){
	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Que voulez-vous faire ?")

    .addField("Faire du sport : ", "🏀")
    .addField("Manger : ", "🍴")


    message.channel.send({embed})
    .then(async function (mess) {
    	for(var i = 0; i < emoteEvent.length; i++){
    		await mess.react(emoteEvent[i]);
    	}
    });
}

//Fonction random
function getRandomInt(max){
	var x = Math.floor(Math.random() * Math.floor(max));
	return x;
}

client.login(config.token);


/*
function lireFichier(message) {
    var content = fs.readFileSync('question.txt','utf-8');

    var numRep = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣'];
    var question = '';
    var i = 0;
    var nbRep = 0;

    while(content.charAt(i) != ';') {
        if(content.charAt(i) == '>')
            nbRep++;
        question += content.charAt(i);
        i++;
    }

    //console.log(question);
    //message.channel.send(question);

    const embed = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .addField(question);

    message.channel.send({embed})
    .then(async function (message) {
        for(var i = 0; i < nbRep; i++){
            await message.react(numRep[i]);
        }
    });
}    

*/