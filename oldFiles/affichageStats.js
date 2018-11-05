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


const imgOpts = {
    format: 'png',
    width: 1000,
    height: 500,
};

exports.graphString = function(bornMin, bornMax, tabDonnes, message) {
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
      title: 'Jour',
      rangemode: 'tozero',
      autorange: true,
    },
    yaxis: {
      title: 'Taux',
      range: tabValLigne,
    },
  };
  const figure = { 'data': [trace1], 'layout':layout };

  plotly.getImage(figure, imgOpts, function(error, imageStream) {
      if (error) return console.log (error);
      const fileStream = fs.createWriteStream('1.png');
      const stream = imageStream.pipe(fileStream);
      stream.on('finish', () =>{
      message.channel.send('test', { files :['./1.png'] });
    });
  });

};
