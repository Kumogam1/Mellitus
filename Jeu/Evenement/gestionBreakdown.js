const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../token.json');
client.login(config.token);

exports.calculBk = function(partie, tab, index) {
  let val;
  console.log(tab);
  console.log(index);
  if(partie.obesite == 'oui') {
    val = tab[index][4];
    console.log(val);
  }
  else if (partie.obesite == 'oui') {
    val = tab[index][3];
    console.log(val);
  }
  return val;
};

exports.breakdown = function(message) {
  const embed = new Discord.RichEmbed()
	.setColor(0x00AE86)
	.setTitle('**Crise de nerf**')
	.addField('Vous faites une crise de nerf', 'Vous ne faites rien');

  message.channel.send({ embed })
  .then(async function(mess) {
    mess.react('❌');
  });
}
