// ==UserScript==
// @name         Rower Mevo UX
// @namespace    pl.enux.rowermevo
// @version      0.0.2
// @description  [0.0.2] Poprawki UX dla witryny Roweru Mevo.
// @author       Eccenux
// @match        https://rowermevo.pl/*
// @grant        GM_addStyle
// @updateURL    https://github.com/Eccenux/UserScript-better-mevo-UX/raw/master/better-mevo-UX.meta.js
// @downloadURL  https://github.com/Eccenux/UserScript-better-mevo-UX/raw/master/better-mevo-UX.user.js
// ==/UserScript==

(function() {
	'use strict';
	
	/**
		Add CSS.
	*/
	function addCss() {
		var cssText = `
		`;
		GM_addStyle(cssText);
	}
	addCss();


	function fullscreen() {
		//
		// full-screen (właściwie to full-window)
		jQuery('header,footer,.mapWidget,.fePanel,main>.clear').hide();
		jQuery('#map').css('height', '100vh');

		//
		// włączenie przesuwania jednym palcem (lub po kliknięciu myszką)
		map.setOptions({gestureHandling:'greedy'});
	}

	function betterCluster() {
		//
		// więcej szczegółów
		markerCluster.setMaxZoom(13);
		//markerCluster.repaint();

		//
		// lepszy cluster
		markerCluster.setCalculator(function (markers, numStyles) {
			var index = 0;
			var count = markers.length;
			var sum = 0;
			markers.forEach(marker => {
				if (marker.bikesCount) {
					sum += marker.bikesCount;
				}
			});
			//console.log('Calculator', {markers, numStyles, count, sum});
			return {
				text: `${count}(${sum})`,
				index: 1
			};
		});
		markerCluster.repaint();
	}

	if (location.pathname == '/mapa-stacji/') {
		betterCluster();
	}
	if (location.hash.startsWith('#full') {
		fullscreen();
	}
})();