/* flashfp3.js
 * Flowplayer 3 Flash Engine for Flowplayer 6
 * This is to provide full embed support for Flowplayer 3 including plugins and features.
 * 2015-06-15
 *
 * By Daniel Rossi, Electroteque Media http://flowplayer.electroteque.org/flashfp3/fp6
 * License: X11/MIT
 *   See https://github.com/danrossi/audio-engine/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source https://github.com/danrossi/flashfp3/blob/master/src/flashfp3.js */

'use strict';

function Fp3EngineWrapper(player, root) {
    return new Fp3Engine(player, root);
}

var fp3Engine = Fp3EngineWrapper;


fp3Engine.engineName = 'flashfp3';

fp3Engine.canPlay = function(type, conf) {
    return flowplayer.support.flashVideo && /video\/(mp4|flash|flv)/i.test(type);
};

flowplayer.engines.unshift(fp3Engine);
