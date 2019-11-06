const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 负责将html文档虚拟到根目录下
let htmlWebpackPlugin = new HtmlWebpackPlugin({
    // 虚拟的html文件名 index.html
    filename: 'index.html',
    // 虚拟html的模板为 src下的index.html
    template: path.resolve(__dirname, './src/index.html')
})

module.exports = {
    // 开发模式
    mode: 'development',
    // 配置入口文件
    entry: {
        lemon: './src/lemon/js/lemon.js',
        yeyu: './src/yeyu/js/yeyu.js',
        firia: './src/firia/js/firia.js'
    },
    // 出口文件目录为根目录下dist, 输出的文件名为main
    output: {
        path: path.resolve(__dirname, 'dist','js'),
        filename: '[name]boundle.js'
    },
    // 配置开发服务器, 并配置自动刷新
    devServer: {
        // 根目录下dist为基本目录
        contentBase: path.join(__dirname, 'dist'),
        // 自动压缩代码
        compress: true,
        // 服务端口为1208
        port: 1208,
        // 自动打开浏览器
        open: true
    },
    // 装载虚拟目录插件
    plugins: [htmlWebpackPlugin],
    module: {
        rules: [

            {//ES6、JSX处理
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query:
                {
                    presets: ["env", "react"],
                    plugins: [
                        [
                            "import",
                            { libraryName: "antd", style: 'css' }
                        ] //antd按需加载
                    ]
                },
            },

            {//CSS处理
                test: /\.css$/,
                loader: "style-loader!css-loader?modules",
                exclude: /node_modules/,
            },

            {//antd样式处理
                test: /\.css$/,
                exclude: /src/,
                use: [
                    { loader: "style-loader", },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        // 多入口的html文件用chunks这个参数来区分
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'src','lemon','index.html'),
            filename: path.resolve(__dirname,'dist','indexLemon.html'),
            chunks:['lemon'],
            hash:true,//防止缓存
            minify:{
                removeAttributeQuotes:true//压缩 去掉引号
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'src','yeyu','index.html'),
            filename: path.resolve(__dirname,'dist','indexYeyu.html'),
            chunks:['yeyu'],
            hash:true,//防止缓存
            minify:{
                removeAttributeQuotes:true//压缩 去掉引号
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'src','firia','index.html'),
            filename: path.resolve(__dirname,'dist','indexFiria.html'),
            filename:'../indexFiria.html',
            chunks:['firia'],
            hash:true,//防止缓存
            minify:{
                removeAttributeQuotes:true//压缩 去掉引号
            }
        }),
        // new webpack.ProvidePlugin({
        //     _:'lodash' //所有页面都会引入 _ 这个变量，不用再import引入
        // }),
        // new ExtractTextWebapckPlugin('css/[name].[hash].css'), // 其实这个特性只用于打包生产环境，测试环境这样设置会影响HMR
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, 'static'),
        //         to: path.resolve(__dirname, 'dist/static'),
        //         ignore: ['.*']
        //     }
        // ]),
        // new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    ],
}