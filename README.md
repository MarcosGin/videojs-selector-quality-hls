# videojs-selector-quality-hls

A option in controlbar for select differents qualitys.

## Examples

![Example1](https://github.com/MarcosGin/videojs-selector-quality-hls/blob/master/example-1.png)
![Example2](https://github.com/MarcosGin/videojs-selector-quality-hls/blob/master/example-2.png)
![Example3](https://github.com/MarcosGin/videojs-selector-quality-hls/blob/master/example-3.png)

## Installation

```sh
npm install --save videojs-selector-quality-hls
```

## Usage

To include videojs-selector-quality-hls on your website or web application, use any of the following methods.

### Styles

Don't forget to include the styles

```html
<link href="//path/to/videojs-selector-quality-hls.css" rel="stylesheet" />
```

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-selector-quality-hls.min.js"></script>
<script>
  var player = videojs("my-video");

  player.selectorQuality();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-selector-quality-hls via npm and `require` the plugin as you would any other module.

```js
var videojs = require("video.js");

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require("videojs-selector-quality-hls");

var player = videojs("my-video");

player.selectorQuality();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(["video.js", "videojs-selector-quality-hls"], function(videojs) {
  var player = videojs("my-video");

  player.selectorQuality();
});
```

## License

MIT. Copyright (c) Marcos Gin &lt;marcosgin291@gmail.com&gt;

[videojs]: http://videojs.com/
