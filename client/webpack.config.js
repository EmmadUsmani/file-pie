const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")

var config = {
  entry: {
    send: "./src/send/index.ts",
    receive: "./src/receive/index.ts",
  },
  devServer: {
    static: "./build",
    watchFiles: "./src",
    proxy: {
      context: () => true,
      target: "http://localhost:3000",
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
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
      template: "src/send/index.html",
      chunks: ["send"],
    }),
    new HTMLWebpackPlugin({
      filename: "receive.html",
      template: "src/receive/index.html",
      chunks: ["receive"],
    }),
  ],
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
