import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
export default {
  entry: './lib/index.js',
  targets: [
    { dest: 'dist/es-observable.js', format: 'umd' },
    { dest: 'dist/es-observable.common.js', format: 'cjs' },
    { dest: 'dist/es-observable.esm.js', format: 'es' }
  ],
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
