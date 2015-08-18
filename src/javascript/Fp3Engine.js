/* Fp3Engine.js
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
        if (opts.clip.accelerated) {


            var isFirefox = navigator.userAgent.indexOf("Firefox") > -1 && navigator.userAgent.indexOf("Windows") > -1;

            if (isFirefox) {

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

        //this.clearProgress();
        //if (this.player.conf.autoplay) this.startProgress();


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
}