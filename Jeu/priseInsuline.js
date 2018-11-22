const Discord = require('discord.js');
const fs = require('fs');
const event = require('./event.js');
const sfm = require('./saveFileManagement.js');
const calcul = require('./calcul.js');
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

    if(message.author.bot) return;

    if(message.member.roles.some(r=>['Joueur'].includes(r.name)))
    {

      if (partie.insuline == 1)
      {
        insuline = parseInt(message.content);

        if(Number.isInteger(insuline))
        {
          if(insuline < 0 || insuline > 80 || isNaN(insuline))
          {
            message.channel.send('Entrez une valeur comprise entre 0 et 80 !');
          }
          else
          {
            calcul.glyInsu(partie, insuline);
            partie.insuline = 0;
            sfm.save(message.author.id, partie);
            message.react('➡');
          }
        }
      }
    }
  });
}
