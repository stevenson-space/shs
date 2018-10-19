const path = require('path');
const historyFallback = require('koa2-history-api-fallback');

module.exports = {
  content: [path.resolve(__dirname, 'docs')],
  add(app) {
    app.use(historyFallback());
  },
}