module.exports = {
    // publicPath: './',//打包后的位置(如果不设置这个静态资源会报404)
    // outputDir: 'dist',//打包后的目录名称
    // assetsDir: 'static',//静态资源目录名称
    devServer: {
        port: 8081,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};