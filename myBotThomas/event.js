const Discord = require('discord.js');
const sfm = require('./saveFileManagement.js');
const myBot = require('./myBot.js');
const event = require('./event.js');

const conseq = ['crampe', 'courbatures'];

//tabn et tabe sont ceux de la partie de la journee precedante
	

exports.event = function event(message, partie, tabN, tabE){

    let fieldTitle = "";
    let fielText = "";

	async function clear() {
        message.delete();
        const fetched = await message.channel.fetchMessages({limit: 1});
        message.channel.bulkDelete(fetched);
    }
    
    clear()
    .catch((err) => {
    	console.log(err)
    });

    partie.numEvent = (partie.numEvent + 1) % 3;
	sfm.save(partie.player, partie);

	//console.log('partie du jour : ' + partie.partJour);
    //console.log('event : ' + partie.numEvent);

    switch(partie.partJour){
        case 0:
            switch(partie.numEvent){
                case 0:
                	fieldTitle = "C'est le matin!";
                	fielText = "Chaque matin, vous pouvez choisir votre petit déjeuner, faire une activité matinale au choix et prendre votre prise d'insuline.";
                    title(message, fieldTitle, fielText);
                    consequence(message, partie, tabN, tabE);
                    //insuline
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
                	fielText = "Tous les après-midi, vous pouvez choisir ce que vous allez manger et si vous voulez faire une activité.";
                	title(message, fieldTitle, fielText);
                	//on va enlever
                	consequence(message, partie, tabN, tabE);
        			//insuline
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
               		fielText = "Tous les soirs, vous pouvez diner et sortir avec des amis.";
               		title(message, fieldTitle, fielText);
               		//on va enlever
               		consequence(message, partie, tabN, tabE);
                    //insuline
                    break;
                case 1:
                    eventRepas(message, tabN, tabE);
                    break;
                case 2:
                    eventSport(message, tabN, tabE);
                    break;
            }
            break;
    }
}

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

	    message.channel.send({embed})
	    .then(async function (mess) {
	    	mess.react('➡');
	    });
	}
	else{
		message.delete();
        event.event(message, partie, tabN, tabE);
        //tabn et tabe sont ceux de la partie de la journee precedante
	}
}

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

function title(message, title, text){
	const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)

    .addField(title, text)

    message.channel.send({embed});
}