/**
 * webpack 构建时有三个比较类似的API：
 * webpackConfig.context，指定webpack构建的基础目录
 * process.cwd()，当前工作目录，node进程目录，一般是package.json在的那个目录
 * __dirname/__filename，node载入模块时wrap方法的倆实参，就是文件绝对路径
 */

const fs = require('fs');
const path = require('path');
const packageInfo = require('./package.json');

// 该编译辅助函数重写了 /lib/version/index.js 和 /lib/version/index.d.ts 的版本号
// 以及新建 /lib/style/components.less 文件，并批量@import了基础组件的样式文件
function finalizeCompile() {
  if (fs.existsSync(path.join(__dirname, './lib'))) {
    // // Build package.json version to lib/version/index.js
    // // prevent json-loader needing in user-side
    // // 这句话是指生成文件的.js后缀
    // const versionFilePath = path.join(process.cwd(), 'lib', 'version', 'index.js');
    // const versionFileContent = fs.readFileSync(versionFilePath).toString();
    // fs.writeFileSync(
    //   versionFilePath,
    //   versionFileContent.replace(
    //     /require\(('|")\.\.\/\.\.\/package\.json('|")\)/,
    //     `{ version: '${packageInfo.version}' }`,
    //   )
    // )
    // // eslint-disable-next-line
    // console.log('Wrote version into lib/version/index.js');

    // // Build package.json version to lib/version/index.d.ts
    // // prevent https://github.com/ant-design/ant-design/issues/4935
    // const versionDefPath = path.join(process.cwd(), 'lib', 'version', 'index.d.ts');
    // fs.writeFileSync(
    //   versionDefPath,
    //   `declare var _default: "${packageInfo.version}";\nexport default _default;\n`,
    // );
    // // eslint-disable-next-line
    // console.log('Wrote version into lib/version/index.d.ts');

    // Build a entry less file to dist/antd.less
    const componentsPath = path.join(process.cwd(), 'components');
    let componentsLessContent = '';
    // Build components in one file: lib/style/components.less
    fs.readdir(componentsPath, (err, files) => {
      files.forEach(file => {
        if (fs.existsSync(path.join(componentsPath, file, 'style', 'index.less'))) {
          componentsLessContent += `@import "../${path.join(file, 'style', 'index.less')}";\n`;
        }
      });
      fs.writeFileSync(
        path.join(process.cwd(), 'lib', 'style', 'components.less'),
        componentsLessContent,
      );
    });
  }
};

// 该辅助函数仅导入了两个css文件路径，
// 一般CSS抽包插件较流行的有 ExtractTextWebpackPlugin 和 mini-css-extract-plugin，
// 这里选用了后者。
function finalizeDist() {
  if (fs.existsSync(path.join(__dirname, './dist'))) {
    // Build less entry file: dist/antd.less
    fs.writeFileSync(
      path.join(process.cwd(), 'dist', 'antd.less'),
      '@import "../lib/style/index.less";\n@import "../lib/style/components.less";',
    );
    // eslint-disable-next-line
    console.log('Built a entry less file to dist/antd.less');
  }
}

// 导出格式配合了构建工具
module.exports = {
  compile: {
    finalize: finalizeCompile,
  },
  dist: {
    finalize: finalizeDist,
  },
};
