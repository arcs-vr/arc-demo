const Encore = require('@symfony/webpack-encore')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')

Encore
  .enableSingleRuntimeChunk()
  .splitEntryChunks()

  .setOutputPath('public/')
  .setPublicPath('/')

  .cleanupOutputBeforeBuild()

  .addEntry('main', './src/main.js')

  .addExternals({
    three: 'THREE',
    aframe: 'AFRAME'
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
      from: './node_modules/super-three/examples/js/libs/draco/gltf',
      pattern: /draco_(decoder|wasm_wrapper)\.(js|wasm)/,
      to: '[path][name].[ext]'
    }
  ])

  .configureImageRule(
    {
      type: 'asset',
      maxSize: 8 * 1024,
      filename: 'images/[name].[fullhash:8].[ext]'
    },
    rule => {
      // do not handle files in gltf models
      rule.exclude = /models/
    }
  )

  .addLoader({
    test: /models.*\.(bin|png|jpe?g|gif)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[path][name].[fullhash:8].[ext]',
        esModule: false
      }
    }
  })

  .configureFontRule({
    type: 'asset',
    filename: 'fonts/[name].[fullhash:8].[ext]'
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
        output: {
          comments: false
        }
      }
    })
    .configureFilenames({
      js: '[name].[contenthash].js',
      css: '[name].[contenthash].css'
    })
}

if (Encore.isDevServer()) {
  Encore
    .disableCssExtraction()
    .enableSourceMaps()
    .configureDevServerOptions(options => {
      options.https = {
        pfx: path.join(process.env.HOME, '.symfony/certs/default.p12')
      }
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
