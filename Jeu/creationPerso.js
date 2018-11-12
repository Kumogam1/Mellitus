let state = 1;
let message;
let client;
let tab = [];

exports.creerPerso = function(mess, Discord, clt) {
  /* const embed = new Discord.RichEmbed()
    .set
    .setTitle('Création du personnage')
    .description('Homme/Femme?');
    */
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
        tab.push('homme');
        reaction.message.delete();
        nomPrenom();
        break;
      case '🚺':
        tab.push('femme');
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
    else if (state == 1) {
      tab.push(mess.content);
      state += 1;
      message.channel.send({ embed: {
        color:0x00AE86,
        title:'Création du personnage',
        description: 'Prénom?',
      } });
    }
    else if(state == 2) {
      state += 1;
      tab.push(mess.content);
      taille();
      console.log(tab);
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
    if (mess.author.bot) return;
    if (mess.content > 100 && mess.content < 250) {
      var tEnM = mess.content / 100;
      tEnM = tEnM.indexOf(',', 'm');
      tab.push(tEnM);
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
    if (mess.author.bot) return;
    if (mess.content > 35 && mess.content < 200) {
      tab.push(mess + 'kg');
      fin();
    }
    else {
      message.channel.send('veuillez saisir un poids correct');
    }
  });
}

function fin() {
  console.log(tab);
  message.react('➡');
}
