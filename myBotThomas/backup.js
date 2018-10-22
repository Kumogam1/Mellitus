const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./token.json");

const fs = require("fs");

//listes pour le nom du personnage
const prenom = ['Archibald', 'Karim', 'Bernold', 'Magellan', 'Philastère', 'Cheyenne', 'Gabry-Aile', 'Loréole', 'Shar-Lee-Rose-Megane', 'Zénobie'];
const nom = ['Gossa', 'Haristoy', 'Bertot', 'Zimmerman', 'Wemmert', 'Kraemer', 'Grançarski', 'Schneider', 'Mazo', 'Wessler', 'Thal', 'Richard', 'Lachiche', 'Divoux', 'Zaroli', 'Blindauer', 'Torregrossa'];

//listes pour les activités que le joueur peut pratiquer
const emoteEvent = ['🥇','🍴'];

const emoteActivite = ['⚽','🏀','🏈','⚾','🎾','🏐','⛳','🏓','🏸','🚴','🏋','🏹','🎳','🎮','🎣'];
const nomActivite = ['du foot','du basket','du rugby','du baseball','du tennis','du volley','du golf','du pingpong','du badmington','du vélo','de la muscu',"du tir à l'arc",'du bowling','une partie de jeux videos','de la peche'];

const emoteRepas = ['🍏','🍞','🍔','🍰','🍨','🍫','🥐','🍕','🍖','🍅','🍌'];
const nomRepas = ['une pomme','du pain','un hamburger','un gateau','une glace','un chocolat','un croissant','une pizza','de la viande', 'une tomate', 'une banane'];

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
        		event(message, 0);
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

	switch(reaction.emoji.name){
		/*case emoteEvent[0]:
			reaction.message.delete();
			eventSport(reaction.message);
			break;
		case emoteEvent[1]:
			reaction.message.delete();
			eventRepas(reaction.message);
			break;*/
		case '✅':
			reaction.message.delete();
			reaction.message.channel.send('Debut de partie');
			break;
		case '❌':
			reaction.message.delete();
			consequence(user.id);
			break;
		default:
			break;
	}

	//Quand on choisi le repas
	if(emoteRepas.includes(reaction.emoji.name)){
		reaction.message.delete();
		var i = 0;
		while(emoteRepas[i] != reaction.emoji.name)
			i++;
		reaction.message.channel.send(`Vous avez choisi de manger ${nomRepas[i]}`);
		writeAct(user.id, nomRepas[i]);
		event(reaction.message, 1);
	}

	//Quand on choisi la sport
	if(emoteActivite.includes(reaction.emoji.name)){
		reaction.message.delete();
		var i = 0;
		while(emoteActivite[i] != reaction.emoji.name)
			i++;
		reaction.message.channel.send(`Vous avez choisi de faire ${nomActivite[i]}`);
		writeAct(user.id, nomActivite[i]);
	}

	//console.log(reaction.emoji.name);
	//messageReaction	//----------Modifié----------//
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
	} 
	else {
	 	message.channel.send("Vous êtes déjà en jeu.")
	}	//----------Modifié----------//
}

function initRole(message, eventName){

	let nomRole = eventName + "-" + message.author.username;
	//let myRole = message.guild.roles.find('name', 'Joueur');

	let myRole = message.guild.roles.find(role => {
		if(role.name == 'Joueur'){
			return role;
		}
	});
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
		let categ = message.guild.channels.find(channel => {
			if(channel.name == 'Jeu'){
				return channel;
			}
		});
		chan.setParent(categ.id)	// Place le channel textuel dans la catégorie de jeu
	    .then((chan2) => {
	        chan2.overwritePermissions(message.guild.roles.find(role => {
				if(role.name == '@everyone'){
					return role;
				}
			}), {
			   'CREATE_INSTANT_INVITE' : false,        'VIEW_CHANNEL': false,
			   'CONNECT': false,                       'WRITE': false
			});
			chan2.overwritePermissions(message.guild.roles.find(role => {
				if(role.name == rolePers){
					return role;
				}
			}),   {
			    'VIEW_CHANNEL': true,                   'CONNECT': true,            'WRITE': true,
			});
			if(chan2.name == "hub"){
				bienvenue(message);
			}
	    }
	    ).catch(console.error);
	}).catch(console.error);

	return '```Added```';
}

function bienvenue(message){
	const chanId = messageChannel(message, "hub");


	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Bienvenue dans Mellitus")

    .addField("Tutoriel", "Ceci est le tutoriel du jeu Mellitus.")
    .addField("Mellitus", "Mellitus est un jeu sérieux qui apprend au joueur comment vivre avec un diabète.")
    .addField("Debut", "Commencer la partie")

    client.channels.get(chanId).send({embed})
    .then(async function (mess) {
    	await mess.react('✅');
    });	//----------Modifié----------//
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
	let suppRoleJoueur = message.guild.roles.find(role => {
		if(role.name == 'Joueur'){
			return role;
		}
	});
	//let suppRolePerso = message.guild.roles.find("name", "Joueur-" + message.author.username);

	let suppRolePerso = message.guild.roles.find(role => {
		if(role.name == 'Joueur-' + message.author.username){
			return role;
		}
	});
	message.member.removeRole(suppRoleJoueur);
	suppRolePerso.delete();
}

function deletChannel(message){

	var listedChannels = listChan(message);

	// Suppression des channels nommés 'hub', 'informations' et 'personnage'
	listedChannels.forEach(channel => {
		if(channel === 'hub' || channel === 'informations' || channel === 'personnage'){
			let chan = message.guild.channels.find(chann => {
				if(chann.name == channel){
					return chann;
				}
			});
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
	
	let listChan2 = listChan(message);
	let id = 1;

	listChan2.forEach(channel => {
		if(channel === chanName){
			let chan = message.guild.channels.find(chann => {
				if(chann.name == chanName){
					return chann;
				}
			});
			id = chan.id;
		}
	});
	return id;	//----------Modifié----------//
}

//Fonction test qui avertit le joueur d'un evenement
function event(message, numAct){

	if(numAct == 0){
		const embed = new Discord.RichEmbed()
	    .setColor(0x00AE86)

	    .addField("C'est l'après-midi!", "Tous les après-midi, vous pouvez choisir ce que vous allez manger et si vous voulez faire du sport")

	    message.channel.send({embed});
	}

    if(numAct == 0){
    	eventRepas(message);
    }
    else{
    	eventSport(message);
    }
}

function eventSport(message){

	var rand1 = getRandomInt(nomActivite.length);

	var rand2 = rand1;
	while(rand2 == rand1)
		rand2 = getRandomInt(nomActivite.length);

    var rand3 = rand1;
    while(rand3 == rand1 || rand3 == rand2)
    	rand3 = getRandomInt(nomActivite.length);

    var rand4 = rand1;
    while(rand4 == rand1 || rand4 == rand2 || rand4 == rand3)
    	rand4 = getRandomInt(nomActivite.length);

	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Que voulez-vous faire ?")

    .addField("Faire du " + nomActivite[rand1] + " : ", emoteActivite[rand1])
    .addField("Faire du " + nomActivite[rand2] + " : ", emoteActivite[rand2])
    .addField("Faire du " + nomActivite[rand3] + " : ", emoteActivite[rand3])
    .addField("Faire du " + nomActivite[rand4] + " : ", emoteActivite[rand4])
    .addField("Ne rien faire : ", '❌')


    message.channel.send({embed})
    .then(async function (mess) {
    	await mess.react(emoteActivite[rand1]);
    	await mess.react(emoteActivite[rand2]);
    	await mess.react(emoteActivite[rand3]);
    	await mess.react(emoteActivite[rand4]);
    	await mess.react('❌');
    });
}

function eventRepas(message){

	var rand1 = getRandomInt(nomRepas.length);

	var rand2 = rand1;
	while(rand2 == rand1)
		rand2 = getRandomInt(nomRepas.length);

    var rand3 = rand1;
    while(rand3 == rand1 || rand3 == rand2)
    	rand3 = getRandomInt(nomRepas.length);

    var rand4 = rand1;
    while(rand4 == rand1 || rand4 == rand2 || rand4 == rand3)
    	rand4 = getRandomInt(nomRepas.length);

	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Que voulez-vous faire ?")

    .addField("Manger " + nomRepas[rand1] + " : ", emoteRepas[rand1])
    .addField("Manger " + nomRepas[rand2] + " : ", emoteRepas[rand2])
    .addField("Manger " + nomRepas[rand3] + " : ", emoteRepas[rand3])
    .addField("Manger " + nomRepas[rand4] + " : ", emoteRepas[rand4])
    .addField("Ne rien faire : ", '❌')


    message.channel.send({embed})
    .then(async function (mess) {
    	await mess.react(emoteRepas[rand1]);
    	await mess.react(emoteRepas[rand2]);
    	await mess.react(emoteRepas[rand3]);
    	await mess.react(emoteRepas[rand4]);
    	await mess.react('❌');
    });
}

function writeAct(userId, text) {
	fs.appendFileSync('./AC/act-' + userId + '.txt', text+";", function (err) {
		if (err) console.log(err);
	});
}

function consequence(userId){
	const content = fs.readFileSync('./AC/act-' + userId + '.txt', 'utf-8');

	let i = 0;
	let j = 0;
	let listActions = [];

	while(i != content.length) {
		if(content.charAt(i) == ';') {
			listActions.push(content.substring(j, i));
			j = i+1;
		}
		i++;
	}

	listActions.forEach(str => {
		let x = getRandomInt(10);
		if(x == 1){
			console.log(str);
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