const Discord = require('discord.js');
// const fs = require('fs');
const myBot = require('./myBot.js');
const initJeu = require('./initJeu.js');
const finJeu = require('./finJeu.js');
const event = require('./event.js');
// const insuline = require('./priseInsuline.js');
const sfm = require('./saveFileManagement.js');
// const as = require('./affichageStats.js');

const client = new Discord.Client();

const config = require('./token.json');
const perso = require('./perso.json');
const tableaux = require('./tableaux.json');

// listes pour les activités que le joueur peut pratiquer

const emoteActiviteM = ['🚴', '🎮', '🎸', '🏃'];
const emoteActiviteA = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '⛳', '🏓', '🏸', '🏋', '🏹', '🎳', '🎮', '🎣'];
const emoteActiviteS = ['🕺', '🍷', '📺', '🛏'];
const emoteRepasM = ['🍏', '🍞', '🍫', '🥐', '🍌'];
const emoteRepasS = ['🍔', '🍰', '🍨', '🍕', '🍖', '🥗', '🍚'];

// const pseudoJ = 'Alain';

client.on('ready', () => {
  console.log('Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.');
  client.user.setActivity('manger des ventilateurs');
});

client.on('error', error => {
  const errorTime = new Date().toUTCString();
  const errorLog = errorTime + ' : The server lost connexion\n \n';
  console.log(errorLog);
  throw error;
});

client.on('message', (message) => {

	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    if (message.content.startsWith(config.prefix)) {
      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const partie = sfm.loadSave(message.author.id);

      switch(command) {
        case 'start':
          partie.nbJour = 1;
          sfm.save(message.author.id, partie);
          initJeu.initJeu(message, client);
          break;
        case 'end':
          finJeu.finJeu(message);
          break;
            /* case "perso" :
                choixPerso(message);
                break;
        	case "stats":
                const f = [10,30,45];
        		as.graphString(0, 100, f, message, partie);
        		break;
            case "cons":
                console.log(partie.activite);
                console.log(partie.consequence);
                break;
            case 'insu':
                insuline.priseInsuline(message);
                break;*/
        case 'text':
          text(message);
          break;
        default:
          message.channel.send('Commande inconnue');
          break;
		}
  }
});

client.on('messageReactionAdd', (reaction, user) => {

	if(user.bot) return;

  const partie = sfm.loadSave(user.id);

  let tabNR = []; // tableau de nom de repas
  let tabNA = []; // tableau de nom d'activités
  let tabER = []; // tableau d'emote de repas
  let tabEA = []; // tableau d'emote d'activités

  switch(partie.partJour) {
      case 0:
          tabNR = tableaux.nomRepasM;
          tabER = emoteRepasM;
          tabNA = tableaux.nomActiviteM;
          tabEA = emoteActiviteM;
          break;
      case 1:
          tabNR = tableaux.nomRepasS;
          tabER = emoteRepasS;
          tabNA = tableaux.nomActiviteA;
          tabEA = emoteActiviteA;
          break;
      case 2:
          tabNR = tableaux.nomRepasS;
          tabER = emoteRepasS;
          tabNA = tableaux.nomActiviteS;
          tabEA = emoteActiviteS;
          break;
      default:
          console.log('Partie du jour inconnue.');
  }

  switch(reaction.emoji.name) {
      case '✅':
          // reaction.message.delete();
          // event.event(reaction.message, partie, tabNR, tabER);
          choixPerso(reaction.message);
          break;
      case '❌':
          if(partie.numEvent == 1) {
              writeAct(user.id, 'rienM', partie);
              event.event(reaction.message, partie, tabNA, tabEA);
          }
          else {
              writeAct(user.id, 'rienA', partie);
              partie.partJour = (partie.partJour + 1) % 3;
              sfm.save(partie.player, partie);
              event.event(reaction.message, partie, tabNR, tabER);
          }
          break;
      case '➡':
          event.event(reaction.message, partie, tabNR, tabER);
          break;
      case '🔚':
          finJeu.finJeu(reaction.message);
          break;
      default:
          break;
    }

    if(reaction.emoji.name == '🇦'
    || reaction.emoji.name == '🇧'
    || reaction.emoji.name == '🇨'
    || reaction.emoji.name == '🇩') {
      let numPerso = -1;
      switch(reaction.emoji.name) {
        case '🇦':
          numPerso = 0;
          break;
        case '🇧':
          numPerso = 1;
          break;
        case '🇨':
          numPerso = 2;
          break;
        case '🇩':
          numPerso = 3;
          break;
      }

      const chanId = myBot.messageChannel(reaction.message, 'personnage', partie);

      reaction.message.guild.channels.get(chanId).send({ embed: {
          color: 15013890,
          fields: [{
              name: 'Channel Personnage',
              value: 'Voici le channel personnage.\nC\'est dans ce channel que vous pouvez voir les informations concernant votre personnage.',
          }],
      } }).then(() => {
        reaction.message.guild.channels.get(chanId).send({ embed: {
          color: 0x00AE86,
          title: '__**Personnage**__',
          fields: [{
              name: 'Nom',
              value: perso.nom[numPerso],
          },
          {
              name: 'Sexe',
              value: perso.sexe[numPerso],
          },
          {
              name: 'Age',
              value: perso.age[numPerso],
          },
          {
              name: 'Taille',
              value: perso.taille[numPerso],
          },
          {
              name: 'Poids',
              value: perso.poids[numPerso],
          }],
        } })
        .then(() => {
            event.event(reaction.message, partie, tabNR, tabER);
        });
      });

      const chanId2 = myBot.messageChannel(reaction.message, 'informations', partie);

      reaction.message.guild.channels.get(chanId2).send({ embed: {
          color: 15013890,
          fields: [{
              name: 'Channel Informations',
              value: 'Voici le channel informations.\nAvant chaque prise d\'insuline, un graphique montrant l\'évolution de votre taux de glycémie apparaitra dans ce channel.',
          }],
      } });
    }

    // Quand on choisi le repas
    if(tabER.includes(reaction.emoji.name)) {
        var i = 0;
        while(tabER[i] != reaction.emoji.name)
            i++;
        writeAct(user.id, tabNR[i], partie);
        event.event(reaction.message, partie, tabNA, tabEA);
    }

    // Quand on choisi la sport
	if(tabEA.includes(reaction.emoji.name)) {
        var i = 0;
        while(tabEA[i] != reaction.emoji.name)
            i++;
        writeAct(user.id, tabNA[i], partie);
        partie.partJour = (partie.partJour + 1) % 3;
        sfm.save(partie.player, partie);
        event.event(reaction.message, partie, tabNR, tabER);
    }
});

client.on('guildMemberAdd', (member) => {
    finJeu.initStat(member.user);
});

client.on('guildMemberRemove', (member) => {
    sfm.deleteSave(member.id);
});

/**
* Fonction qui renvoie l'id du channel qui a pour nom chanName
* @param {string} message - Message discord
* @param {string} chanName - Nom du channel dans lequel le message sera envoyé
* @param {Object} partie - Objet json de la partie
* @returns {number} Identifiant du channel
**/
exports.messageChannel = function messageChannel(message, chanName, partie) {

	const listChan2 = finJeu.listChan(message, partie);

    let id = 1;

    listChan2.forEach(channel => {
        if(channel.name === chanName) {
            const chan = message.guild.channels.find(chann => {
                if(chann.name == chanName) {
                    return chann;
                }
            });
            id = chan.id;
        }
    });
    return id;  //----------Modifié----------//
};

/**
* Fonction qui ajoute une activité à la liste des activités de l'utilisateur
* @param {Snowflake} userId - Identifiant de l'utilisateur
* @param {string} text - Activité qui sera mis dans la liste
* @param {Object} partie - Objet json de la partie
* @param {string[]} partie.activite - Objet json de la partie
**/
function writeAct(userId, text, partie) {
    partie.activite.push(text);
    sfm.save(userId, partie);
}

/**
* Fonction qui choisit un nombre aléatoire entre 0 et max
* @param {number} max - Borne supérieur
* @returns {number} Identifiant du channel
**/
exports.getRandomInt = function getRandomInt(max) {
    const x = Math.floor(Math.random() * Math.floor(max));
    return x;
};

/**
* Fonction qui écrit le texte explicatif sur le serveur Discord
* @param {string} message - Message discord
**/
function text(message) {

    message.delete();

    const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle('Bienvenue dans Mellitus')

    .addField('Qu\'est ce que Mellitus ?', 'Mellitus est un jeu sérieux qui vous met dans la peau d\'une personne diabétique.\nVotre but est de stabiliser votre niveau d\'insuline jusqu\'à la fin de la partie.')
    .addField('Comment jouer ?', 'La partie est divisée en jour et chaque jour est une suite de choix. A chaque choix, ses conséquences.\n Durant la partie, vous ferez vos choix de 2 façons différentes : sous forme de texte ou sous forme de boutons.\nLe jeu n\'étant pas terminé, il ne peut accueillir qu\'un seul joueur à la fois.')
    .addField('Lancer le tutoriel : ', '/start')
    .addField('Commande d\'arrêt d\'urgence : ', '/end');

    message.channel.send({ embed });
}

/**
* Fonction qui présente les personnages prédéfinis
* @param {string} message - Message discord
**/
function choixPerso(message) {

    async function clear() {
        // message.delete();
        const fetched = await message.channel.fetchMessages();
        message.channel.bulkDelete(fetched);
    }

    clear()
    .catch((err) => {
        console.log(err);
    });

    const embed = new Discord.RichEmbed()
    .setColor(15013890)

    .setTitle('__**Phase personnage**__')
    .addField('👶 👦 👧 👨 👩 👴 👵', 'C\'est ici que vous devez choisir un personnage.\nChaque personnage a des caractéristiques différentes, qui influeront sur votre partie.\nPour choisir un personnage, cliquez sur la réaction correspondant au numéro du personnage choisit.');

    message.channel.send({ embed })
    .then((msg) => {
      for(let i = 0; i < 3; i++) {
          writePerso(msg, i);
      }

    msg.channel.send({ embed: {
        color: 0x00AE86,
        title: '__**Personnage D**__',
        fields: [{
            name: 'Nom',
            value: perso.nom[3],
          },
          {
            name: 'Sexe',
            value: perso.sexe[3],
          },
          {
            name: 'Age',
            value: perso.age[3],
          },
          {
            name: 'Taille',
            value: perso.taille[3],
          },
          {
            name: 'Poids',
            value: perso.poids[3],
          },
        ],
      },
    })
    .then(async function(mess) {
        await mess.react('🇦');
        await mess.react('🇧');
        await mess.react('🇨');
        await mess.react('🇩');
    });
  });
}

/**
* Fonction qui écrit le texte d'un personnage
* @param {string} message - Message discord
* @param {string} numPerso - Numéro du personnage
**/
function writePerso(message, numPerso) {

    let i = '';

    switch(numPerso) {
        case 0:
            i = 'A';
            break;
        case 1:
            i = 'B';
            break;
        case 2:
            i = 'C';
            break;
        case 3:
            i = 'D';
            break;
    }

    message.channel.send({ embed: {
        color: 0x00AE86,
        title: '__**Personnage ' + i + '**__',
        fields: [{
            name: 'Nom',
            value: perso.nom[numPerso],
          },
          {
            name: 'Sexe',
            value: perso.sexe[numPerso],
          },
          {
            name: 'Age',
            value: perso.age[numPerso],
          },
          {
            name: 'Taille',
            value: perso.taille[numPerso],
          },
          {
            name: 'Poids',
            value: perso.poids[numPerso],
          },
        ],
      },
    });
}

client.login(config.token);
