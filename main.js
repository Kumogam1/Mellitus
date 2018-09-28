const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();


//récupération du token d'authentification pour le bot
let settings = fs.readFileSync('./token.json');
token = JSON.parse(settings);
client.login(token.token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});
