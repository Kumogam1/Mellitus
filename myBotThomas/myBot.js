const Discord = require("discord.js");
const fs = require("fs");
const myBot = require('./myBot.js');
const initJeu = require('./initJeu.js');
const finJeu = require('./finJeu.js');
const event = require('./event.js');
const insuline = require('./priseInsuline.js');
const sfm = require('./saveFileManagement.js');
const as = require('./affichageStats.js');

const client = new Discord.Client();

const config = require("./token.json");

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

const pseudoJ = 'Alain';
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
            case 'insuline':
                insuline.priseInsuline(message);
                break;
    		default:
    			message.channel.send("Commande inconnue");
		}
  	}
});

client.on("messageReactionAdd", (reaction, user) => {

	if(user.bot) return;

    const partie = sfm.loadSave(user.id);

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

    switch(reaction.emoji.name){
        case '✅':
            //reaction.message.delete();
            reaction.message.channel.send('Debut de partie');
            event.event(reaction.message, partie, tabNR, tabER);
            break;
        case '❌':
            event.event(reaction.message, partie, tabNR, tabER);
            break;
        case '➡':
            event.event(reaction.message, partie, tabNR, tabER);
            break;
        default:
            break;
    }

    //Quand on choisi le repas
    if(tabER.includes(reaction.emoji.name)){
        var i = 0;
        while(tabER[i] != reaction.emoji.name)
            i++;
        writeAct(user.id, tabNR[i], partie);
        event.event(reaction.message, partie, tabNA, tabEA);
    }

    //Quand on choisi la sport
	if(tabEA.includes(reaction.emoji.name)){
        var i = 0;
        while(tabEA[i] != reaction.emoji.name)
            i++;
        writeAct(user.id, tabNA[i], partie);
        partie.partJour = (partie.partJour + 1) % 3;
        sfm.save(partie.player, partie);
        event.event(reaction.message, partie, tabNR2, tabER2);
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

function writeAct(userId, text, partie){
    partie.activite.push(text);
    sfm.save(userId, partie);
}

function nextPart(reaction, user, choix){

    const partie = sfm.loadSave(user.id);

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

    reaction.message.delete();

    //Quand on choisi le repas
    if(tabER.includes(reaction.emoji.name)){
        var i = 0;
        while(tabER[i] != reaction.emoji.name)
            i++;
        writeAct(user.id, tabNR[i], partie);
        event.event(reaction.message, partie, 2, tabNA, tabEA);
    }

    //Quand on choisi la sport
    if(tabEA.includes(reaction.emoji.name)){
        var i = 0;
        while(tabEA[i] != reaction.emoji.name)
            i++;
        writeAct(user.id, tabNA[i], partie);
        partie.partJour = (partie.partJour + 1) % 3;
        sfm.save(user.id, partie);
        event.event(reaction.message, partie, 0, tabNR2, tabER2);
    }
}

//Fonction random
exports.getRandomInt = function getRandomInt(max){
    var x = Math.floor(Math.random() * Math.floor(max));
    return x;
}

client.login(config.token);
