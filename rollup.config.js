import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
export default {
  entry: './lib/index.js',
  dest:  'dist/index.js',
  format: 'umd',
  sourceMap: true,
  useStrict: true,
  moduleName: 'Observable',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    buble()
  ]
};
