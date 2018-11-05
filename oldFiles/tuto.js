const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Tutoriel pour le jeu
exports.tuto = function tuto() {

}
