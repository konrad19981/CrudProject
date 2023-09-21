const path = require('path');
const fs = require('fs'); // eslint-disable-line id-length
const pug = require('pug');
const url = require('url');
const assert = require('assert');

const defaultOptions = {
  // Pug options
  pug: {},
  // Serve index.pug if http://someurl/example/ is requested
  serveIndex: true,
  // Valid pug template extensions
  ext: ['.pug'],
  // Allowed request extension
  allowedExt: ['.pug', '.htm', '.html'],
  // Header for Cache-Control: max-age=0
  maxAge: 0,
};


module.exports = (opts) => {
  if (!opts.baseDir) {
    throw new Error('baseDir should be set');
  }

  if (!opts.baseUrl) {
    throw new Error('baseUrl should be set');
  }

  const newOpts = module.exports.getDefaultOptions(opts);

  return function (req, res, next) {
    if (req.originalUrl.indexOf(newOpts.baseUrl) !== 0) {
      return next();
    }

    const filePath = module.exports.getTplPath(req.originalUrl, newOpts);

    if (!filePath) {
      return next();
    }

    if (filePath.indexOf(newOpts.baseDir) !== 0) {
      return res.sendStatus(403);
    }

    fs.stat(filePath, (err, stats) => {
      if (err) {
        return next(err);
      }

      if (!stats.isFile()) {
      return next();
    }

      pug.renderFile(filePath, newOpts.pug, (renderErr, html) => {
        if (renderErr) {
          return next(renderErr);
        }

        res.setHeader('Content-Length', Buffer.byteLength(html));
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        const currentTime = +new Date();
        const expires = new Date(currentTime + newOpts.maxAge);
        res.setHeader('Cache-Control', `max-age=${newOpts.maxAge}`);
        res.setHeader('Expires', expires.toGMTString());
        return res.end(html);
      });
    });
  };
};


module.exports.getDefaultOptions = (opts = {}) => {
  opts = opts || {};
  Object.keys(defaultOptions).forEach((optionName) => {
    if (opts[optionName] === undefined) {
      opts[optionName] = defaultOptions[optionName];
    }
  });
  return opts;
};


module.exports.getTplPath = (requestUrl, opts) => {
  const newOpts = module.exports.getDefaultOptions(opts);
  assert(newOpts.ext && Array.isArray(newOpts.ext), 'newOpts.ext should be provided and be an array');
  assert(newOpts.baseDir, 'newOpts.baseDir should be provided');

  const parsed = url.parse(requestUrl);
  const pathname = parsed.pathname.replace(newOpts.baseUrl, '');
  let requestedExt = path.extname(pathname);
  let pathnameWithoutExt = pathname.substr(0, pathname.length - requestedExt.length);

  if (newOpts.serveIndex && requestedExt === '') {
    // Handle http://example.com/example-path
    if (pathname.substr(-1) !== '/') {
      pathnameWithoutExt += '/';
    }
    // Handle http://example.com/example-path/
    pathnameWithoutExt += 'index';
    requestedExt = newOpts.allowedExt[0];
  }

  // Allow only .html .htm .pug ...
  if (newOpts.allowedExt.indexOf(requestedExt) === -1) {
    return null;
  }

  // Search for an existing template file
  for (let idx = 0; idx < newOpts.ext.length; idx++) {
    const ext = newOpts.ext[idx];
    const filePath = path.join(newOpts.baseDir, pathnameWithoutExt + ext);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
};
