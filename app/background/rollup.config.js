import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import alias from 'rollup-plugin-alias';
import resolve from 'rollup-plugin-node-resolve';

const rxjsPathMapping = require('rxjs/_esm2015/path-mapping')();

export default {
    input: './main.ts',
    plugins: [
        alias(
            rxjsPathMapping
        ),
        resolve(),
        typescript({module: 'CommonJS'}),
        commonjs({extensions: ['.js', '.ts']})
    ],
    output: {
        file: '../view/dist/bnbbrowser/background.js',
        format: 'iife',
        sourcemap: true,
        name: 'BackgroundBundle'
    }
}
