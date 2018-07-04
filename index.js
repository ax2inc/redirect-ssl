const isHTTPS = require('is-https');

// Default options
const defaults = {
  xForwardedProto: true,
  redirectPort: 443,
  redirectHost: undefined,
  redirectUnknown: true,
  statusCode: 307,
  redirect: process.env.NODE_ENV === 'production',
};

// Creates new middleware using provided options
function create(options) {
  const {
    xForwardedProto, redirectPort, redirectHost, statusCode, redirectUnknown, redirect,
  } = Object.assign({}, defaults, options);
  const port = redirectPort === 443 ? '' : (`: ${redirectPort}`);

  return function redirectSSL(ctx, next) {
    const { req, res } = ctx;
    if (redirect) {
      const isHttpsReq = isHTTPS(req, xForwardedProto);
      const shouldRedirect = isHttpsReq === false || (redirectUnknown && isHttpsReq === null);
      if (shouldRedirect) {
        const ـredirectURL = `https://${redirectHost || req.headers.host}${port}${req.url}`;
        res.writeHead(statusCode, { Location: ـredirectURL });
        return res.end();
      }
    }

    return next();
  };
}

// Create a new instance using defaults
const instance = create({});

// Assign create to instance
instance.create = create;

// Export default instance
module.exports = instance;
