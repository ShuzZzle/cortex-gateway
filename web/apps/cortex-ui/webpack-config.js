const nrwlConfig = require("@nrwl/react/plugins/webpack.js");

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
  })
  return config;
};
