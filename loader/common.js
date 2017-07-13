const helper = require('think-helper');
const path = require('path');
const interopRequire = require('./util.js').interopRequire;

const CommonLoader = {
  loadFiles(dir) {
    const files = helper.getdirFiles(dir).filter(file => {
      return /\.js$/.test(file);
    });
    const cache = files.map(file => {
      // replace \\ to / in windows
      const name = file.replace(/\\/g, '/').replace(/\.js$/, '');
      const filepath = path.join(dir, file);
      const fileExport = interopRequire(filepath);
      // add __filename to export when is class
      if (helper.isFunction(fileExport)) {
        fileExport.prototype.__filename = filepath;
      }
      return {name, export: fileExport};
    }).sort((a, b) => {
      const al = a.name.split('/').length;
      const bl = b.name.split('/').length;
      if (al === bl) {
        return a.name < b.name ? 1 : -1;
      }
      return al < bl ? 1 : -1;
    });
    const ret = {};
    for (const name in cache) {
      ret[cache[name].name] = cache[name].export;
    }
    return ret;
  },

  load(appPath, type, modules) {
    if (modules.length) {
      const cache = {};
      modules.forEach(item => {
        cache[item] = {};
        const itemCache = CommonLoader.loadFiles(path.join(appPath, item, type));
        for (const name in itemCache) {
          cache[item][name] = itemCache[name];
        }
      });
      return cache;
    } else {
      const dir = path.join(appPath, type);
      return CommonLoader.loadFiles(dir);
    }
  }
};

module.exports = CommonLoader;
