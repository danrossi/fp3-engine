/* Fp3EngineEvents.js
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

/*! @source https://github.com/danrossi/flashfp3/blob/master/src/Fp3EngineEvents.js */

'use strict';
function Fp3EngineEvents(engine) {
    this.engine = engine;
    this.player = engine.player;
    this.extend = flowplayer.extend;
}

Fp3EngineEvents.prototype.onNetStreamEvent = function(e) {
    this.triggerEvent("netstreamevent", e);
}

Fp3EngineEvents.prototype.onUpdate = flowplayer.common.noop;

Fp3EngineEvents.prototype.onStageVideoStateChange = flowplayer.common.noop;

Fp3EngineEvents.prototype.onClipAdd =  flowplayer.common.noop;

Fp3EngineEvents.prototype.onLoad = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBeforeBegin = flowplayer.common.noop;

Fp3EngineEvents.prototype.onConnect = flowplayer.common.noop;

Fp3EngineEvents.prototype.onMouseOut = flowplayer.common.noop;

Fp3EngineEvents.prototype.onMouseOver = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBeforePluginEvent = flowplayer.common.noop;

Fp3EngineEvents.prototype.onResized = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBegin = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBeforePause = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBeforeResume = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBeforeVolume = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBeforeFullscreen = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBeforeUnmute = flowplayer.common.noop;

Fp3EngineEvents.prototype.onUnmute = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBeforeMute = flowplayer.common.noop;

Fp3EngineEvents.prototype.onMute = flowplayer.common.noop;

Fp3EngineEvents.prototype.onBeforeStop = flowplayer.common.noop;

Fp3EngineEvents.prototype.onStop = flowplayer.common.noop;

Fp3EngineEvents.prototype.onPlaylistReplace = flowplayer.common.noop;

Fp3EngineEvents.prototype.triggerEvent = function(type, arg) {
    var event = {
        type: type
    };

    setTimeout(function() { this.player.trigger(event, [this.player, arg]);}.bind(this), 1);
}


Fp3EngineEvents.prototype.onPluginEvent = function(e) {
    this.triggerEvent("pluginevent", e);
}

Fp3EngineEvents.prototype.onMetaDataChange = function(e) {
    this.extend(this.player.video, e[1]);
}

Fp3EngineEvents.prototype.onMetaData = function(e) {
    var arg = this.extend(this.player.video, e[1]);
    this.triggerEvent("ready", arg);
}

Fp3EngineEvents.prototype.onStart = function() {
    this.triggerEvent("resume");
}

Fp3EngineEvents.prototype.onSwitch = function(e) {
    this.triggerEvent("switch", e);
}

Fp3EngineEvents.prototype.onSwitchComplete = function(e) {
    this.triggerEvent("switchcomplete", e);
}

Fp3EngineEvents.prototype.onBufferFull =  function() {
    this.player.video.buffered = true;
    this.triggerEvent("buffered");
}

Fp3EngineEvents.prototype.onBufferEmpty =  function() {
    this.player.video.buffered = false;
    this.triggerEvent("buffer");
}

Fp3EngineEvents.prototype.onPause = function() {
    this.triggerEvent("pause");
    this.engine.clearProgress();
}

Fp3EngineEvents.prototype.onResume = function() {
    this.triggerEvent("resume");
    this.engine.startProgress();
}

Fp3EngineEvents.prototype.onBeforeSeek = function() {
    this.triggerEvent("beforeseek");
}

Fp3EngineEvents.prototype.onSeek = function(e) {
    var arg = (e[1]);
    this.player.video.time = arg;
    this.triggerEvent("seek",  arg);
}

Fp3EngineEvents.prototype.onVolume = function (e) {
    var arg = (e[0] / 100);
    this.triggerEvent("volume", arg);
}

Fp3EngineEvents.prototype.onFullscreen = function () {
    this.player.fullscreen = true;
}

Fp3EngineEvents.prototype.onFullscreenExit = function () {
    this.player.fullscreen = false;
}