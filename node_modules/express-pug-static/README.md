express-pug-static
=============================================================================================================================================

[![npm version](https://badge.fury.io/js/express-pug-static.svg)](https://badge.fury.io/js/express-pug-static)
![Build Status](https://github.com/Adslot/express-pug-static/actions/workflows/node.js.yml/badge.svg)
[![codecov](https://codecov.io/gh/Adslot/express-pug-static/branch/master/graph/badge.svg)](https://codecov.io/gh/Adslot/express-pug-static)

Connect (ExpressJS) middleware for serving pug files as static html

## Installation

    npm install express-pug-static


## Usage

Assume the following structure of your project:

    /views
      /partials
        /file.pug

Let's make pug files from `/views/partials` web accessible:

#### Express prior to 4.0

    var pugStatic = require('express-pug-static');

    app = express();
    app.configure(function() {
      app.use(pugStatic({
        baseDir: path.join(__dirname, '/views/partials'),
        baseUrl: '/partials',
        maxAge: 86400,
        pug: { pretty: true }
      }));
    });

#### Express 4.0


    var pugStatic = require('express-pug-static');

    app = express();
    app.use(pugStatic({
      baseDir: path.join(__dirname, '/views/partials'),
      baseUrl: '/partials',
      maxAge: 86400,
      pug: { pretty: true }
    }));

Now, if you start your web server and request `/partials/file.html` in browser you
should be able see the compiled pug template.

-------------

by [http://adslot.com](http://adslot.com)
