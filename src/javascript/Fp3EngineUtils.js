/* Fp3EngineUtils.js
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

/*! @source https://github.com/danrossi/flashfp3/blob/master/src/Fp3EngineUtils.js */

function Fp3EngineUtils() {}

Fp3EngineUtils.escapeURL = function(url) {
    return url.replace(/&amp;/g, '%26').replace(/&/g, '%26').replace(/=/g, '%3D');
}

Fp3EngineUtils.toHex = function(bg) {
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!bg) return;

    return '#' + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
}

Fp3EngineUtils.toLongHex = function(bg) {
    if (bg.length === 7) return bg;
    var a = bg.split('').slice(1);
    return '#' + a.map(function(i) {
            return i + i;
        }).join('');
}

/**
 * Flash embedder duplicated as this is not exposed by Flowplayer 6
 */
Fp3EngineUtils.embed = function(swf, flashvars, wmode, bgColor) {
    wmode = wmode || "opaque";

    var id = "obj" + ("" + Math.random()).slice(2, 15),
        tag = '<object class="fp-engine" id="' + id+ '" name="' + id + '" ',
        msie = navigator.userAgent.indexOf('MSIE') > -1,
        common = flowplayer.common;

    tag += msie ? 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' :
    ' data="' + swf  + '" type="application/x-shockwave-flash">';

    var opts = {
        width: "100%",
        height: "100%",
        allowscriptaccess: "always",
        allowFullScreen: true,
        wmode: wmode,
        quality: "high",
        flashvars: "",

        // https://github.com/flowplayer/flowplayer/issues/13#issuecomment-9369919
        movie: swf + (msie ? "?" + id : ""),
        name: id
    };

    if (wmode !== 'transparent') opts.bgcolor = bgColor || '#333333';

    // flashvars
    opts.flashvars = "config=" + JSON.stringify(flashvars).replace(/\s/g, " ");

    // parameters
    Object.keys(opts).forEach(function(key) {
        tag += '<param name="' + key + '" value=\''+ opts[key] +'\'/>';
    });

    tag += "</object>";
    var el = common.createElement('div', {}, tag);
    return common.find('object', el);

};
