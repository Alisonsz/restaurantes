const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                    @import "~@/assets/scss/colors.scss";
                    @import "~@/assets/scss/icons.scss";
                    @import "~@/assets/scss/global.scss";
                `
            }
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'https://api.prattuapp.com.br', // URL do servidor Laravel
                changeOrigin: true,
                pathRewrite: { '^/api': '' }, // Opcionalmente remove /api da URL se necessário
            },
            '/broadcasting/auth': {
                target: 'https://api.prattuapp.com.br', // URL do servidor Laravel
                changeOrigin: true,
            },
        },
    }
})
