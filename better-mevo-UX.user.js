// ==UserScript==
// @name         Rower Mevo UX
// @namespace    pl.enux.rowermevo
// @version      0.1.3
// @description  [0.1.3] Poprawki UX dla witryny Roweru Mevo. Ikony są autorstwa Tunghsiao Liu, CN.
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
		.nux-ux-controls {
			border: 1px solid #384977;
			background: white;
			margin: 0;
			padding: 0;
			position: fixed;
			bottom: 0;
		}
		.nux-ux-controls ul,
		.nux-ux-controls li {
			margin: 0;
			padding: 0;
			list-style: none;
		}
		.nux-ux-controls a {
			display: block;
			box-sizing: border-box;
			width: 35px;
			height: 35px;
			margin: 5px;
			padding: 5px;
		}
		.nux-ux-controls img {
			width: 100%;
		}
		`;
		GM_addStyle(cssText);
	}
	addCss();

	var inFullscreen = false;

	/**
	 * Go full-screen.
	 */
	function fullscreen() {
		if (typeof map !== 'object') {
			return;
		}
		inFullscreen = true;
		toggleState('full');

		//
		// full-screen (właściwie to full-window)
		jQuery('header,footer,.mapWidget,.fePanel,main>.clear').hide();
		jQuery('#map').css('height', '100vh');

		//
		// włączenie przesuwania jednym palcem (lub po kliknięciu myszką)
		map.setOptions({gestureHandling:'greedy'});
	}

	/**
	 * Revert full-screen changes.
	 */
	function revertFullscreen() {
		if (typeof map !== 'object' || !inFullscreen) {
			return;
		}
		inFullscreen = false;
		toggleState('mini');

		//
		// full-screen (właściwie to full-window)
		jQuery('header,footer,.mapWidget,.fePanel,main>.clear').show();
		jQuery('#map').css('height', '80vh');

		//
		// włączenie przesuwania jednym palcem (lub po kliknięciu myszką)
		map.setOptions({gestureHandling:'auto'});
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
				if (marker.bikesCount > 0) {
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

	/**
	 * Add controls (GUI).
	 */
	function addControls() {
		var html = `
			<ul>
				<li class="full"><a href="#full"><img alt="pełny ekran" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBvbHlnb24gZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHBvaW50cz0iNDYuNDI3LDAuMDAzIDEwMC4wMDQsMC4wMDMgMTAwLjAwNCw1My41NzMgICI+PC9wb2x5Z29uPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTMuNTcsMjguNTc0TDc0Ljk5OCw3LjE0NmM0Ljc0My00Ljc0MywxMi45OC00Ljg4MiwxNy44NTYsMCAgIGM0Ljg4Myw0Ljg3Niw0Ljc0MywxMy4xMTQsMCwxNy44NUw3MS40MjcsNDYuNDNjLTQuNzQzLDQuNzQ0LTEyLjk3NSw0Ljg4Mi0xNy44NTYsMEM0OC42ODcsNDEuNTQ3LDQ4LjgyNywzMy4zMSw1My41NywyOC41NzR6Ij48L3BhdGg+PC9nPjxnPjxwb2x5Z29uIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBwb2ludHM9IjUzLjU3LDEwMCAwLDEwMCAwLDQ2LjQzICAiPjwvcG9seWdvbj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQ2LjQyNyw3MS40M0wyNC45OTksOTIuODU3Yy00Ljc0Myw0Ljc0My0xMi45NzQsNC44ODMtMTcuODU2LDAgICBzLTQuNzQzLTEzLjExMywwLTE3Ljg1NmwyMS40MjgtMjEuNDI4YzQuNzQzLTQuNzQ0LDEyLjk3NC00Ljg4MywxNy44NTYsMEM1MS4zMSw1OC40NTUsNTEuMTcsNjYuNjg3LDQ2LjQyNyw3MS40M3oiPjwvcGF0aD48L2c+PC9zdmc+"></a></li>
				<li class="mini"><a href="#"><img alt="zmniejsz" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGcgZGlzcGxheT0ibm9uZSI+PHBhdGggZGlzcGxheT0iaW5saW5lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTgyLjE0MywzNS43MTRMNzEuNDI5LDQ2LjQyOSAgIGMtNC43NDMsNC43NDMtMTIuOTc1LDQuODgzLTE3Ljg1Nywwcy00Ljc0My0xMy4xMTQsMC0xNy44NTdsMTAuNzE1LTEwLjcxNEw0Ni40MjksMEgxMDB2NTMuNTcxTDgyLjE0MywzNS43MTR6Ij48L3BhdGg+PHBhdGggZGlzcGxheT0iaW5saW5lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTM1LjcxNCw4Mi4xNDNMNTMuNTcxLDEwMEgwVjQ2LjQyOWwxNy44NTcsMTcuODU3ICAgbDEwLjcxNC0xMC43MTVjNC43NDMtNC43NDMsMTIuOTc1LTQuODgzLDE3Ljg1NywwczQuNzQzLDEzLjExNCwwLDE3Ljg1N0wzNS43MTQsODIuMTQzeiI+PC9wYXRoPjwvZz48Zz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwLjk1NCw4NC41MjVsLTkuMjg4LDkuMjg0Yy00LjEwOCw0LjExMi0xMS4yNDQsNC4yMy0xNS40NzUsMCAgIGMtNC4yMy00LjIzLTQuMTEyLTExLjM2NiwwLTE1LjQ3Nmw5LjI4NS05LjI4NEwwLDUzLjU3MWg0Ni40MjlWMTAwTDMwLjk1NCw4NC41MjV6Ij48L3BhdGg+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04NC41MjUsMzAuOTU0TDEwMCw0Ni40MjlINTMuNTcxVjBsMTUuNDc2LDE1LjQ3OWw5LjI4Ny05LjI4OCAgIGM0LjEwOC00LjExMiwxMS4yNDUtNC4yMywxNS40NzYsMGM0LjIzLDQuMjMxLDQuMTA4LDExLjM2NywwLDE1LjQ3Nkw4NC41MjUsMzAuOTU0eiI+PC9wYXRoPjwvZz48L3N2Zz4="></a></li>
			</ul>
		`;
		var container = document.createElement('div');
		container.className = 'nux-ux-controls';
		container.style.cssText = `
		`;
		container.innerHTML = html;
		document.querySelector('.fixedPanel').appendChild(container);
	}

	/**
	 * State change.
	 * @param {String} state 
	 */
	function toggleState(state) {
		var container = document.querySelector('.nux-ux-controls');
		if (!container) {
			return;
		}
		var mini = container.querySelector('.mini');
		var full = container.querySelector('.full');
		if (state === 'mini') {
			full.style.display = 'block';
			mini.style.display = 'none';
		} else {
			full.style.display = 'none';
			mini.style.display = 'block';
		}
	}

	/**
	 * Hash sensitive control/enhancement.
	 */
    function hashSpecific() {
        if (location.hash.startsWith('#full')) {
            fullscreen();
        } else {
			revertFullscreen();
		}
    }

	// path sensitive enhancement
	if (location.pathname == '/mapa-stacji/') {
		betterCluster();
		addControls();
		toggleState(inFullscreen ? 'full' : 'mini');

		// hash
		hashSpecific();
		window.addEventListener("hashchange", ()=>{
			hashSpecific();
		}, false);
	}
})();