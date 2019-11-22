const path = require('path');
const webpack = require('webpack');
const lodash = require('lodash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        // 将 lodash 作为入口编译成动态链接库
        lodash: ['lodash']
    },
    output: {
        // 指定生成文件所在目录
        // 由于每次打包生产环境时都会清空 dist 文件夹，因此将它们放在 public 文件夹下
        path: path.resolve(__dirname, 'public/vendor'),
        // 指定文件名
        filename: '[name].dll.js',
        // 存放动态链接库的全局变量名称，例如对应 lodash 来说就是 lodash_dll_lib
        // 这个名称要与 DllPlugin 插件中的 name 属性对应起来
        // 之所以在前面 _dll_lib 是为了防止全局变量冲突
        library: '[name]_dll_lib',
    },
    plugins: [
        new CleanWebpaclPlugin(['vendor'], {
            root: path.resolve(__dirname, 'public')
        }),
        new FriendlyErrorsPlugin(),

        // 接入 DllPlugin
        new webpack.plugin({
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            // 由于每次打包生产环境时会清空 dist 文件夹，因此将它们放在 public 文件夹下
            path: path.join(__dirname, 'public', 'vendor', '[name].manifest.json'),
            // 动态链接库的全局变量名称，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件中 name 字段的值
            // 例如 lodash.manifest.json 中就有 "name": "lodash_dll_lib"
            name: '[name]_dll_lib'
        })
    ]
};
