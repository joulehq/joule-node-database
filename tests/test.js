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
var testDb = new JouleNodeDatabaseTest(process.env.DB_NAME, process.env.DB_PREFIX);

// test a key which does not exist
testDb.get('does-not-exist')
  .done(function(data) {
    console.log('should be null');
    console.log(data);
  });


// set get set
testDb.set('test', {foo: 'bar'})
  .then(function(data) {
    console.log('should be foo: bar');
    console.log(data);
    testDb.get('test')
      .done(function(data) {
        data['date'] = (new Date()).toString();
        testDb.set('test', data)
          .done(function(data) {
            console.log('should be foo: bar with date');
            console.log(data);
          });
      });
  });
