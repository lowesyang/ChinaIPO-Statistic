var webpack=require("webpack");
var HtmlWebpackPlugin=require("html-webpack-plugin");
var debug=true;

module.exports={
    entry: {
        index:'./src/index',
        vendor:['vue','vue-router']
    },
    output:{
        path:'./dist',
        filename:'[name].min.js',
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
                loader:'style!css'
            },
            {
                test:/\.(eot|svg|ttf|woff|woff2)(\?\S*)$/,
                loader:'file-loader'
            },
            {
                test:/\.(png|jpe?g|svg|gif)(\?\S*)?$/,
                loader:'file-loader',
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
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:'"production"'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor',debug?'commons.js':'commons.[chunkhash:5].js'),
        new HtmlWebpackPlugin({
            template:'index.html',
            inject:'body'
        })
    ]
}



