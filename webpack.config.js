const Encore            = require('@symfony/webpack-encore')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const path              = require('path')

Encore
  .enableBuildNotifications(true)

  .enableSingleRuntimeChunk()

  .setOutputPath('public/')
  .setPublicPath('/')

  .cleanupOutputBeforeBuild()

  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())

  .addEntry('main', './src/main.js')

  .configureFilenames({
    js: 'js/[name].[contenthash].js',
    css: 'css/[name].[contenthash].css',
    fonts: 'fonts/[name].[hash:8].[ext]',
    images: 'images/[name].[hash:8].[ext]'
  })

  .addExternals({
    three: 'THREE',
    aframe: 'AFRAME',
  })

  .enableVueLoader(
    (config) => {
      config.transformAssetUrls = {
        'a-asset-item': ['src']
      }
    },
    {
      runtimeCompilerBuild: false
    }
  )
  .enableSassLoader()
  .enablePostCssLoader(function (options) {
    options.config = {
      path: path.join(__dirname, 'postcss.config.js')
    }
  })

  .addLoader({
    test: /\.(gltf)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          esModule: false,
          outputPath: 'models',
          name: '[name].[hash:8].[ext]'
        }
      },
      '@vxna/gltf-loader'
    ]
  })

  .addLoader({
    test: /\.(bin)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          esModule: false,
          outputPath: 'models',
          name: '[name].[hash:8].[ext]'
        }
      }
    ]
  })

  .addLoader({
    test: /\.(fnt)$/,
    use: {
      loader: 'file-loader',
      options: {
        esModule: false,
        outputPath: 'fonts',
        name: '[name].[hash:8].[ext]'
      }
    }
  })

  .addLoader({
    test: /(worker\.min\.js)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'workers/[name].[hash:8].[ext]'
      }
    }
  })

  .copyFiles([
    {
      from: './node_modules/three/examples/js/libs/draco/gltf',
      pattern: /draco_(decoder|wasm_wrapper)\.(js|wasm)/,
      to: '[path][name].[ext]',
    },
  ])

  .configureDefinePlugin(options => {
    options.BUILD_DEBUG = JSON.stringify(!Encore.isProduction())
  })

  .configureBabel(
    () => {},
    {
      useBuiltIns: 'usage',
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

  .configureLoaderRule('images', rule => {
    rule.options.esModule = false
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
  fs: 'empty'
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
  },
]

module.exports = config
