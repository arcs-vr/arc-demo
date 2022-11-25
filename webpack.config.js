const Encore = require('@symfony/webpack-encore')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')

Encore
  .addPlugin(new NodePolyfillPlugin())

  .enableSingleRuntimeChunk()
  .splitEntryChunks()

  .configureSplitChunks(options => {
    Object.assign(options, {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name (module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `vendor/${packageName.replace('@', '')}`
          }
        }
      }
    })
  })

  .setOutputPath('public/')
  .setPublicPath('/')

  .cleanupOutputBeforeBuild()

  .addEntry('main', './src/main.js')

  .addExternals({
    three: 'THREE',
    aframe: 'AFRAME'
  })

  .enableVueLoader(
    () => {
    },
    {
      runtimeCompilerBuild: false
    }
  )

  .enableSassLoader()

  .addLoader({
    test: /\.(fnt)$/,
    use: {
      loader: 'file-loader',
      options: {
        esModule: false,
        outputPath: 'fonts',
        name: '[name].[contenthash].[ext]'
      }
    }
  })

  .addLoader({
    test: /(worker\.min\.js)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'workers/[name].[contenthash].[ext]'
      }
    }
  })

  .copyFiles([
    {
      from: './node_modules/super-three/examples/js/libs/draco/gltf',
      pattern: /draco_(decoder|wasm_wrapper)\.(js|wasm)/,
      to: '[path][name].[ext]'
    },
    {
      from: './assets/models',
      to: 'models/[path][name].[ext]'
    }
  ])

  .configureImageRule(
    {
      type: 'asset',
      maxSize: 8 * 1024,
      filename: 'images/[name].[contenthash:8][ext]'
    },
    rule => {
      // do not handle files in gltf models
      rule.exclude = /models/
    }
  )

  .configureFontRule({
    type: 'asset',
    filename: 'fonts/[name].[contenthash:8][ext]'
  })

  .addLoader({
    test: /models.*\.(png|jpe?g|gif)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '/[path][name].[contenthash:8].[ext]',
        esModule: false
      }
    }
  })

  .addPlugin(new HtmlWebPackPlugin({
    filename: 'index.html',
    template: path.resolve(__dirname, './src/index.html'),
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    },
    nodeModules: false
  }))

if (Encore.isProduction()) {
  Encore
    .enablePostCssLoader()
    .enableVersioning()
    .configureTerserPlugin(function (options) {
      options.extractComments = false
      options.parallel = true
      options.terserOptions = {
        keep_classnames: false,
        mangle: true,
        compress: true,
        keep_fnames: false,
        output: {
          comments: false
        }
      }
    })
    .configureFilenames({
      js: '[name].[contenthash:8].js',
      css: '[name].[contenthash:8].css'
    })
}

const config = Encore.getWebpackConfig()

config.optimization = {
  minimize: Encore.isProduction()
}

// https://github.com/webpack/webpack/issues/8412
// https://github.com/webpack/webpack/issues/6725#issuecomment-372182505
config.module.defaultRules = [
  {
    type: 'javascript/auto',
    resolve: {}
  },
  {
    test: /\.json$/i,
    type: 'json'
  }
]

module.exports = config
