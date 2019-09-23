import typescript from 'rollup-plugin-typescript';
import {string} from "rollup-plugin-string";

const prodOrDev = process.env.BUILD === "production" ? 'prod' : 'dev';
const entryPoint = `./src/content-script.${prodOrDev}.ts`;

export default [
    {
        input: entryPoint,
        plugins: [
            typescript(),
            string({
                // Required to be specified
                include: "./src/injectable.js"
            })
        ],
        output: {
            file: '../view/src/assets/content-script.js',
            format: 'iife',
            sourcemap: 'inline',
            name: 'ContentScriptBundle'
        },
        watch: {
            include: 'src/**'
        }
    },
]
