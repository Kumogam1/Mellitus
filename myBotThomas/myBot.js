const Discord = require("discord.js");
const fs = require("fs");
const initJeu = require('./initJeu.js');
const finJeu = require('./finJeu.js');
const sfm = require('./saveFileManagement.js');
const as = require('./affichageStats.js');

const client = new Discord.Client();

const config = require("../token.json");


//listes pour le nom du personnage
const prenom = ['Archibald', 'Karim', 'Bernold', 'Magellan', 'Philastère', 'Cheyenne', 'Gabry-Aile', 'Loréole', 'Shar-Lee-Rose-Megane', 'Zénobie'];
const nom = ['Gossa', 'Haristoy', 'Bertot', 'Zimmerman', 'Wemmert', 'Kraemer', 'Grançarski', 'Schneider', 'Mazo', 'Wessler', 'Thal', 'Richard', 'Lachiche', 'Divoux', 'Zaroli', 'Blindauer', 'Torregrossa'];

//listes pour les activités que le joueur peut pratiquer

const emoteActiviteM = ['🚴', '🎮', '🎸', '🏃'];
const nomActiviteM = ['Faire du vélo', 'Faire une partie de jeux videos', 'Faire un peu de musique', 'Faire un jogging'];

const emoteActiviteA = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '⛳', '🏓', '🏸', '🏋', '🏹', '🎳', '🎮', '🎣'];
const nomActiviteA = ['Faire du foot', 'Faire du basket', 'Faire du rugby', 'Faire du baseball', 'Faire du tennis', 'Faire du volley', 'Faire du golf', 'Faire du pingpong', 'Faire du badmington', 'Faire de la muscu', 'Faire du tir à l\'arc', 'Faire du bowling', 'Faire une partie de jeux videos', 'Faire de la peche'];

const emoteActiviteS = ['🕺', '🍷', '📺', '🛏'];
const nomActiviteS = ['Faire la fête', 'Aller dans un bar', 'Regarder la tv', 'Aller dormir'];

const emoteRepasM = ['🍏', '🍞', '🍫', '🥐', '🍌'];
const nomRepasM = ['Prendre une pomme', 'Prendre du pain', 'Prendre du chocolat', 'Prendre un croissant', 'Prendre une banane'];

const emoteRepasS = ['🍔','🍰','🍨','🍕','🍖'];
const nomRepasS = ['Manger un hamburger', 'Manger un gateau', 'Manger une glace', 'Manger une pizza', 'Manger de la viande'];

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
        const partie = sfm.loadSave(message.author.id);

    	switch(command) {
        	case "start":
        		initJeu.initJeu(message, client, config);
        		break;
        	case "end":
        		finJeu.finJeu(message);
        		break;
        	case "stats":
                const f = [10,30,45];
        		as.graphString(100, 0, 20, f, message);
        		break;
            case "consequence":
                consequence(partie);
                break;
    		default:
    			message.channel.send("Commande inconnue");
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
            event(reaction.message, partie, 0, nomRepasM, emoteRepasM);
            break;
        case '❌':
            reaction.message.delete();
            consequence(user.id);
            break;
        default:
            break;
    }

    let tabNR = []; //tableau de nom de repas
    let tabNA = []; //tableau de nom d'activités
    let tabER = []; //tableau d'emote de repas
    let tabEA = []; //tableau d'emote d'activités
    let tabNR2 = []; //tableau de nom de repas de la partie du jour suivant
    let tabER2 = []; //tableau d'emote de repas de la partie du jour suivant

    switch(partie.partJour){
        case 0:
            tabNR = nomRepasM;
            tabER = emoteRepasM;
            tabNA = nomActiviteM;
            tabEA = emoteActiviteM;
            tabNR2 = nomRepasS;
            tabER2 = emoteRepasS;
            break;
        case 1:
            tabNR = nomRepasS;
            tabER = emoteRepasS;
            tabNA = nomActiviteA;
            tabEA = emoteActiviteA;
            tabNR2 = nomRepasS;
            tabER2 = emoteRepasS;
            break;
        case 2:
            tabNR = nomRepasS;
            tabER = emoteRepasS;
            tabNA = nomActiviteS;
            tabEA = emoteActiviteS;
            tabNR2 = nomRepasM;
            tabER2 = emoteRepasM;
            break;
        default:
            console.log("Partie du jour inconnue.");
    }

    //Quand on choisi le repas
    if(tabER.includes(reaction.emoji.name)){
        reaction.message.delete();
        var i = 0;
        while(tabER[i] != reaction.emoji.name)
            i++;
        reaction.message.channel.send(`Vous avez choisi de manger ${tabNR[i]}`);
        writeAct(user.id, tabNR[i], partie);
        event(reaction.message, partie, 1, tabNA, tabEA);
    }

    //Quand on choisi la sport
	if(tabEA.includes(reaction.emoji.name)){
        reaction.message.delete();
        var i = 0;
        while(tabEA[i] != reaction.emoji.name)
            i++;
        reaction.message.channel.send(`Vous avez choisi de faire ${tabNA[i]}`);
        writeAct(user.id, tabNA[i], partie);
        partie.partJour = (partie.partJour + 1) % 3;
        sfm.save(user.id, partie);
        event(reaction.message, partie, 0, tabNR2, tabER2);
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
function event(message, partie, numAct, tabN, tabE){

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

        console.log(tabN);
        console.log(tabE);
    }

    if(numAct == 0){
        eventRepas(message, tabN, tabE);
    }
    else{
        eventSport(message, tabN, tabE);
    }
}

function eventSport(message, tabN, tabE){

	var rand1 = getRandomInt(tabN.length);

	var rand2 = rand1;
	while(rand2 == rand1)
		rand2 = getRandomInt(tabN.length);

    var rand3 = rand1;
    while(rand3 == rand1 || rand3 == rand2)
    	rand3 = getRandomInt(tabN.length);

    var rand4 = rand1;
    while(rand4 == rand1 || rand4 == rand2 || rand4 == rand3)
    	rand4 = getRandomInt(tabN.length);

	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Que voulez-vous faire ?")

    .addField(tabN[rand1] + " : ", tabE[rand1])
    .addField(tabN[rand2] + " : ", tabE[rand2])
    .addField(tabN[rand3] + " : ", tabE[rand3])
    .addField(tabN[rand4] + " : ", tabE[rand4])
    .addField("Ne rien faire : ", '❌')


    message.channel.send({embed})
    .then(async function (mess) {
    	await mess.react(tabE[rand1]);
    	await mess.react(tabE[rand2]);
    	await mess.react(tabE[rand3]);
    	await mess.react(tabE[rand4]);
    	await mess.react('❌');
    });
}

function eventRepas(message, tabN, tabE){

	var rand1 = getRandomInt(tabN.length);

	var rand2 = rand1;
	while(rand2 == rand1)
		rand2 = getRandomInt(tabN.length);

    var rand3 = rand1;
    while(rand3 == rand1 || rand3 == rand2)
    	rand3 = getRandomInt(tabN.length);

    var rand4 = rand1;
    while(rand4 == rand1 || rand4 == rand2 || rand4 == rand3)
    	rand4 = getRandomInt(tabN.length);

	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Que voulez-vous faire ?")

    .addField(tabN[rand1] + " : ", tabE[rand1])
    .addField(tabN[rand2] + " : ", tabE[rand2])
    .addField(tabN[rand3] + " : ", tabE[rand3])
    .addField(tabN[rand4] + " : ", tabE[rand4])
    .addField("Ne rien manger : ", '❌')


    message.channel.send({embed})
    .then(async function (mess) {
    	await mess.react(tabE[rand1]);
    	await mess.react(tabE[rand2]);
    	await mess.react(tabE[rand3]);
    	await mess.react(tabE[rand4]);
    	await mess.react('❌');
    });
}

function writeAct(userId, text, partie){
    partie.activite.push(text);
    partie.consequence.push(text);
    sfm.save(userId, partie);
}

function consequence(partie){
    for(let i = 0; i < partie.activite.length; i++){
        console.log(partie.consequence[i]);
    }
}

//Fonction random
function getRandomInt(max){
	var x = Math.floor(Math.random() * Math.floor(max));
	return x;
}

client.login(config.token);
