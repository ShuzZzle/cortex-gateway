const configure = require("@nrwl/react/plugins/webpack");

module.exports = (config) => {
  configure(config);

  config.module.rules.push({
    test: /\.css$/,
    use: ["postcss-loader"]
  });

  return config;
}
