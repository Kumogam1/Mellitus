/* La dose initial est calculé avec le poid du patient, 1 unité pour 10 kg.
Si le patient pèse 80 kg, la première dose sera de 8 unité.

La dose théorique à atteindre est égale à 0.4 x le poid du patient, pour 80 kg en théorie la dose à atteindre sera de 32 unité,
mais le patient ne peut pas passer de 8 à 32 unité d’un coup, l’augmentation doit être graduel.
Celle-ci dépend de la dose théorique si elle est supérieur à 15 unité l’augmentation se fera 2 unité par 2 unités
sinon elle se fera 1 unité par 1 unité.
*/

exports.calcul = function calcul(poids) {
  const doseIntermediaireInitiale = poids / 10;
  const doseIntermediaireTheorique = 0.4 * poids;

  const doseGlicemie = [doseIntermediaireInitiale, doseIntermediaireTheorique];
  return doseGlicemie;
};
