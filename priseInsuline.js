const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const sfm = require('./saveFileManagement.js');
let numToken = fs.readFileSync('./token.json');
numToken = JSON.parse(numToken);
client.login(numToken.token);

exports.priseInsuline = function priseInsuline(msg) {
  let insuline = '-1';
  msg.channel.send('Je dois prendre de l\'insuline (entre 0 et 80 unités): ');
  client.on ('message', message => {
    if (message.author.bot) return;
    const partie = sfm.loadSave(message.author.id);
    if (partie.insuline == true) {
      insuline = parseInt(message.content);
      if(insuline < 0 || insuline > 80) {
        msg.channel.send('Entrez une valeur comprise entre 0 et 80 !');
      }
      else {
        calcul(insuline, msg);
        partie.insuline = false;
        sfm.save(message.author.id, partie);
      }
      console.log(insuline);
    }
    });
}
;

function calcul(poids, message) {
  const doseIntermediaireInitiale = poids / 10;
  const doseIntermediaireTheorique = Math.round(0.4 * poids);

  const doseGlicemie = [doseIntermediaireInitiale, doseIntermediaireTheorique];
  message.channel.send('La dose intermédiare initiale à prendre est de ' + doseGlicemie[0] + 'g');
  message.channel.send('La dose intermédiare théorique à atteindre est de ' + doseGlicemie[1] + 'g');
}
