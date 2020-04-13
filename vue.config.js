const TerserPlugin = require('terser-webpack-plugin');

const isPro = process.env.NODE_ENV === 'production';
const isH5Compiler = process.env.UNI_PLATFORM === 'h5';

// 如果不是 H5，则不进行其它的优化打包操作。避免打包出错（如果没有这个判断，小程序打包会出错）
if (!isH5Compiler) return;

module.exports = {
  assetsDir: 'assets',
  // 通过 Babel 显式转译一个依赖
  transpileDependencies: [],
  configureWebpack: config => {
    // eslint-disable-next-line no-param-reassign
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
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            priority: 10,
            chunks: 'all',
            test: /[\\/]node_modules[\\/](vue|vuex|js-cookie|vue-i18n|@dcloudio\/uni-h5)[\\/]/,
            enforce: true,
          },
          // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/113
          // mini-css-extract-plugin Conflicting order problem
          default: false,
          common: false,
        },
      },
    };
  },
  // https://webpack.docschina.org/configuration/dev-server
  devServer: {
    // port: 8080,
    // 代理请求
    // 更多代理设置请看：https://github.com/chimurai/http-proxy-middleware#options
    proxy: {
      '/api': {
        target: 'https://discuz.chat',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
