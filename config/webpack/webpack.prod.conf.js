const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const webpackFile = require('./file.conf');
const entry = require('./entry.conf');
const webpackCom = require('./com.conf');

process.env.NODE_ENV = 'production'
const entry = require("./entry.conf");
const newEntry = {};
for (let name in entry){
  newEntry[name] = ['babel-polyfill',entry[name][0]];
}
let config = merge(baseWebpackConfig, {
    mode: "production",
    entry: newEntry,
    output: {
        path: path.resolve(webpackFile.proDirectory),
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name]-[id].[chunkhash:8].js'
    },
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                common: {
                    chunks: "initial",
                    name:"common",
                    minChunks: 2,/*拆分前共享一个模块的最小块数*/
                    maxInitialRequests: 5,/*一个入口最大并行请求数 */
                    minSize: 0
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    plugins: [

        new ExtractTextPlugin("static/css/[name].[md5:contenthash:hex:8].css"),
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discarComments: {
                    removeAll: true
                },
                safe: true
            },
            canPrint: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(css|pcss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!postcss-loader"
                })
            },
            {
                test: /\.*(sass|scss$)/,
                use: ExtractTextPlugin.extract({
                  fallback:"style-loader",
                  use:[
                    {
                      loader:"css-loader",
                      options:{
                        modules:true, // 开启css-modules模式,
                        localIdentName: '[local]--[hash:base64:10]',
                        camelCase:false,
                        importLoaders:1,
                      }
                    }
                    ,"sass-loader"
                  ]
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                  fallback:"style-loader",
                  use:[{
                    loader:"css-loader",
                    options:{
                      modules:true,
                      localIdentName: '[local]--[hash:base64:10]',
                    }
                  } ,"less-loader"]
                })
            },
            {
              test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg)$/,
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    limit: 8192,
                    name: 'static/imgs/[name]-[hash:6].[ext]',
                    publicPath:'/'

                  }
                }
              ]
            },
            {
                test: /\.swf$/,
                loader: "file?name=js/[name].[ext]"
            }
        ]
    }
});

let pages = entry;
for (let chunkName in pages) {
    let conf = {
        filename: chunkName + '.html',
        template: 'index.html',
        inject: true,
        title: webpackCom.titleFun(chunkName, pages[chunkName][1]),
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            romoveAtrributeQuotes: true
        },
        chunks: ['manifest', 'vendor', 'common', chunkName],
        hash: false,
        chunksSortMode: 'dependency'
    };
    config.plugins.push(new HtmlWebpackPlugin(conf));
}

config.plugins.push(new CleanWebpackPlugin([webpackFile.proDirectory], {
    root: path.resolve(__dirname, '../../'),
    verbose: true,
    dry: false
}));

// copy custom static assets

let copyObj = [
    /*{from: './app/public/plugin', to: './plugin'},//一些不需要走webpack的插件

    { from: './app/public/versionTips', to: './versionTips'},//固定不变的浏览器版本提示文件

    { from: './app/public/file', to: './resource'},//一些固定的文件，如下载文件*/

    {
      from: path.resolve(__dirname, '../../static'),
      to: 'static',
      ignore: ['.*']
    }
];

let copyArr = [];

copyObj.map((data)=>{
    copyArr.push(
        new CopyWebpackPlugin(
            [
                {
                    from:data.from,
                    to:data.to,
                    ignore:['.*']
                }
            ]
        )
    )
});

copyArr.map(function (data) {
    return config.plugins.push(data);

});

module.exports = config;
