const Discord = require('discord.js');
const fs = require('fs');
const repas = require('./calcul.js');
const client = new Discord.Client();

// récupération du token d'authentification pour le bot

let numToken = fs.readFileSync('./token.json');
numToken = JSON.parse(numToken);
client.login(numToken.token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
  if (msg.content === 'repas') {
    // const partie = sfm.loadSave(msg.author.id);
    const res = repas.calcul(67);
    msg.channel.send('Le taux de glycémie initial est de : ' + res[0]) ;
    msg.channel.send('Le taux de glycémie théorique est de : ' + res[1]);
  }
});
