const Discord = require("discord.js");
const fs = require("fs");
const initJeu = require('./initJeu.js');
const finJeu = require('./finJeu.js');
const sfm = require('./saveFileManagement.js');
const insuline = require('./priseInsuline');

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
let partJour = 0;

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
        	/*case "event":
        		event(message, 0, message.author);
        		break;*/
        	case "info":
        		messageChannel(message, 'hub');
        		break;
        	case "faux":
        		messageChannel(message, 'hubhub');
        		break;
          case "insuline"
            insuline.priseInsuline(message);
    		default:
    			message.channl.send("Commande inconnue");
		}
  	}
});

client.on("messageReactionAdd", (reaction, user) => {

	if(user.bot) return;

    const partie = sfm.loadSave(user.id);

	switch(reaction.emoji.name){
		case '✅':
            reaction.message.delete();
            reaction.message.channel.send('Debut de partie');
            event(reaction.message, partie, 0);
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
        event(reaction.message, partie, 1);
    }

    //Quand on choisi la sport
	if(emoteActivite.includes(reaction.emoji.name)){
        reaction.message.delete();
        var i = 0;
        while(emoteActivite[i] != reaction.emoji.name)
            i++;
        reaction.message.channel.send(`Vous avez choisi de faire ${nomActivite[i]}`);
        writeAct(user.id, nomActivite[i]);
        partie.partJour = (partie.partJour + 1) % 3;
        sfm.save(user.id, partie);
        event(reaction.message, partie, 0);
    }

	//console.log(reaction.emoji.name);
	//messageReaction
});

client.on("guildMemberAdd", (member) => {
    finJeu.initStat(member.user);
});

client.on("guildMemberRemove", (member) => {
    sfm.deleteSave(member.id);
});

//Fonction qui cherche un channel
exports.messageChannel = function messageChannel(message, chanName){

	const listChan2 = finJeu.listChan(message);

    let id = 1;

    listChan2.forEach(channel => {
        if(channel.name === chanName){
            let chan = message.guild.channels.find(chann => {
                if(chann.name == chanName){
                    return chann;
                }
            });
            id = chan.id;
        }
    });
    return id;  //----------Modifié----------//
}

//Fonction test qui avertit le joueur d'un evenement
function event(message, partie, numAct){

    let fieldTitle = "";
    let fielText = "";

    if(numAct == 0){
        switch(partie.partJour) {
            case 0 :
                fieldTitle = "C'est le matin!";
                fielText = "Chaque matin, vous pouvez choisir votre petit déjeuner, faire une activité matinale au choix et prendre votre prise d'insuline.";
                break;
            case 1 :
                fieldTitle = "C'est l'après-midi!";
                fielText = "Tous les après-midi, vous pouvez choisir ce que vous allez manger et si vous voulez faire une activité.";
                break;
            case 2 :
                fieldTitle = "C'est le soir!";
                fielText = "Tous les soirs, vous pouvez diner et sortir avec des amis.";
                break;
            default :
                console.log("partie du jour inexistante : " + partie.partJour)
        }

        const embed = new Discord.RichEmbed()
        .setColor(0x00AE86)

        .addField(fieldTitle, fielText)

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
    .addField("Ne rien manger : ", '❌')


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
