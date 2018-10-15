/**
* graphString : dessine un graph dans un string avec du ascii
* bornMax : int : borne max du graph
* bornMin : int : borne min du graph
* nbLignes : int : nombres de lignes pour le graph
* tabDonnes : tab[int] : tableau contenant les donnes pour le graphique
* res : string
**/
exports.graphString = function(bornMax, bornMin, nbLignes, tabDonnes) {
  const equartBornes = bornMax - bornMin;
  const tabValLigne = [];
  let res = '';
  for (let i = 0; i < nbLignes; i++) {
    tabValLigne.push(bornMin + (Math.round(equartBornes / nbLignes) * i));
  }
  console.log(tabValLigne);
  for (let i = nbLignes - 1; i >= 0; i--) {
    res = res + '>' + tabValLigne[i] + '\t';
    tabDonnes.forEach(function(value) {
      if (value >= tabValLigne[i]) {
        res = res + '▮ ';
      }
      else {
        res = res + '▯ ';
      }
    });
    res = res + '\n';
  }
  console.log(res);
  return res;
};
