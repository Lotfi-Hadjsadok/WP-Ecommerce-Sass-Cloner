let mix = require("laravel-mix");

mix.js("src/index.js", "build").react().setPublicPath("build");
