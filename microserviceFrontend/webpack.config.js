module.exports = {
    entry: './src/app/index.js',
    output: {
        path: __dirname + '/src/public',
        filename: 'bundle.js'
    },
    module:{
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude:/node_modules/
            }
        ]
    },
    resolve : {
        fallback: {
              // Use can only include required modules. Also install the package.
              // for example: npm install --save-dev assert
              url: require.resolve('url'),
              assert: require.resolve('assert'),
              crypto: require.resolve('crypto-browserify'),
              http: require.resolve('stream-http'),
              https: require.resolve('https-browserify'),
              buffer: require.resolve('buffer'),
              stream: require.resolve('stream-browserify'),
              zlib: require.resolve('browserify-zlib'),
              util: false,
              fs: false,
              os: false,
              path: false,
          }
        },
};

// module.exports = {
//     // ... other webpack config
//   resolve : {
//     fallback: {
//           // Use can only include required modules. Also install the package.
//           // for example: npm install --save-dev assert
//           url: require.resolve('url'),
//           fs: require.resolve('fs'),
//           assert: require.resolve('assert'),
//           crypto: require.resolve('crypto-browserify'),
//           http: require.resolve('stream-http'),
//           https: require.resolve('https-browserify'),
//           os: require.resolve('os-browserify/browser'),
//           buffer: require.resolve('buffer'),
//           stream: require.resolve('stream-browserify'),
//       }
//     },
//     plugins: [
//       new webpack.ProvidePlugin({
//           process: 'process/browser',
//           Buffer: ['buffer', 'Buffer'],
//       })
//     ]
//   }
  
     