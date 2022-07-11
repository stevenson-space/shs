  // This fixes a webpack thing for the google authentication library.
  module.exports = {
    configureWebpack: (config) => {
      config.resolve.fallback = {
      ...config.resolve.fallback,
      querystring: require.resolve("querystring-es3"),
      };
    }
  }

