/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Cole Chamberlain
*/

var path = require('path');
var fs = require('fs');
var licenseFileNames = [
  'LICENSE',
  'LICENCE',
  'LICENSE.md',
  'LICENCE.md',
  'LICENSE.markdown',
  'LICENCE.markdown',
  'LICENSE.txt',
  'LICENCE.txt',
  'license',
  'licence',
  'license.md',
  'licence.md',
  'license.markdown',
  'licence.markdown',
  'license.txt',
  'licence.txt'
];

var cache = [];

module.exports = function (source) {
  this.cacheable && this.cacheable();
  var callback = this.async();

  try {
    if (this.resourcePath.indexOf('node_modules') !== -1) {
      // [ "/my/project/", "/moment/", "/moment-dependency/index.js" ]
      var nodeModuleSplit = this.resourcePath.split('node_modules');
      // "/my/project/node_modules/moment/node_modules/"
      var packageNodeModulesDir = path.join(nodeModuleSplit.slice(0, nodeModuleSplit.length - 1).join('node_modules'), 'node_modules');
      // "moment-dependency/index.js"
      var relativeFilePath = nodeModuleSplit[nodeModuleSplit.length - 1].replace(/^[/\\]*/, '');
      // "moment-dependency"
      var relativePackageDir = relativeFilePath.replace(/[/\\].*$/i, '');
      // "index.js"
      var relativeSubFilePath = relativeFilePath.replace(/[/\\].*$/i, '');
      // "/my/project/node_modules/moment/node_modules/moment-dependency"
      var packageDir = path.resolve(packageNodeModulesDir, relativePackageDir);
      var packageJSON = require(path.join(packageDir, 'package.json'));

      const fingerprint = `${packageJSON.name}:${packageJSON.version}`
      if(cache.indexOf(fingerprint) !== -1)
        return callback(null, source);
      cache.push(fingerprint);

      fs.readdir(packageDir, (err, files) => {
        if(err) return callback(err);
        let handled = false;
        for(var licenseFileName of licenseFileNames) {
          if(files.indexOf(licenseFileName) !== -1) {
            var licensePath = path.resolve(packageDir, licenseFileName);
            fs.readFile(licensePath, { encoding: 'utf8' }, (licenseErr, licenseText) => {
              if(licenseErr) callback(licenseErr);
              else callback(null, `${licenseComment(packageJSON, `==${packageJSON.name}/${licenseFileName}==\n${licenseText}`)}\n${source}`);
            })
            handled = true;
            break;
          }
        }
        // No license found, use whatever is in package.json
        if(!handled) callback(null, `${licenseComment(packageJSON)}\n${source}`);
      })
    } else {
      callback(null, source);
    }
  } catch (err) {
    console.error("license-loader: An error occurred reading package, skipping...", err);
    callback(null, source);
  }
}

function licenseComment (packageJSON, licenseText) {
  if(licenseText && licenseText[licenseText.length - 1] === '\n')
    licenseText = licenseText.substring(0, licenseText.length - 1);
  var _licenseText = licenseText ? `\n * ${licenseText.replace(/\n+$/).replace(/(\*\/)/g, '').replace(/\n/g, '\n * ')}` : '';
  var license = null;
  var licenseRaw = packageJSON.license || packageJSON.licenses;
  if (licenseRaw) {
    license = Array.isArray(licenseRaw) ? licenseRaw.map(sanitizeLicense).join(", ") : sanitizeLicense(licenseRaw);
  }
  return `/*!
 * ${packageJSON.name} (https://npmjs.com/package/${packageJSON.name})
 * @license${license ? ` ${license}` : ''}
 * @version ${packageJSON.version}${_licenseText}
 */`;
}

function sanitizeLicense(license) {
  if(typeof license === 'string') return license;
  if(license && license.type && license.url)
    return `${license.type} (${license.url})`;
  return license && license.type ? license.type : '';
}
