const Discord = require('discord.js');
const fs = require('fs');
const event = require('./event.js');
const sfm = require('./saveFileManagement.js');
const config = require("./token.json");

const client = new Discord.Client();
client.login(config.token);

exports.priseInsuline = function priseInsuline(message, partie) {

  let insuline = '-1';

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .addField("C'est l'heure de la prise d'insuline.", "Je dois prendre de l'insuline (entre 0 et 80 unités): ")

  message.channel.send({embed});

  partie.insuline = 1;
  sfm.save(message.author.id, partie);

  client.on ('message', message => {

    if (message.author.bot) return;

    if(message.member.roles.some(r=>['Joueur'].includes(r.name))) {

      if (partie.insuline == 1) {
        insuline = parseInt(message.content);

        if(insuline < 0 || insuline > 80 || isNaN(insuline)) {
          message.channel.send('Entrez une valeur comprise entre 0 et 80 !');
        }
        else {
          //calcul(insuline, message);
          partie.insuline = 0;
          sfm.save(message.author.id, partie);
          message.react('➡');
          //event.event(message, partie, tabN, tabE);
        }
      }
    }
  });
}

function calcul(poids, message) {
  const doseIntermediaireInitiale = poids / 10;
  const doseIntermediaireTheorique = Math.round(0.4 * poids);

  const doseGlicemie = [doseIntermediaireInitiale, doseIntermediaireTheorique];
  message.channel.send('La dose intermédiare initiale à prendre est de ' + doseGlicemie[0] + 'g');
  message.channel.send('La dose intermédiare théorique à atteindre est de ' + doseGlicemie[1] + 'g');
}
