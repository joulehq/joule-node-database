var fs = require('fs')
    , path = require('path')
    , envFile = path.resolve(process.cwd() + '/env.ini');

// fs.accessSync throws an error
if(fs.existsSync(envFile)) {
  require('dotenv').config({path: envFile})
} else {
  console.log('!! File @ ' + envFile + ' needs to be a proper INI file !!');
  console.log('');
  process.exit(1);
}

var JouleNodeDatabaseTest = require('./../index');
var testDb = new JouleNodeDatabaseTest(process.env.DB_BUCKET, process.env.DB_PREFIX, process.env.DB_REGION);


testDb.get('test')
  .done(function(data) {
    console.log(data);
    data['date'] = (new Date()).toString();
    testDb.set('test', data)
      .done(function(data) {
        console.log(data);
      });
  });
