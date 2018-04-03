var webpackConfig = require('./webpack.config.tsx');

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['mocha', 'chai'],

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

    reporters: ['mocha'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    singleRun: false,

    concurrency: Infinity
  })
};