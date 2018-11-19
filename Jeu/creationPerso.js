const sfm = require('./saveFileManagement.js');

let state = 1;
let message;
let client;
const tab = [];
let partie;

exports.creerPerso = function(mess, Discord, clt, part) {
  /* const embed = new Discord.RichEmbed()
    .set
    .setTitle('Création du personnage')
    .description('Homme/Femme?');
    */
  partie = part;
  message = mess;
  client = clt;
  genre();
};

function genre() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Homme/Femme?',
  } }
  ).then(async function(mess) {
    await mess.react('🚹');
    await mess.react('🚺');
  });

  client.on('messageReactionAdd', (reaction, user) => {
    if(user.bot) return;
    switch(reaction.emoji.name) {
      case '🚹':
        tab.push('Homme');
        reaction.message.delete();
        nomPrenom();
        break;
      case '🚺':
        tab.push('Femme');
        reaction.message.delete();
        nomPrenom();
        break;
      default:
        console.log('err');
        break;
    }
  });

}

function nomPrenom() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Nom?',
  } });
  client.on ('message', mess => {
    if (mess.author.bot) {return;}
    else if (!isNaN(mess) && state < 3) {
      message.channel.send('veuillez entre des caracteres');
    }
    else if (state == 1) {
      console.log();
      let nom = mess.content.trim();
      nom = nom.charAt(0).toUpperCase() + nom.slice(1);
      tab.push(nom);
      state += 1;
      message.channel.send({ embed: {
        color:0x00AE86,
        title:'Création du personnage',
        description: 'Prénom?',
      } });
    }
    else if(state == 2) {
      state += 1;
      let prenom = mess.content.trim();
      prenom = prenom.charAt(0).toUpperCase() + prenom.slice(1);
      tab.push(prenom);
      age();
    }
  });
}

function age() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Votre age',
  } });
  client.on ('message', mess => {
    if (mess.author.bot || state != 3) return;
    if (mess.content < 100) {
      tab.push(mess.content);
      state += 1;
      taille();
    }
    else {
      message.channel.send('veuillez saisir un age correcte');
    }
  });
}

function taille() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'Taille en cm',
  } });
  client.on ('message', mess => {
    if (mess.author.bot || state != 4) return;
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
  });
}

function poids() {
  message.channel.send({ embed: {
    color:0x00AE86,
    title:'Création du personnage',
    description: 'poids en kg',
  } });
  client.on ('message', mess => {
    if (mess.author.bot || state != 5) return;
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
  });
}
