var webpack=require("webpack");
var HtmlWebpackPlugin=require("html-webpack-plugin");
var ExtractTextPlugin=require("extract-text-webpack-plugin");
var path=require("path");
var debug=false;

module.exports={
    entry: {
        index:'./src/index',
        vendor:['vue','vue-router']
    },
    output:{
        path:path.join(__dirname,'/dist'),
        filename:debug?'[name].min.js':'[name].[chunkhash:5].min.js',
        publicPath:'/dist/',
        chunkFilename:'[id].[chunkhash:5].chunk.js'
    },
    module:{
        loaders:[
            {
                test:/\.js[x]?$/,
                loader:'babel',
                exclude:/node_modules/,
                plugins:['transform-time']
            },
            {
                test:/\.css$/,
                loader:debug?'style!css':ExtractTextPlugin.extract('style-loader','css-loader')
            },
            {
                test:/\.(eot|svg|ttf|woff|woff2)(\?\S*)$/,
                loader:'file-loader'
            },
            {
                test:/\.(png|jpe?g|svg|gif)(\?\S*)?$/,
                loader:'url?limit=8192',
                query:{
                    name:'[name].[ext]?[hash]'
                }
            },
            {
                test:/\.vue$/,
                loader:'vue'
            }
        ]
    },
    resolve:{
        extensions:['','.js','.jsx'],
        alias:{
            'vue$':'vue/dist/vue.min.js'
        }
    },
    plugins:[
        // new webpack.DefinePlugin({
        //     'process.env':{
        //         NODE_ENV:'"production"'
        //     }
        // }),
        new ExtractTextPlugin("[name].css"),
        new webpack.optimize.CommonsChunkPlugin('vendor',debug?'commons.js':'commons.[chunkhash:5].js'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'index.html'),
            inject:true,
            minify:{
                removeComments:true,
                collapseWhitespace:true
            }
        })
    ]
}



