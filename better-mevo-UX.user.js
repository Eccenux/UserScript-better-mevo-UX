// ==UserScript==
// @name         Rower Mevo UX
// @namespace    pl.enux.rowermevo
// @version      0.0.3
// @description  [0.0.3] Poprawki UX dla witryny Roweru Mevo.
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

	/**
	 * Go full-screen.
	 */
	function fullscreen() {
		if (typeof map !== 'object') {
			return;
		}

		//
		// full-screen (właściwie to full-window)
		jQuery('header,footer,.mapWidget,.fePanel,main>.clear').hide();
		jQuery('#map').css('height', '100vh');

		//
		// włączenie przesuwania jednym palcem (lub po kliknięciu myszką)
		map.setOptions({gestureHandling:'greedy'});
	}

	/**
	 * Better clustering of markers.
	 */
	function betterCluster() {
		if (typeof markerCluster !== 'object') {
			console.warn('[RMUX] markerCluster not defined', markerCluster);
            setTimeout(()=>{betterCluster()}, 1000);
			return;
		}
		console.log('[RMUX] markerCluster ready');

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
			//console.log('[RMUX] Calculator', {markers, numStyles, count, sum});
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
	if (location.hash.startsWith('#full')) {
		fullscreen();
	}
})();