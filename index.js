var AWS = require('aws-sdk')
    , Promise = require('promise');

module.exports = JouleNodeDatabase = function(bucket, prefix) {
  var bucket = bucket
      , prefix = prefix
      , s3;

  var init = function() {
    s3 = new AWS.S3({params: {Bucket: bucket}});
  };

  var getObjectKey = function(key) {
    return prefix + '/' + key + '.json';
  };

  var getObjectParams = function(key) {
    var resp;

    resp = {
      Bucket: bucket
      , Key: getObjectKey(key)
    };

    if(arguments.length > 1) {
      resp['Body'] = JSON.stringify(arguments[1]);
    }
    
    return resp;
  };

  this.get = function(key) {
    return new Promise(function(fulfill, reject) {
      s3.getObject(getObjectParams(key), function(err, data) {
        var str;
        if(err) {
          if(err.statusCode === 403 || err.statusCode === 404) {
            fulfill(null);
          } else {
            reject(err);
          }
        } else {
          str = data.Body.toString('utf8');
          fulfill(JSON.parse(str));
        }
      });
    });
  };

  this.set = function(key, value) {
    return new Promise(function(fulfill, reject) {
      s3.putObject(getObjectParams(key, value), function(err, data) {
        if(err) {
          reject(err);
        } else {
          fulfill(value);
        }
      });
    });
  };

  init();
};
