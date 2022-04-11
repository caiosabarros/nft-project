const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")


module.exports = function override(config, env) {
  //do stuff with the webpack config...
  //let plugns = config.plugins;
  //plugns.push(new NodePolyfillPlugin(),);
  //https://stackoverflow.com/questions/70398678/i-tried-to-polyfill-modules-in-webpack-5-but-not-working-reactjs
  //let loaders = config.resolve
  //loaders.fallback = {
  //    "fs": false,
  //    "tls": false,
  //    "net": false,
  //    "http": require.resolve("stream-http"),
  //    "https": false,
  //    "zlib": require.resolve("browserify-zlib") ,
  //    "path": require.resolve("path-browserify"),
  //    "stream": require.resolve("stream-browserify"),
  //    "util": require.resolve("util/"),
  //    "crypto": require.resolve("crypto-browserify")
  //}
  //config.resolve.fallback["stream"] = require.resolve("stream-browserify")

  //Solution 2
  //https://github.com/ChainSafe/web3.js#troubleshooting-and-known-issues
  config.resolve.fallback = {
      url: require.resolve('url'),
      fs: require.resolve('fs'),
      assert: require.resolve('assert'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify'),
  };

  config.plugins.push(
      new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
      }),
  );

  //Adding typescript
  //config.resolve.push({
  //  extensions: ['.ts', '.tsx', '.js']
  //},)

  config.ignoreWarnings = [/Failed to parse source map/];
  return {
    ...config,
    resolve: {
        ...config.resolve,
        plugins: [
            ...config.resolve.plugins,
            new TsconfigPathsPlugin()
        ] 
    }
  };
}

