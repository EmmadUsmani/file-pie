const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

var config = {
  entry: {
    main: "./src/index.ts",
    download: "./src/download.ts",
  },
  devServer: {
    static: "./build",
    watchFiles: "./src",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].bundle_[chunkhash].js",
    clean: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: "src/templates/index.html",
      chunks: ["main"],
    }),
    new HTMLWebpackPlugin({
      filename: "download.html",
      template: "src/templates/download.html",
      chunks: ["download"],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode) {
    config.mode = argv.mode;
  }
  if (argv.mode === "development") {
    config.devtool = "eval-source-map";
  }

  return config;
};
