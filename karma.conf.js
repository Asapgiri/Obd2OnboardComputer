var webpackConfig = require('./webpack.test');

module.exports = function (config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [{
      pattern: './spec-bundle.js',
      watched: false
    }],

    preprocessors: {
      './spec-bundle.js': ['electron', 'coverage', 'webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    coverageReporter: {
      dir: '../coverage/',
      reporters: [{
        type: 'text-summary',
        type: 'json',
        type: 'html',
      }]
    },

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Electron'],
    singleRun: true,

    client: {
      useIframe: false
    }
  };

  config.set(_config);
};
