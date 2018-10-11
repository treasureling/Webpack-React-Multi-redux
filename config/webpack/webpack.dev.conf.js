const webpack = require('webpack');
const opn = require('opn');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const webpackFile = require("./file.conf");
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const entry = require("./entry.conf");
const newEntry = {};
for (let name in entry){
  newEntry[name] = ['babel-polyfill','react-hot-loader/patch',entry[name][0]];
}

let config = merge(baseWebpackConfig,{
    mode:"development",
    entry: newEntry,
    output:{
        path:path.resolve(webpackFile.devDirectory),
        filename:"static/js/[name].js",
        chunkFilename:"static/js/[name].js",
        publicPath:""
    },
    optimization:{
        //包清单
        runtimeChunk:{
            name:"manifest"
        },
        //拆分公共包
        splitChunks:{
            cacheGroups:{
                //项目公共组件
                common:{
                    chunks:"initial",
                    name:"common",
                    minChunks:2,
                    maxInitialRequests:5,
                    minSize:0
                },
                vendor:{
                    test:/node_modules/,
                    chunks:"initial",
                    name:"vendor",
                    priority:10,
                    enforce:true
                }
            }
        }
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ],
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                use:[
                    'cache-loader',
                    'babel-loader'
                ],
                include:[
                    path.resolve(__dirname,"../../app"),
                    path.resolve(__dirname,"../../entryJs")
                ],
                exclude:[
                    path.resolve(__dirname,"../../node_modules")
                ]
            },
            /*{
                test: /\.(js|jsx)$/,
                use:[
                    'cache-loader',
                    'babel-loader'
                ],
                include:[
                  path.resolve(__dirname,"../../app"),
                  path.resolve(__dirname,"../../entryJs")
                ],
                query: {
                  plugins: [
                    ["react-transform", {
                      transforms: [{
                        transform: "react-transform-hmr",
                        imports: ["react"],
                        locals: ["module"]
                      }, {
                        "transform": "react-transform-catch-errors",
                        "imports": ["react", "redbox-react"]
                      }]
                    }]
                  ]
                }
            },*/
            {
                test:/\.(js|jsx)$/,
                enforce:'pre',
                use:[
                    {
                        options:{
                            formatter:eslintFormatter,
                            eslintPath:require.resolve('eslint'),
                            // @remove-on-eject-begin
                            baseConfig:{
                                extends:[require.resolve('eslint-config-react-app')]
                            },
                            //ignore:false,
                            useEslintrc:false
                            // @remove-on-eject-end
                        },
                        loader:require.resolve('eslint-loader')
                    }
                ],
                include:[
                    path.resolve(__dirname,"../../app")
                ],
                exclude:[
                    path.resolve(__dirname,"../../node_modules")
                ]
            },
            {
                test:/\.(css|pcss)$/,
                loader:'style-loader?sourceMap!css-loader?sourceMap!postcss-loader?sourceMap',
                /*exclude:/node_modules/*/
            },
            {
                test: /\.*(sass|scss$)/,
                loader:'style-loader?sourceMap!css-loader?sourceMap!sass-loader?sourceMap',
                exclude:/node_modules/
            },
            {
                test: /\.less$/,
                loader:'style-loader?sourceMap!css-loader?sourceMap!less-loader?sourceMap',
                exclude:/node_modules/
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
        ]
    },
    devServer:{
        host:"0.0.0.0",
        port:9080,
        hot:true,
        inline:true,
        contentBase:path.resolve(webpackFile.devDirectory),
        historyApiFallback:true,
        disableHostCheck:true,
        proxy:[
            {
                context:["/api/**","/u/!**"],
                target:"http://127.0.0.1:8080/",
                secure:false
            }
        ],
        after(){
            opn("http://localhost:"+this.port);
        }
    }
});
module.exports = config;