/* eslint no-param-reassign: 0 */
// This config is for building dist files
const getWebpackConfig = require('bubai/lib/getWebpackConfig');

const { webpack } = getWebpackConfig;

const webpackConfig = getWebpackConfig(false);

module.exports = webpackConfig;
