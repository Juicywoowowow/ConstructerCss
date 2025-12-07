const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'constructer.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'Constructer',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: false },
          mangle: true,
        },
      }),
    ],
  },
};
