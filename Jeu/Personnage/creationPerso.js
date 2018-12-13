const Discord = require('discord.js');
const sfm = require('../Main/saveFileManagement.js');
const config = require('../token.json');
const myBot = require('../Main/myBot.js');
const initJeu = require('../Main/initJeu.js');

let state = -1;
let message;
const client = new Discord.Client();
const tab = [];
const tabNb = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let partie;
let image;

client.on('messageReactionAdd', (reaction, user) => {
  if(user.bot) return;
  switch(reaction.emoji.name) {
    case '🚹':
      state += 1;
      partie.tabPerso.push('Homme');
      reaction.message.delete();
      image = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/155/mens-symbol_1f6b9.png';
      nom();
      break;
    case '🚺':
      state += 1;
      partie.tabPerso.push('Femme');
      reaction.message.delete();
      image = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/155/womens-symbol_1f6ba.png';
      nom();
      break;
    default:
      console.log('err');
      break;
    }
});

client.on ('message', mess => {

  if (mess.author.bot) {return;}

  let param = mess.content.trim();

  switch (state) {
    case 1:
      myBot.clear(message);
      param = param.charAt(0).toUpperCase() + param.slice(1);
      partie.tabPerso.push(param);
      state += 1;
      prenom();
      break;
    case 2:
      myBot.clear(message);
      state += 1;
      param = param.charAt(0).toUpperCase() + param.slice(1);
      partie.tabPerso.push(param);
      age();
      break;
    case 3:
      myBot.clear(message);
      let boolAge = true;
      if(mess.content.length == 1 || mess.content.length == 2) {
        for(let i = 0; i < mess.content.length; i++) {
          if(!tabNb.includes(mess.content.charAt(i))) {
            boolAge = false;
          }
        }
      }
      else {
        boolAge = false;
      }

      if (boolAge == true && mess.content > 10 && mess.content < 120) {
        partie.tabPerso.push(mess.content + ' ans');
        state += 1;
        taille();
      }
      else {
        message.channel.send('Veuillez saisir un âge correct');
      }
      break;
    case 4:
      myBot.clear(message);
      let boolTaille = true;
      if(mess.content.length == 2 || mess.content.length == 3){
        for(let i = 0; i < mess.content.length; i++){
          if(!tabNb.includes(mess.content.charAt(i))){
            boolTaille = false;
          }
        }
      }
      else{
        boolTaille = false;
      }

      if (boolTaille == true && mess.content > 50 && mess.content < 250) {
        partie.tabPerso.push(mess.content + ' cm');
        state += 1;
        poids();
      }
      else {
        message.channel.send('Veuillez saisir une taille correcte');
      }
      break;
    case 5:
      myBot.clear(message);
      let boolPoids = true;
      if(mess.content.length == 2 || mess.content.length == 3){
        for(let i = 0; i < mess.content.length; i++){
          if(!tabNb.includes(mess.content.charAt(i))){
            boolPoids = false;
          }
        }
      }
      else{
        boolPoids = false;
      }

      if (boolPoids == true && mess.content > 35 && mess.content < 200) {
        partie.tabPerso.push(mess.content + ' kg');
        sfm.save(partie.player, partie);
        state += 1;
        partie.nom = partie.tabPerso[2] + ' ' + partie.tabPerso[1];
        partie.sexe = partie.tabPerso[0];
        partie.age = parseInt(partie.tabPerso[3]);
        partie.taille = parseInt(partie.tabPerso[4]);
        partie.poids = parseInt(partie.tabPerso[5]);
        sfm.save(partie.player, partie);
        const chanId = myBot.messageChannel(message, 'personnage', partie);

        const fieldTextPerso = 'Voici votre personnage :';

        message.guild.channels.get(chanId).send({ embed: {
            color: 15013890,
            fields: [{
                name: 'Channel Personnage',
                value: fieldTextPerso
            }]
        } }).then(() => {
            message.guild.channels.get(chanId).send({ embed: {
                color: 0x00AE86,
                author:
                {
                  name: 'Personnage ',
                  icon_url: image,
                },
                fields: [{
                    name: 'Nom',
                    value: partie.nom,
                },
                {
                    name: 'Sexe',
                    value: partie.sexe,
                },
                {
                    name: 'Age',
                    value: partie.tabPerso[3],
                },
                {
                    name: 'Taille',
                    value: partie.tabPerso[4],
                },
                {
                    name: 'Poids',
                    value: partie.tabPerso[5],
                }]
            } })
            .then(() => {

              myBot.clear(message)
              .catch((err) => {
                console.log(err);
              });

              initJeu.accueilMedecin(message, partie);
            });
        });
      }
      else {
        message.channel.send('Veuillez saisir un poids correct');
      }
      break;
    default:
      console.log('err');
      break;
  }
});

exports.creerPerso = function(pMess, part) {
  myBot.clear(pMess);
  partie = part;
  message = pMess;
  state = 0;
  genre();
};

function genre() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Homme/Femme?',
  } }
).then(async function(mGenre) {
    await mGenre.react('🚹');
    await mGenre.react('🚺');
  });
}

function nom() {
  message.channel.send({ embed: {
    title:'Création du personnage',
    color:0x00AE86,
    description: 'Quel est votre nom ?',
  } });
}
function prenom() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Quel est votre prénom ?',
  } });
}
function age() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Quel est votre age ?',
  } });
}

function taille() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Quelle est votre taille (en cm) ?',
  } });
}


function poids() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Quel est votre poids (en kg)?',
  } });
}

client.login(config.token);
