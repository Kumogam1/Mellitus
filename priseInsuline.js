const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
let numToken = fs.readFileSync('./token.json');
numToken = JSON.parse(numToken);
client.login(numToken.token);

exports.priseInsuline = function priseInsuline(msg) {
  let insuline = '-1';
  msg.channel.send('Je dois prendre de l\'insuline (entre 0 et 80 unités): ');
  client.on ('message', message => {
    if(!message.author.bot) {
      insuline = message.content;
      calcul(insuline, msg);
    }
  });
}
;

function calcul(poids, message) {
  const doseIntermediaireInitiale = poids / 10;
  const doseIntermediaireTheorique = 0.4 * poids;

  const doseGlicemie = [doseIntermediaireInitiale, doseIntermediaireTheorique];
  message.channel.send('Dose intermédiare initiale : ' + doseGlicemie[0]);
  message.channel.send('Dose intermédiare théorique : ' + doseGlicemie[1]);
}
