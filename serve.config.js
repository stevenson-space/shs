const path = require('path');
const historyFallback = require('koa2-history-api-fallback'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  content: [path.resolve(__dirname, 'docs')],
  add(app) {
    app.use(historyFallback());
  },
};
