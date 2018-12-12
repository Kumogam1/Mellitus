const Discord = require('discord.js');
const fs = require('fs');
const event = require('./event.js');
const sfm = require('../Main/saveFileManagement.js');
const calcul = require('./calcul.js');
const config = require("../token.json");

const client = new Discord.Client();
client.login(config.token);

const tabNb = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

exports.priseInsuline = function priseInsuline(message, partie) {

  let insuline = '-1';

  if(partie.numEvent == 0 && partie.partJour == 0)
    text = "C'est l'heure de la prise d'insuline lente.";
  else
    text = "C'est l'heure de la prise d'insuline rapide.";

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .addField(text, "Je dois prendre de l'insuline (entre 0 et 80 unités): ")
  message.channel.send({embed});

  partie.insuline = 1;
  sfm.save(message.author.id, partie);

  client.on ('message', message => {

    if(message.author.bot) return;

    if(!message.content.startsWith(config.prefix)) {

      if(message.member.roles.some(r=>['Joueur'].includes(r.name)))
      {
        let bool = true;
        if (partie.insuline == 1)
        {
          if(message.content.length == 1 || message.content.length == 2){
            for(let i = 0; i < message.content.length; i++){
              if(!tabNb.includes(message.content.charAt(i))){
                bool = false;
              }
            }
          }
          else{
            bool = false;
          }
          insuline = parseInt(message.content);

          if(bool == true)
          {
            if(insuline < 0 || insuline > 80 || isNaN(insuline))
            {
              message.channel.send('Entrez une valeur comprise entre 0 et 80 !');
            }
            else
            {
              if(partie.numEvent == 0 && partie.partJour == 0)
                calcul.glyInsuLente(partie, insuline);
              else
                calcul.glyInsu(partie, insuline);
              partie.insuline = 0;
              sfm.save(message.author.id, partie);
              message.react('➡');
            }
          }
          else{
            message.channel.send("Mettez-y du votre aussi !")
          }
        }
      }
    }
  });
}
