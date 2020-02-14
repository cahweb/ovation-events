/**
 * The configuration file for this Vue-CLI project. Sets build paths
 * and provides Webpack configuration that makes the project more
 * easily compatible with WordPress
 * 
 * @author Mike W. Leavitt
 * @since 1.0.0
 */

module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production'
        ? 'wordpress/wp-content/plugins/events-widget/dist/'
        : 'http://localhost:8080/',
    outputDir: './dist',
    configureWebpack: {
        devServer: {
            contentBase: '/wp-content/plugins/events-widget/dist/',
            allowedHosts: ['localhost/wordpress'],
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
        },
        externals: {
            jquery: 'jQuery'
        },
        output: {
            filename: 'js/events-widget.js',
            chunkFilename: 'js/chunk_events-widget.js',
        },
    },
    css: {
        extract: {
            filename: 'css/events-widget.css',
            chunkFilename: 'css/chunk_events-widget.css'
        }
    }
}