import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: './src/moment.js',
  output: {
    file: `dist/le-moment.min.js`,
    format: 'es',
  },
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      // plugins: ['external-helpers'],
      externalHelpers: true,
      runtimeHelpers: true
    })
  ]
}