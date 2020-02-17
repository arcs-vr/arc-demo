const Encore            = require('@symfony/webpack-encore')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const path              = require('path')

Encore
  .enableBuildNotifications(true)

  .enableSingleRuntimeChunk()

  .setOutputPath('public')
  .setPublicPath('/')

  .cleanupOutputBeforeBuild(['public/build'])

  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())

  .addEntry('build/main', './src/main.js')

  .configureFilenames({
    js: 'build/js/[name].[contenthash].js',
    css: 'build/css/[name].[contenthash].css',
    images: 'build/images/[name].[hash:8].[ext]',
    fonts: 'build/fonts/[name].[hash:8].[ext]'
  })

  .addExternals({
    three: 'THREE',
    aframe: 'AFRAME'
  })

  .enableVueLoader()
  .enableSassLoader()
  .enablePostCssLoader(function (options) {
    options.config = {
      path: path.join(__dirname, 'postcss.config.js')
    }
  })

  .addLoader({
    test: /\.(wasm)$/,
    type: 'javascript/auto',
    use: {
      loader: 'file-loader',
      options: {
        outputPath: 'assets/wasm', //set this whatever path you desire
        name: '[name]-[hash].[ext]'
      }
    }
  })

  .configureDefinePlugin(options => {
    options.BUILD_DEBUG = JSON.stringify(!Encore.isProduction())
  })

  .configureBabel(
    function (babelConfig) {
      babelConfig.presets[0][1].targets = {
        browsers: 'last 2 versions',
      }
    },
    {
      useBuiltIns: 'entry',
      corejs: '3'
    }
  )

  .configureTerserPlugin(function (options) {
    options.extractComments = false
    options.terserOptions   = {
      output: {
        comments: false
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


const config = Encore.getWebpackConfig()

config.optimization = {
  minimize: Encore.isProduction(),
}

// https://gist.github.com/surma/b2705b6cca29357ebea1c9e6e15684cc
// https://gist.github.com/surma/b2705b6cca29357ebea1c9e6e15684cc#gistcomment-2735059
config.node = {
  fs: "empty"
}

module.exports = config
