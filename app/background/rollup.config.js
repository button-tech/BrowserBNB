import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'

const rxjsPathMapping = require('rxjs/_esm2015/path-mapping')()

export default [
    {
        input: './src/background.ts',
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
            sourcemap: 'inline',
            name: 'BackgroundBundle'
        },
        watch: {
            include: 'src/**'
        }
    },
    {
        input: './src/content-script.ts',
        plugins: [
            typescript()
        ],
        output: {
            file: '../view/dist/bnbbrowser/content-script.js',
            format: 'iife',
            sourcemap: 'inline',
            name: 'ContentScriptBundle'
        },
        watch: {
            include: 'src/**'
        }
    },
]
