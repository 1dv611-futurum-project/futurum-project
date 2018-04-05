var webpackConfig = require('./webpack.config.tsx');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['es6-shim', 'mocha', 'chai'],

    files: [
      'test/index.test.tsx'
    ],

    exclude: [
    ],

    preprocessors: {
      'test/index.test.tsx': ['webpack']
    },

    mime : {
        "text/x-typescript":["ts","tsx"]
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
    },

    reporters: ['mocha'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_DEBUG,

    autoWatch: true,

    browsers: ['Chromium_no_sandbox'],
    customLaunchers: {
      Chromium_no_sandbox: {
        base: 'ChromiumHeadless',
        flags: ['--no-sandbox']
      }
    },

    singleRun: false,

    concurrency: Infinity
  })
};