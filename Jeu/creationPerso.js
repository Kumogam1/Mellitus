const Discord = require('discord.js');
const sfm = require('./saveFileManagement.js');
const config = require('./token.json');
const myBot = require('./myBot.js');
const initJeu = require('./initJeu.js');

let state = -1;
let message;
const client = new Discord.Client();
const tab = [];
const tabNb = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let partie;

client.on('messageReactionAdd', (reaction, user) => {
  if(user.bot) return;
  switch(reaction.emoji.name) {
    case '🚹':
      state += 1;
      tab.push('Homme');
      reaction.message.delete();
      nom();
      break;
    case '🚺':
      state += 1;
      tab.push('Femme');
      reaction.message.delete();
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
      param = param.charAt(0).toUpperCase() + param.slice(1);
      tab.push(param);
      state += 1;
      prenom();
      break;
    case 2:
      state += 1;
      param = param.charAt(0).toUpperCase() + param.slice(1);
      tab.push(param);
      age();
      break;
    case 3:
      let boolAge = true;
      if(mess.content.length == 1 || mess.content.length == 2){
        for(let i = 0; i < mess.content.length; i++){
          if(!tabNb.includes(mess.content.charAt(i))){
            boolAge = false;
          }
        }
      }
      else{
        boolAge = false;
      }

      if (boolAge == true) {
        tab.push(mess.content);
        state += 1;
        taille();
      }
      else {
        message.channel.send('Veuillez saisir un age correcte');
      }
      break;
    case 4:

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
        tab.push(mess.content + "cm");
        state += 1;
        poids();
      }
      else {
        message.channel.send('Veuillez saisir une taille correcte');
      }
      break;
    case 5:

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
        tab.push(mess.content + 'kg');
        state += 1;
        partie.nom = tab[1] + ' ' + tab[2];
        partie.sexe = tab[0];
        partie.age = parseInt(tab[3]);
        partie.taille = parseInt(tab[4]);
        partie.poids = parseInt(tab[5]);
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
                title: '**Personnage**',
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
                    value: tab[3],
                },
                {
                    name: 'Taille',
                    value: tab[4],
                },
                {
                    name: 'Poids',
                    value: tab[5],
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
    description: 'Quelle est votre nom ?',
  } });
}
function prenom() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Quelle est votre prénom ?',
  } });
}
function age() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Quelle est votre age ?',
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
    description: 'Quelle est votre poids (en kg)?',
  } });
}

client.login(config.token);
