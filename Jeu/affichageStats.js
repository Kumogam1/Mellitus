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
const Discord = require('discord.js');
const myBot = require('./myBot.js');

const imgOpts = {
    format: 'png',
    width: 1000,
    height: 500,
};

exports.graphString = async function(message, partie) {
  const tab = partie.tabGlycemie;
  let max = 0;
  try {
    max = tab.length - 1;
  }
  catch (e) {
    console.log('tab vide');
  }
  const tGlyce = {
    y: partie.tabGlycemie,
    type: 'scatter',
  };

  const intMax = {
    x: [0, max],
    y: [1.3, 1.3],
    mode: 'lines',
    type: 'scatter',
    line: {
      color: '#05ff00',
    },
  };

  const intMin = {
    x: [0, max],
    y: [0.7, 0.7],
    fill: 'tonexty',
    mode: 'lines',
    type: 'scatter',
    line: {
      color: '#05ff00',
    },
  };
  const hyperglycemie = {
    x: [0, max],
    y: [2, 2],
    mode: 'lines',
    type: 'scatter',
    line: {
      color: '#fc0000',
    },
  };
  const hypoglycemie = {
    x: [0, max],
    y: [0.5, 0.5],
    mode: 'lines',
    type: 'scatter',
    line: {
      color: '#fc0000',
    },
  };
  const layout = {
    showlegend: false,
    xaxis: {
      title: 'Periodes',
      rangemode: 'tozero',
      autorange: true,
    },
    yaxis: {
      title: 'Taux de glycemie',
      range: [0, 3],
    },
  };
  const figure = { 'data': [tGlyce, intMax, intMin, hyperglycemie, hypoglycemie], 'layout':layout };

  const chanId = myBot.messageChannel(message, 'informations', partie);

  if(partie.numJour != 0 || partie.partJour != 0) {
    myBot.clear(message)
    .catch((err) => {
      console.log(err);
    });
  }


  const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .addField('**Taux de glycémie**', 'Taux de glycemie : ' + partie.glycemie.toFixed(2).toString() + ' g/L\nIntervalle à atteindre : entre 0.7 g/L et 1.3 g/L');

  plotly.getImage(figure, imgOpts, function(error, imageStream) {
      if (error) return console.log (error);
      const fileStream = fs.createWriteStream('./' + partie.player + '.png');
      const stream = imageStream.pipe(fileStream);
      stream.on('finish', async function() {
        await message.guild.channels.get(chanId).send({ files :['./' + partie.player + '.png'] });
        await message.guild.channels.get(chanId).send({ embed });
      });
  });

};
