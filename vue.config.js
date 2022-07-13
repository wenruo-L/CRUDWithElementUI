module.exports = {
    publicPath: process.env.VUE_APP_PATH,
    lintOnSave: true,
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