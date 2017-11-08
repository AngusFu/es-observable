import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
export default {
  input: './lib/index.js',
  output: [
    { file: 'dist/es-observable.js', format: 'umd' },
    { file: 'dist/es-observable.common.js', format: 'cjs' },
    { file: 'dist/es-observable.esm.js', format: 'es' }
  ],
  strict: true,
  name: 'Observable',
  sourcemap: true,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    buble()
  ]
}
