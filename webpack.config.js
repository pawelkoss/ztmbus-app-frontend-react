const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js", // app.bundle.js, admin.bundle.js
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
      modules: [
          "node_modules",
          path.resolve(__dirname, "src", "modules")
      ]
  },
  module: {
      rules:[
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                      '@babel/preset-react',
                      '@babel/preset-env',
                ]
                }
          }
        },
        {
          test: /\.css$/i, use: ['style-loader', 'css-loader'],
        },
      ]
      
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    allowedHosts: [
        ".ngrok.io",
    ]
  }
};