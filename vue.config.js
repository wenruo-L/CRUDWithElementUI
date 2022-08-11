module.exports = {
    publicPath: './',
    lintOnSave: false,
    productionSourceMap: false,
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