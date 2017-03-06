const helper = require('think-helper');
const path = require('path');
const interopRequire = require('./util.js').interopRequire;
const loadConfig = require('./config_load_config');
const loadAdapter = require('./config_load_adapter');
const formatAdapter = require('./config_format_adapter');


/**
 * load config files
 * src/config/config.js
 * src/config/config.[env].js
 * src/config/adapter.js
 * src/config/adapter.[env].js
 */
module.exports = function loader(appPath, thinkPath, env, modules){
  const thinkConfig = interopRequire(path.join(thinkPath, 'lib/config/config.js'));
  if(modules.length){
     let result = {};
     modules.forEach(dir => {
       let paths = [path.join(appPath, 'common')];
       //merge common & module config
       if(dir !== 'common'){
         paths.push(path.join(appPath, dir));
       }
       let config = loadConfig(paths, env);
       let adapterConfig = loadConfig(paths, env, 'adapter');
       let adapter = loadAdapter(path.join(appPath, 'common/adapter'));
       result[dir] = helper.extend({}, thinkConfig, config, formatAdapter(adapterConfig, adapter));
     });
     return result;
  }else{

    let configPath = [path.join(appPath, 'config')];
    let config = loadConfig(configPath, env);
    let adapterConfig = loadConfig(configPath, env, 'adapter');
    let adapter = loadAdapter(path.join(appPath, 'adapter'));
    return helper.extend({}, thinkConfig, config, formatAdapter(adapterConfig, adapter));
  }
};