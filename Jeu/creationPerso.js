let state = 1;
let message;
let client;
const tab = [];

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
    if (mess.author.bot || state != 3) return;
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
    if (mess.author.bot || state != 4) return;
    if (mess.content > 35 && mess.content < 200) {
      tab.push(Number(mess.content).toFixed(0) + 'kg');
      console.log(tab);
      mess.react('➡');
    }
    else {
      message.channel.send('veuillez saisir un poids correct');
    }
  });
}
