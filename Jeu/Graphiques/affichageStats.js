
const plotly = require('plotly')('EdouardGU', 'QZcGQlBForcRLDGw5zTj');
const fs = require('fs');
const Discord = require('discord.js');
const myBot = require('../Main/myBot.js');
const finJeu = require('../Main/finJeu.js');

const imgOpts = {
    format: 'png',
    width: 1000,
    height: 500,
};

/** Fonction qui permet de créer et afficher le graphe
* graphString : dessine un graphe dans un string avec du ascii
* bornMax : int : borne max du graph
* bornMin : int : borne min du graph
* nbLignes : int : nombres de lignes pour le graph
* tabDonnes : tab[int] : tableau contenant les donnes pour le graphique
* res : string
**/
exports.graphString = async function(message, partie)
{
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
      title: 'Periode',
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
  const listChan = finJeu.listChan(message, partie);
  let chan;

  listChan.forEach(channel => {
    if(channel.name === 'informations')
    {
      chan = channel;
    }
  });

  if(partie.numJour != 0 || partie.partJour != 0)
  {
    console.log(chan);
    const fetched = await chan.fetchMessages();
    console.log();
    chan.bulkDelete(fetched);
  }

  // Switch qui permet d'obtenir la partie de la journée en string. Qui sera rajouté au titre de l'embed qui accompagne le graphe 
  let partJ;
  switch (partie.partJour)
  {
    case 0:
          partJ = 'du matin';
          break;
    case 1:
          partJ = 'de l\'après-midi';
          break;
    case 2:
          partJ = 'du soir';
          break;
  }

  const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .addField('**Taux de glycémie ' + partJ + '**', 'Taux de glycemie : ' + partie.glycemie.toFixed(2).toString() + ' g/L\nIntervalle à atteindre : entre 0.7 g/L et 1.3 g/L');

  plotly.getImage(figure, imgOpts, function(error, imageStream) {
      if (error) return console.log (error);
      const fileStream = fs.createWriteStream('../Graphiques/' + partie.player + '.png');
      const stream = imageStream.pipe(fileStream);
      stream.on('finish', async function() {
        await message.guild.channels.get(chanId).send({ files :['../Graphiques/' + partie.player + '.png'] });
        await message.guild.channels.get(chanId).send({ embed });
      });
  });

};
