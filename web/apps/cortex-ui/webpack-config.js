const nrwlConfig = require("@nrwl/react/plugins/webpack.js");
const dotenv = require("dotenv-webpack");

module.exports = (config) => {
  nrwlConfig(config);
  config.module.rules.push({
    test: /\.css$|\.scss$|\.sass$|\.less$|\.styl$/,
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        path: `${__dirname}/postcss.config.js`
      }
    }
  });
  config.plugins.push(new dotenv({ path: "../.env" }));
  return config;
};
