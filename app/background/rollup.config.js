import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'

const rxjsPathMapping = require('rxjs/_esm2015/path-mapping')()

export default [
    {
        input: './src/background.ts',
        plugins: [
            // globals(),
            // builtins(),
            alias(
                rxjsPathMapping
            ),
            resolve(),
            typescript({module: 'CommonJS'}),
            commonjs({
                // include: 'node_modules/**',
                extensions: ['.js', '.ts']
            }),
        ],
        output: {
            file: '../view/src/assets/background.js',
            format: 'iife',
            sourcemap: 'inline',
            name: 'BackgroundBundle'
        },
        watch: {
            include: [
                'src/**',
                '../view/src/app/services/chrome-api-dto/**'
            ]
        }
    }
]
