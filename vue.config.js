const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,

  chainWebpack: config => {
    config.resolve.alias
      .set('@images', path.resolve(__dirname, 'public/images'))
  }
})
