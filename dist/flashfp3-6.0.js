function PropertyBinder() {}

PropertyBinder.copy = function(src, target) {
    for (var p in src) {
        try {
            if ( src[p].constructor==Object ) {
                target[p] = PropertyBinder.copy(src[p], target[p]);

            } else {
               target[p] = src[p];
            }
        } catch(e) {
            target[p] = src[p];
        }
    }

    return target;
}/* Fp3EngineUtils.js
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


Fp3EngineEvents.errorCodes = {
    202: 7
}

Fp3EngineEvents.prototype.onError = function(e) {
    // console.log(e);
    this.triggerEvent("error", { code: Fp3EngineEvents.errorCodes[e[0]]});
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


Fp3EngineEvents.prototype.onBufferStop = flowplayer.common.noop;

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
}/* Fp3Engine.js
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

/*! @source https://github.com/danrossi/flashfp3/blob/master/src/Fp3Engine.js */

'use strict';
function Fp3Engine(player, root) {
    if (!arguments.length) return;
    this.common = flowplayer.common,
        this.bean = flowplayer.bean,
        this.support = flowplayer.support,
        this.player = player,
        this.root = root,
        this.callbackId,
        this.engineName = "flashfp3",
    this.conf = player.conf,
        this.volumeLevel,
        this.callbackId,
        this.config = {
            native_controls : false
        };

    if (player.conf.hasOwnProperty("native_controls")) this.config.native_controls = player.conf.native_controls;

    //set externalinterface callback
    if (!window.flowplayer.hasOwnProperty("fireEvent")) {

        window.flowplayer.extend(flowplayer, {
            fireEvent: function() {
                var a = [].slice.call(arguments);


                //manually call the event object from the callback id
                try {
                    window[a[0]][a[1]](a.slice(2));
                } catch (e) {
                    console.log(a);
                    console.log(e);
                }
            }
        });

    }

    //if use native controls and ui, change the fullscreen api as html can't toggle fullscreen.
    if (this.config.native_controls) {
        var oldFullscreen = player.fullscreen;

        player.fullscreen = function() {

            if (this.player.engine.engineName == "flashfp3" && this.conf.native_controls) {
                oldFullscreen();
            } else {
                try {
                    this.api.fp_toggleFullscreen();
                } catch (e) {
                    console.log(e);
                }

            }

        }.bind(this);
    }
}


Fp3Engine.prototype.pick = function(sources) {
    if (flowplayer.support.flashVideo) {
        var selectedSource;
        for (var i = 0, source; i < sources.length; i++) {
            source = sources[i];
            if (/mp4|flv|flash/i.test(source.type)) selectedSource = source;
            if (selectedSource && !/mp4/i.test(selectedSource.type)) return selectedSource;
            // Did not find any source or source was video/mp4, let's try find more
        }
        return selectedSource; // Accept the fact we don't have anything or just an MP4
    }
}


Fp3Engine.prototype.load = function(video) {

    var common = this.common,
        html5Tag = common.find("video", this.root)[0],
        url = Fp3EngineUtils.escapeURL(video.src),
        is_absolute = /^https?:/.test(url);

    var removeTag = function() {
        common.removeNode(html5Tag);
    };
    var hasSupportedSource = function(sources) {
        return sources.some(function(src) {
            return !!html5Tag.canPlayType(src.type);
        });
    };

    if (flowplayer.support.video &&
        common.prop(html5Tag, 'autoplay') &&
        hasSupportedSource(video.sources)) bean.one(html5Tag, 'timeupdate', removeTag);
    else removeTag();

    // convert to absolute
    var rtmp = video.rtmp || this.conf.rtmp, isRtmp = !is_absolute && rtmp;
    if (!isRtmp) url = common.createAbsoluteUrl(url);



    if (this.api) {

        //if we are in a playlist play the specific index rather than replace the playlist
        if (this.conf.playlist.length) {
            this.api.fp_play(video.index);
            return;
        }

        var clip = {
            url: url,
            autoPlay: true
        };

        PropertyBinder.copy(clip, video);

        this.api.fp_play(clip);

    } else {


        this.player.on("mute", function(event, player, muted) {
            if (muted)
                this.api.fp_mute();
            else
                this.api.fp_unmute();
        }.bind(this));


        this.callbackId = "fpCallback" + ("" + Math.random()).slice(3, 15);


        // issue #733
        var bgColor = common.css(this.root, 'background-color') ||'', bg;
        if (bgColor.indexOf('rgb') === 0) {
            bg = Fp3EngineUtils.toHex(bgColor);
        } else if (bgColor.indexOf('#') === 0) {
            bg = Fp3EngineUtils.toLongHex(bgColor);
        }




        var opts = {
            clip: {
                url: url,
                autoPlay: this.player.conf.autoplay,
                autoBuffering: !this.player.conf.autoplay,
                //autoBuffering: !this.player.conf.autoplay && !this.player.conf.native_controls,
                //accelerated: this.player.conf.wmode == "direct"
                accelerated: true
                //onCuepoint: player.conf.cuepoints
            },
            screen: {
                backgroundColor: bg,
                backgroundGradient: "none"
            },
            canvas: {
                backgroundColor: bg,
                backgroundGradient: "none"
            },
            plugins: {},
            playerId : this.callbackId
        };


        //if using native controls disable the overlay ui
        if (this.config.native_controls) {
            var ui = common.find(".fp-player", this.root)[0];
            common.css(ui, "display", "none");



            flowplayer.bean.off(this.root, "click.player");

           // common.css(this.root, "pointer-events", "none");
            //common.css(this.root, "z-Index", -100);

           // common.removeNode(ui);

            this.player.off("mouseenter click");

            this.player.one("ready", function() {
                common.removeClass(this.root, "is-poster");

            }.bind(this));
        } else {
            //disable the built in controls and play button when using html controls
            opts.plugins.controls = null;
            opts.play = null;
        }


        //if we have a playlist generat the fp3 playliast
        if (this.conf.playlist.length) {

            var playlist = [];

            this.conf.playlist.forEach(function(index) {
                var sources = this.conf.playlist[index].sources;

                var clip = {
                    url: this.pick(sources).src
                };

                //copy specific configs for each playlist item
                if (this.conf.playlist[index].flash) this.extend(clip, this.conf.playlist[index].flash);

                playlist.push(clip);
            }.bind(this));

            opts.playlist = playlist;

        }

        //copy specific configs to use for the embed including clip and plugin properties
        PropertyBinder.copy(this.conf.flash,opts);


        // bufferTime might be 0
        if (this.conf.bufferTime !== undefined) opts.bufferTime = this.conf.bufferTime;

        //configure the rtmp provider if configured
        if (isRtmp) {
            opts.clip.provider = "rtmp";
            opts.clip.netConnectionUrl = this.conf.rtmp;
        }



        //enable gpu acceleration stagevideo fix for Windows Firefox. All other browsers can accept different wmodes.
        if (flowplayer.support.browser.mozilla && opts.clip.accelerated) {
            this.conf.wmode = "direct";
            common.toggleClass(this.root, "is-accelerated");

            delete opts["play"];


           /* var container = common.createElement('div', { className: "flowplayer is-paused" , css: {display: "block" } });
            var ui = common.createElement('div', { className: "fp-ui" , css: {  display: "block", width: "100%", height: "100%" } });

            common.append(container,ui);

            var ui2 = common.find('.fp-ui', container)[0];

            var url = common.css(ui2, "backgroundImage").replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');

            //console.log(url);

            opts.play = {
                url:  url
            }

            container = null;
            ui = null;*/
        }


        this.api = Fp3EngineUtils.embed(this.conf.swf, opts, this.conf.wmode, bg)[0];


        //if we are using native controls append to the root rather than the ui.
        if (this.config.native_controls) {
            common.prepend(this.root, this.api);
        } else {
            var container = common.find('.fp-player', this.root)[0];
            common.prepend(container, this.api);
        }

       /* var playerContainer = common.find('.fp-player', this.root)[0];
        var container = common.createElement('div', { css: { "z-index":1, position: "absolute", display: "inline-block", width: "100%", height: "100%" } });
        common.append(container, this.api);
        common.prepend(this.root, container);*/

        //var iframe = common.createElement('iframe', { css: { background: "#333333", alpha: 0.8, "z-index":99, position: "absolute", display: "block", width: "100%", height: "100%" } });

        //common.insertAfter(this.root, container, iframe);


       // var ui = common.find(".fp-player", this.root)[0];

       // common.css(ui, { "z-index": 1000, position:"absolute" });

        //var fs = common.createElement('a', { className: "fp-fullscreen1"});

        //var ui2 = common.find(".fp-ui", this.root)[0];


        //common.append(ui2, fs);




        // throw error if no loading occurs
        // detect disabled flash
        this.checkLoaded();

        this.clearProgress();
        if (this.player.conf.autoplay) this.startProgress();


        var events = new Fp3EngineEvents(this);

        window[this.callbackId] = events;

    }

}

Fp3Engine.prototype.checkLoaded = function() {
    setTimeout(function() {
        try {
            if (!this.api.PercentLoaded()) {
                return this.player.trigger("error", [this.player, { code: 7, url: conf.swf }]);
            }
        } catch (e) {}
    }.bind(this), 5000);

    setTimeout(function() {
        if (typeof this.api.PercentLoaded === 'undefined') {
            this.player.trigger('flashdisabled', [this.player]);
        }
    }.bind(this), 1000);
}

Fp3Engine.prototype.startProgress = function() {
    this.api.pollInterval = setInterval(this.updateProgress.bind(this), 250);
}

Fp3Engine.prototype.clearProgress = function() {
    clearInterval(this.api.pollInterval);
}

Fp3Engine.prototype.updateProgress = function () {
    if (!this.api) return;

    var status = this.api.fp_getStatus(), video = this.player.video;

    if (!status) return;

    if (this.player.playing && status.time && status.time !== this.player.video.time) this.triggerEvent("progress", status.time);

    video.buffer = status.buffer / video.bytes * video.duration;

    this.triggerEvent("buffer", video.buffer);

    if (!video.buffered && status.time > 0) {
        video.buffered = true;
        this.triggerEvent("buffered");
    }
}

Fp3Engine.prototype.pause = function() {
    this.callMethod("pause");
}

Fp3Engine.prototype.resume = function() {
    this.callMethod("resume");
}

Fp3Engine.prototype.speed = flowplayer.common.noop;

Fp3Engine.prototype.seek = function(time) {
    if (this.player.video.time && !this.player.paused) {
        this.player.trigger("beforeseek");
    }
    this.callMethod("seek", time);
}

Fp3Engine.prototype.volume = function(level) {
    this.volumeLevel = level;
    try {
        this.api.fp_setVolume(level * 100);
    } catch (e) {}
}

Fp3Engine.prototype.getPlugin = function(name) {
    this.api.fp_getPlugin(name);
}

/*Fp3Engine.prototype.callPluginMethod = function(name, method, arg) {
    var a = [].slice.call(arguments, 2);
    return this.api.fp_invoke(name, method, [arg]);
}*/

Fp3Engine.prototype.callMethod = function(name, arg) {
    try {
        if (this.player.ready) {
            if (arg === undefined) {
                this.api["fp_" + name]();

            } else {
                this.api["fp_" + name](arg);
            }
        }
    } catch (e) {
        if (typeof this.api["fp_" + name] === 'undefined') { //flash lost it's methods
            return this.player.trigger('flashdisabled', [this.player]);
        }
        throw e;
    }
}

Fp3Engine.prototype.unload = function() {
    if (this.api && this.api.__unload) this.api.__unload();
    if (this.callbackId && window[this.callbackId])delete window[this.callbackId];
    this.common.find("object", this.root).forEach(this.common.removeNode);
    this.api = 0;
    this.player.off('.flashengine');
    this.clearProgress();
}

Fp3Engine.prototype.triggerEvent = function (event, arg) {
    this.player.trigger(event, [this.player, arg]);
}/* flashfp3.js
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
