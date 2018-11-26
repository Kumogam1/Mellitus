const Discord = require('discord.js');
const sfm = require('./saveFileManagement.js');
const config = require('./token.json');

let state = 0;
let message;
const client = new Discord.Client();
const tab = [];
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
  else if (!isNaN(mess) && state < 3) {
    message.channel.send('veuillez entrer des caracteres');
  }
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
      if (mess.content < 100) {
        tab.push(mess.content);
        state += 1;
        taille();
      }
      else {
        message.channel.send('veuillez saisir un age correcte');
      }
      break;
    case 4:
      if (mess.content > 100 && mess.content < 250) {
        let tEnM = (mess.content / 100).toFixed(2).toString();
        tEnM = tEnM.replace('.', 'm');
        tab.push(tEnM);
        state += 1;
        poids();
      }
      else {
        message.channel.send('veuillez saisir une taille correcte');
      }
      break;
    case 5:
      if (mess.content > 35 && mess.content < 200) {
        tab.push(Number(mess.content).toFixed(0) + 'kg');
        console.log(tab);
        console.log(partie);
        mess.react('➡');
        partie.nom = tab[1] + ' ' + tab[2];
        partie.sexe = tab[0];
        partie.age = tab[3];
        partie.taille = tab[4];
        partie.poids = tab[5];
        console.log(partie);
        sfm.save(message.author.id, partie);
        }
      else {
        message.channel.send('veuillez saisir un poids correct');
      }
      break;
    default:
      console.log('err');
      break;
  }
});

exports.creerPerso = function(pMess, part) {
  partie = part;
  message = pMess;
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
    description: 'Nom?',
  } });
}
function prenom() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Prénom?',
  } });
}
function age() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Votre age',
  } });
}

function taille() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Taille en cm',
  } });
}


function poids() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'poids en kg',
  } });
}

client.login(config.token);
