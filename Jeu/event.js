const Discord = require('discord.js');
const sfm = require('./saveFileManagement.js');
const myBot = require('./myBot.js');
const event = require('./event.js');
const finJeu = require('./finJeu.js')
const insuline = require('./priseInsuline.js');
const calcul = require('./calcul.js');
const as = require('./affichageStats.js');
const config = require("./token.json");

const client = new Discord.Client();
client.login(config.token);

const conseq = ['crampe', 'courbatures'];
	
/**
* Fonction qui lance l'évenement correspondant en fonction de la situation
* @param {string} message - Message discord
* @param {Object} partie - Objet json de la partie
* @param {number} partie.nbJour - Nombre de jour de la partie
* @param {number} partie.numJour - Numéro du jour actuel
* @param {number} partie.partJour - Partie de la journée actuelle
* @param {number} partie.numEvent - Evenement actuel
* @param {Snowflake} partie.player - Identifiant de l'utilisateur
* @param {string[]} tabN - Tableau des noms d'actions
* @param {string[]} tabE - Tableau des emojis d'actions
**/
exports.event = function event(message, partie, tabN, tabE){

	let fieldTitle = "";
	let fielText = "";

	async function clear() {
		const fetched = await message.channel.fetchMessages();
		message.channel.bulkDelete(fetched);
	}

	clear()
	.catch((err) => {
		console.log(err)
	});

	partie.numEvent = (partie.numEvent + 1) % 3;
	sfm.save(partie.player, partie);

	if(partie.numJour > 0 && partie.partJour == 0 && partie.numEvent == 0){
		journal(message, partie);
		calcul.glyMatin(partie);
	}

	if(partie.nbJour != partie.numJour){
		switch(partie.partJour){
			case 0:
				switch(partie.numEvent){
					case -1:
						eventNumJour(message, partie);
						break;
					case 0:
						fieldTitle = "C'est le matin!";
						if(partie.tuto)
							fieldText = "Chaque matin, vous devez faire votre prise d'insuline et vous pouvez choisir votre petit déjeuner et une activité matinale au choix.";
						else
							fieldText = "Le soleil se réveille, il fait beau, il faut jour.";
						title(message, fieldTitle, fieldText);
						consequence(message, partie, tabN, tabE);
						eventInsu(message, partie);
						break;
					case 1:
						eventRepas(message, tabN, tabE);
						break;
					case 2:
						eventSport(message, tabN, tabE);
						break;
				}
				break;
			case 1:
				switch(partie.numEvent){
					case 0:
						fieldTitle = "C'est l'après-midi!";
						if(partie.tuto)
							fieldText = "Tous les après-midi, vous devez faire votre prise d'insuline et vous pouvez choisir votre repas et une activité.";
						else
							fieldText = "Repas, repos, récréation.";
						title(message, fieldTitle, fieldText);
						//on va enlever
						//consequence(message, partie, tabN, tabE);
						eventInsu(message, partie);
						break;
					case 1:
						eventRepas(message, tabN, tabE);
						break;
					case 2:
						eventSport(message, tabN, tabE);
						break;
				}
				break;
			case 2:
				switch(partie.numEvent){
					case 0:
						fieldTitle = "C'est le soir!";
							
							if(partie.tuto)
							fieldText = "Tous les soirs, vous devez faire votre prise d'insuline et vous pouvez choisir votre diner et si vous sortez avec des amis.";
						else
							fieldText = "ZZZzzzzz";
						title(message, fieldTitle, fieldText);
							//on va enlever
							//consequence(message, partie, tabN, tabE);
						eventInsu(message, partie);
						break;
					case 1:
						eventRepas(message, tabN, tabE);
						break;
					case 2:
						partie.numJour++;
						sfm.save(partie.player, partie);
						eventSport(message, tabN, tabE);
						break;
				}
				break;
		}
	}
	else {
		eventFin(message);
	} 
};

//Modification
function consequence(message, partie, tabN, tabE){
	let x = 0;

    for(let i = 0; i < partie.activite.length; i++){
    	x = myBot.getRandomInt(10);
    	if(x > 1){
    		partie.consequence.push(conseq[1]);
    		sfm.save(partie.player, partie);
    	}
    }

    if(partie.consequence.length > 0){
    	const embed = new Discord.RichEmbed()
	    .setColor(0x00AE86)

	    .addField('Aïe ça fait mal !', partie.consequence[1])//ça va changer

	    message.channel.send({embed});
	    /*.then(async function (mess) {
	    	mess.react('➡');
	    });*/
	}
	else{
		message.delete();
        //event.event(message, partie, tabN, tabE);
        //tabn et tabe sont ceux de la partie de la journee precedante
	}
}

/**
* Fonction qui demande le nombre de jour à jouer
* @param {string} message - Message discord
* @param {Object} partie - Objet json de la partie
* @param {number} partie.nbJour - Nombre de jour de la partie
* @param {number} partie.choixPerso - Entier qui permet au joueur d'entrer le nombre de jour
**/
function eventNumJour(message, partie) {

	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .addField("Une limite à la partie ?", "Choisissez un nombre de jour ")
  	message.channel.send({embed});

	partie.choixPerso = 1;
	sfm.save(message.author.id, partie);

	let nbChoix = '-1';

	client.on ('message', message => {

		if(message.author.bot) return;

		if(message.member.roles.some(r=>['Joueur'].includes(r.name))) {

			if (partie.choixPerso == 1) {
			nbChoix = parseInt(message.content);

				if(Number.isInteger(nbChoix)){
					if(nbChoix < 1 || isNaN(nbChoix)) {
						message.channel.send("Alors là, c'est pas possible.");
					}
					else if(nbChoix > 10) {
						message.channel.send('Tu veux jouer pendant 40 ans ou quoi ?');
					}
					else {
						partie.choixPerso = 0;
						partie.nbJour = nbChoix;
						sfm.save(message.author.id, partie);
						message.react('➡');
						//event.event(message, partie, tabN, tabE);
					}
				}
				else {
					message.channel.send("Je comprend pas ce que tu racontes.");
				}
			}
		}
	});
}

/**
* Fonction qui pour chaque prise d'insuline sauvegarde le nouveau taux de glycemie
* @param {string} message - Message discord
* @param {Object} partie - Objet json de la partie
* @param {number} partie.glycemie - Taux de glycemie actuel de l'utilisateur
* @param {number[]} partie.tabGlycemie - Tableau de tous les taux de glycémie du joueur
**/
function eventInsu(message, partie){

	/*partie.glycemie = Math.round(((partie.glycemie + 2.7)%4.5)*10)/10;

	partie.tabGlycemie.push(partie.glycemie);
	sfm.save(message.author.id, partie);*/

	as.graphString(0, 5, partie.tabGlycemie, message, partie)
	.then(() => {
		insuline.priseInsuline(message, partie);
	});
}

/**
* Fonction qui met en place un choix de plusieurs activités 
* @param {string} message - Message discord
* @param {string[]} tabN - Tableau des noms d'activités
* @param {string[]} tabE - Tableau des emojis d'activités
**/
function eventSport(message, tabN, tabE){

	var rand1 = myBot.getRandomInt(tabN.length);

	var rand2 = rand1;
	while(rand2 == rand1)
		rand2 = myBot.getRandomInt(tabN.length);

	var rand3 = rand1;
	while(rand3 == rand1 || rand3 == rand2)
		rand3 = myBot.getRandomInt(tabN.length);

	var rand4 = rand1;
	while(rand4 == rand1 || rand4 == rand2 || rand4 == rand3)
		rand4 = myBot.getRandomInt(tabN.length);

	const embed = new Discord.RichEmbed()
	.setColor(0x00AE86)
	.setTitle("**J'ai le temps de faire une activité, qu'est ce que je fais ?**")

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

/**
* Fonction qui met en place un choix de plusieurs repas 
* @param {string} message - Message discord
* @param {string[]} tabN - Tableau des noms de repas
* @param {string[]} tabE - Tableau des emojis de repas
**/
function eventRepas(message, tabN, tabE){

	var rand1 = myBot.getRandomInt(tabN.length);

	var rand2 = rand1;
	while(rand2 == rand1)
		rand2 = myBot.getRandomInt(tabN.length);

	var rand3 = rand1;
	while(rand3 == rand1 || rand3 == rand2)
		rand3 = myBot.getRandomInt(tabN.length);

	var rand4 = rand1;
	while(rand4 == rand1 || rand4 == rand2 || rand4 == rand3)
		rand4 = myBot.getRandomInt(tabN.length);

	const embed = new Discord.RichEmbed()
	.setColor(0x00AE86)
	.setTitle("**J'ai faim !**")

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

/**
* Fonction qui écrit le message de fin de partie
* @param {string} message - Message discord
**/
function eventFin(message){

	if(partie.tuto)
		fieldTextInfo = "J'espère que vous avez apprécié le tutoriel.";
	else
		fieldTextInfo = "J'espère que vous avez apprécié la partie.";

	const embed = new Discord.RichEmbed()
	.setColor(15013890)

	.addField("C'est la fin du partie.", fieldTextInfo)
	.addField("Pour quitter la partie, tapez : ", "/end")

	message.channel.send({embed});
}

/**
* Fonction qui écrit un message expliquant la partie de la journée
* @param {string} message - Message discord
* @param {string} title - Titre du message
* @param {string} text - Texte du message
**/
function title(message, title, text){
	const embed = new Discord.RichEmbed()
	.setColor(15013890)

	.addField(title, text)

	message.channel.send({embed});
}

/**
* Fonction qui récapitule les actions faites par l'utilisateur pendant la journée
* @param {string} message - Message discord
* @param {Object} partie - Objet json de la partie
* @param {string[]} partie.activite - Liste des actions faites par l'utilisateur
* @param {number} partie.numJour - Numéro du jour
**/
function journal(message, partie){

	const chanId = myBot.messageChannel(message, 'journal', partie);

	const nbAct = partie.activite.length;
	const activ = [partie.activite[nbAct-5], partie.activite[nbAct-3], partie.activite[nbAct-1]];
	const repas = [partie.activite[nbAct-6], partie.activite[nbAct-4], partie.activite[nbAct-2]];

	for(let i = 0; i < 3; i++){
		if(activ[i] == "rienA"){
			activ[i] = "repos";
		}
	}

	for(let i = 0; i < 3; i++){
		if(repas[i] == "rienM"){
			repas[i] = "saut de repas";
		}
	}

	activ[1] = activ[1].toLowerCase();
	activ[2] = activ[2].toLowerCase();
	repas[1] = repas[1].toLowerCase();
	repas[2] = repas[2].toLowerCase();

	const embed = new Discord.RichEmbed()
	.setColor(15013890)
	.setTitle('__Journal de bord - Jour ' + partie.numJour + '__')

	.addField("Récapitulatifs des activités : ", activ[0] + ", " + activ[1] + " et " + activ[2] + ".")
	.addField("Récapitulatifs des repas : ", repas[0] + ", " + repas[1] + " et " + repas[2] + ".")

	message.guild.channels.get(chanId).send({embed});
}