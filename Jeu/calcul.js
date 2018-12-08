/* La dose initial est calculé avec le poid du patient, 1 unité pour 10 kg.
Si le patient pèse 80 kg, la première dose sera de 8 unité.

La dose théorique à atteindre est égale à 0.4 x le poid du patient, pour 80 kg en théorie la dose à atteindre sera de 32 unité,
mais le patient ne peut pas passer de 8 à 32 unité d’un coup, l’augmentation doit être graduel.
Celle-ci dépend de la dose théorique si elle est supérieur à 15 unité l’augmentation se fera 2 unité par 2 unités
sinon elle se fera 1 unité par 1 unité.
*/

const calcul = require('./calcul.js');

exports.doses = function doses(partie) {
	const doseInit = partie.poids / 10;
	const doseObj = 0.4 * partie.poids;
	let augmentation = 0;

	if(doseObj < 15)
		augmentation = 1
	else
		augmentation = 2

	const doseGlycemie = [doseInit, doseObj, augmentation];
	return doseGlycemie;
};

exports.glyMatin = function glyMatin(partie){
	let tauxAvantHier = 0;
	if(partie.tabGlycemie.length > 4)
		tauxAvantHier = partie.tabGlycemie[partie.tabGlycemie.length - 5];
	else
		tauxAvantHier = partie.tabGlycemie[0];

	const tauxHier = partie.glycemie;
	let res = 0;

	if(tauxHier > 1.3 || tauxHier < 0.7){
		res = partie.tabGlycemie[0] + (Math.round(Math.abs(tauxAvantHier - tauxHier) * 100) / 100) * 0.2;
	}
	else{
		res = partie.tabGlycemie[0] + (tauxHier - 1.3);
	}

	partie.glycemie = res;
	partie.tabGlycemie.push(res);
};

exports.glyInsu = function glyInsu(partie, dose){
	const tauxInit = partie.tabGlycemie[0];
	const tauxPresent = partie.glycemie;
	let res = 0;

	const delta = Math.abs(tauxInit - 1.3);
	const effect = delta / 32/*calcul.doses(partie)[1]*/;

	res = Math.round((tauxPresent - Math.abs(dose * effect))*100)/100;

	if(res < 0)
		res = 0;

	partie.glycemie = res;
	partie.tabGlycemie.push(res);
}
