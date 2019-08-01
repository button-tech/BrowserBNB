import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'

export default {
    input: './main.ts',
    plugins: [
        typescript({module: 'CommonJS'}),
        commonjs({extensions: ['.js', '.ts']}) // the ".ts" extension is required
    ],
    output: {
        file: '../view/dist/bnbbrowser/background.js',
        format: 'iife',
        name: 'BackgroundBundle'
    }
}
