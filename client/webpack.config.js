const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

var config = {
  entry: {
    send: "./src/send/index.ts",
    receive: "./src/receive/index.ts",
    about: "./src/about/index.ts",
  },
  devServer: {
    static: "./build",
    watchFiles: "./src",
    proxy: {
      context: () => true,
      target: "http://localhost:3000",
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].bundle_[chunkhash].css",
    }),
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: "src/send/index.html",
      chunks: ["send"],
    }),
    new HTMLWebpackPlugin({
      filename: "receive.html",
      template: "src/receive/index.html",
      chunks: ["receive"],
    }),
    new HTMLWebpackPlugin({
      filename: "about.html",
      template: "src/about/index.html",
      chunks: ["about"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].bundle_[chunkhash].js",
    clean: true,
  },
}

module.exports = (env, argv) => {
  if (argv.mode) {
    config.mode = argv.mode
  }
  if (argv.mode === "development") {
    config.devtool = "eval-source-map"
  }

  return config
}
