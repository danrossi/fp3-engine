flashfp3.js
============

The Flowplayer 3 Flash Engine for Flowplayer 6 enables features not enabled by the default Flash player including plugin support and GPU acceleration playback.

This is mainly for a future feature for Widevine Classic and Modular DASH support, Flash Access and HDS streaming.

Customised main players will have to be devised also as the default Flash is too restrictive for other streaming providers and it will lose native fullscreen support.

Native fullscreen in Flash and GPU accelerated playback is desireable for performance reasons.

GPU accelerated playback is enabled by default and can be disabled with clip: { accelerated: false }.

For Flowplayer 6 controls and overlays css fixes are required for Windows Firefox which requires a wmode of "direct" where other browsers will enable GPU mode in opaque wmode.



Any of the plugins i.e Ads can be loaded here which I believe is what DFP Ads is still using for playback.


Examples
--------

### Basic Example

```javascript
$(function () {

            api = flowplayer("#player", {
                clip: {
                    sources: [
                        {type: "video/mp4", src: "http://videos.electroteque.org/big_buck_bunny_400k.mp4"},
                        {type: "video/ogg", src: "http://videos.electroteque.org/big_buck_bunny_480p_h264.ogv"},
                        {type: "video/flash", src: "mp4:big_buck_bunny_400k.mp4"}
                    ]
                    //autoPlay: true
                },
                wmode: "direct",
                embed: false,
                autoplay: false,
                native_controls: false,
                swf: "flowplayer-3.2.18.swf",
                flash: {
                    key: "yourkeyhere",
                    clip: {
                        //autoPlay: true
                    },
                    //configure the rtmp plugin
                    plugins: {
                        rtmp: { url: "flowplayer.rtmp-3.2.13.swf" }
                    },
                    log: {
                        level: "debug",
                        filter: "org.flowplayer.controller.*"
                    }
                },
                rtmp:"rtmp://rtmp.electroteque.org/cfx/st"
            });


        });

```

Compiling
------------

The `flashfp3.js` distribution file is compiled with Uglify.js like so:

```bash
make min
```

Support
--------

This is supplied as-is.

Demo
------------

Fully functional demo available on the audio player features page http://flowplayer.electroteque.org/flashfp3/fp6
