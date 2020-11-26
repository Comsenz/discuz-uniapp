const TerserPlugin = require('terser-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isPro = process.env.NODE_ENV === 'production';
const isH5Compiler = process.env.UNI_PLATFORM === 'h5';
const isWXCompiler = process.env.UNI_PLATFORM === 'mp-weixin';

const pwd = process.cwd();
const reg = new RegExp(pwd + '/src/components');

module.exports = {
  assetsDir: 'assets',
  // 通过 Babel 显式转译一个依赖
  transpileDependencies: [],
  lintOnSave: !isPro,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'));
  },
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'chunk-dcloudio', 'index']
    },
  },
  configureWebpack: config => {
    config.plugins = [
      ...config.plugins,
      // new StyleLintPlugin({
      //   files: ['**/*.{vue,scss,css}'],
      // }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '0.0.0.0',
        analyzerPort: 9902
      })
    ];
    // 如果不是 H5，则不进行其它的优化打包操作。避免打包后缺少文件出错
    // 如果没有这个判断，小程序打包后缺少runtime.js等文件会出错
    if (isH5Compiler) {
      config.optimization = {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              warnings: false,
              compress: {
                drop_debugger: isPro,
                drop_console: isPro,
              },
              sourceMap: !isPro,
              cache: true,
              parallel: true,
            },
          }),
        ],
        splitChunks: {
          // enforceSizeThreshold: 1,
          chunks: 'all', // 异步加载的内容也会进行拆包处理
          minChunks: 1,
          automaticNameDelimiter: '~', // 共享模块连接符号
          // automaticNameMaxLength: 30, // 最长的共享模块文件名长度
          maxAsyncRequests: 8, // 并发同步加载数量，相当于拆包数量
          maxInitialRequests: 6, // 动态import的加载数量，相当于动态import的拆包数量
          minSize: 30000, // 单包最小大小（最少5kb）
          name: true,
          cacheGroups: {
            dcloudio: {
              name: 'chunk-dcloudio',
              priority: -10,
              chunks: 'all',
              test: /[\\/]node_modules[\\/]@dcloudio[\\/]/,
              enforce: true,
            },
            common: {
              name: 'chunk-common',
              reuseExistingChunk: true,
              priority: -10,
              test: /[\\/]node_modules[\\/](core-js|cos-js-sdk-v5)[\\/]/,
              enforce: true,
            },
            components: {
              name: 'dzq-cps',
              priority: -10,
              maxSize: (1024 * 1024),
              test: reg,
              enforce: true,
            },
            vendors: {
              name: 'chunk-vendors',
              priority: -20,
              test: /[\\/]node_modules[\\/]/,
              enforce: true,
            },
            vditor: {
              name: 'vditor',
              priority: -10,
              test: /[\\/]node_modules[\\/]vditor[\\/]/,
              enforce: true,
            },
            // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/113
            // mini-css-extract-plugin Conflicting order problem
            default: false,
            
          },
        },
      };
    }
    // 微信小程序在开发阶段也压缩代码，减少代码大小，争取在开发调试阶段可直接预览
    if (isWXCompiler && !isPro) {
      return {
        optimization: {
          minimize: true,
        },
        // https://webpack.docschina.org/configuration/devtool/ 避免开发环境打包出来eval在微信小程序中无法运行
        devtool: 'source-map',
      };
    }
  },
  // https://webpack.docschina.org/configuration/dev-server
  devServer: {
    // port: 8080,
    // 代理请求
    // 更多代理设置请看：https://github.com/chimurai/http-proxy-middleware#options
    proxy: {
      '/api': {
        target: 'https://dq.comsenz-service.com',
        // target: 'http://dev.discuz.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
