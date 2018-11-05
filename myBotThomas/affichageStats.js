/**
* graphString : dessine un graph dans un string avec du ascii
* bornMax : int : borne max du graph
* bornMin : int : borne min du graph
* nbLignes : int : nombres de lignes pour le graph
* tabDonnes : tab[int] : tableau contenant les donnes pour le graphique
* res : string
**/
const plotly = require('plotly')('EdouardGU', 'QZcGQlBForcRLDGw5zTj');
const fs = require('fs');
const Discord = require("discord.js");
const myBot = require('./myBot.js');


const imgOpts = {
    format: 'png',
    width: 1000,
    height: 500,
};

exports.graphString = async function(bornMin, bornMax, tabDonnes, message, partie) {
  const tabValLigne = [bornMin, bornMax];
  /*
  let res = '';
  const equartBornes = bornMax - bornMin;
  const incr = Math.round(equartBornes / nbLignes);
  for (let i = 0; i < nbLignes; i++) {
    tabValLigne.push(bornMin + incr * i);
  }
  console.log(tabValLigne);
  for (let i = nbLignes - 1; i >= 0; i--) {
    res = res + '>' + tabValLigne[i] + '\t';
    tabDonnes.forEach(function(value) {
      if (Math.round(value / incr) == Math.round(tabValLigne[i] / incr)) {
        res = res + '1 ';
      }
      else {
        res = res + '0 ';
      }
    });
    res = res + '\n';
  }
  */

  const trace1 = {
    y: tabDonnes,
    type: 'scatter',
  };
  
  const layout = {
    showlegend: false,
    xaxis: { // wip : nb jour?
      title: "Prise d'insuline",
      rangemode: 'tozero',
      autorange: true,
    },
    yaxis: {
      title: 'Taux de glycemie',
      range: tabValLigne,
    },
  };
  const figure = { 'data': [trace1], 'layout':layout };

  const chanId = myBot.messageChannel(message, "informations", partie);

  async function clear() {
    //message.delete();
    const fetched = await message.guild.channels.get(chanId).fetchMessages({limit: 2});
    message.guild.channels.get(chanId).bulkDelete(fetched);
  }
  
  if(partie.numJour != 0 || partie.partJour != 0){
    clear()
    .catch((err) => {
      console.log(err)
    });
  }


  const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .addField("**Taux de glycémie**", "Taux de glycemie : " + partie.glycemie + " g/L\nIntervalle à atteindre : entre 0.7 g/L et 1.3 g/L")

  plotly.getImage(figure, imgOpts, function(error, imageStream) {
      if (error) return console.log (error);
      const fileStream = fs.createWriteStream('./' + partie.player + '.png');
      const stream = imageStream.pipe(fileStream);
      stream.on('finish', async function() {
        await message.guild.channels.get(chanId).send({ files :['./' + partie.player + '.png'] });
        await message.guild.channels.get(chanId).send({embed});
      });
  });
};
