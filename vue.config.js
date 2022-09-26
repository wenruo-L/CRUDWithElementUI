module.exports = {
    publicPath: './',
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack:{
        resolve:{
            extensions:['.js', 'css', 'scss', '.vue']
        }
    },
    css: {
        extract: {
            ignoreOrder: true
        }
    },
    devServer: {
        disableHostCheck: true,
        port: 8080,
        open: true,
        hot: true,

    }
}