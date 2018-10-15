const Discord = require("discord.js");
const fs = require("fs");
const initJeu = require('./initJeu.js');
const finJeu = require('./finJeu.js');

const client = new Discord.Client();

const config = require("./token.json");


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
        		initJeu.initJeu(message, client, config);
        		break;
        	case "end":
        		finJeu.finJeu(message);
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

	switch(reaction.emoji.name){
		case emoteEvent[0]:
			reaction.message.delete();
			eventSport(reaction.message);
			break;
		case emoteEvent[1]:
			reaction.message.delete();
			eventRepas(reaction.message);
			break;
		default:
			break;
	}



	if(emoteActivite.includes(reaction.emoji.name)){
		reaction.message.delete();
		var i = 0;
		while(emoteActivite[i] != reaction.emoji.name)
			i++;
		reaction.message.channel.send(`Vous avez choisi de faire ${nomActivite[i]}`);
	}

	if(emoteRepas.includes(reaction.emoji.name)){
		reaction.message.delete();
		var i = 0;
		while(emoteRepas[i] != reaction.emoji.name)
			i++;
		reaction.message.channel.send(`Vous avez choisi de manger ${nomRepas[i]}`);
	}

	//console.log(reaction.emoji.name);
	//messageReaction
});



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

    .addField("Faire une activité : ", "🥇")
    .addField("Manger : ", "🍴")


    message.channel.send({embed})
    .then(async function (mess) {
    	for(var i = 0; i < emoteEvent.length; i++){
    		await mess.react(emoteEvent[i]);
    	}
    });
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

    .addField("Faire " + nomRepas[rand1] + " : ", emoteRepas[rand1])
    .addField("Faire " + nomRepas[rand2] + " : ", emoteRepas[rand2])
    .addField("Faire " + nomRepas[rand3] + " : ", emoteRepas[rand3])
    .addField("Faire " + nomRepas[rand4] + " : ", emoteRepas[rand4])
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
