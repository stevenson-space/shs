  // This fixes a webpack thing for the google authentication library.
  module.exports = {
    configureWebpack: (config) => {
        config.resolve.fallback = {
        ...config.resolve.fallback,
        url: false,
        util: false,
        querystring: false,
        https: false,
        };
    }
  }