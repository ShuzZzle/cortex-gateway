module.exports = {
  inputDir: './svgs', // (required)
  outputDir: './src', // (required)
  fontTypes: ["ttf", "woff", "woff2", "svg", "eot"],
  assetTypes: ['ts', 'css', 'html'],
  fontsUrl: '.',
  descent: 40,
  formatOptions: {
    ts: {
      // select what kind of types you want to generate (default `['enum', 'constant', 'literalId', 'literalKey']`)
      types: ['literalId'],
      // render the types with `'` instead of `"` (default is `"`)
      singleQuotes: false
    }
  },
  pathOptions: {
    ts: './src/icons.ts'
  },
};
