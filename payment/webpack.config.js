
var path = require('path');
var webpack = require('webpack');
var HtmlWebPackPlugin = require("html-webpack-plugin");

var htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./client/index.html",
  filename: "./index.html"
});

module.exports = {
  entry: ['./client/client.js'],
  output: { path: __dirname, filename: 'bundle.js' },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
                      "presets": [
                        ["env", {
                          "targets": {
                            "node": "current"
                          }
                        }],
                        "@babel/preset-react"],
                      "plugins": [
                      "@babel/plugin-transform-modules-commonjs",
                        "@babel/plugin-transform-destructuring",
                        "transform-es2015-parameters",
                        "@babel/plugin-proposal-object-rest-spread",
                        "@babel/plugin-transform-runtime",
                        "babel-plugin-add-module-exports",
                                 [
                          '@babel/plugin-proposal-decorators',
                          {
                            legacy: true,
                          },
                        ],
                        "transform-react-display-name"
                      ],
                      "ignore": [
                        "node_modules/**/*.js"
                      ]
                    }

        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'css-local-loader' },
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true, modules: true, minimize: false, importLoaders: 1, localIdentName: '[local]_[hash:base64:5]' } },
          { loader: 'sass-loader', options: { sourceMap: true, outputStyle: 'expanded', sourceMapContents: true } }
        ]
      }
    ]
  },
  plugins: [htmlWebpackPlugin]
};
