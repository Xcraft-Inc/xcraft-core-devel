'use strict';

var fs = require('fs');
var path = require('path');

exports.patch = function (srcDir, patchFile, stripNum, resp, callback) {
  var currentDir = process.cwd();
  process.chdir(srcDir);

  var spawn = require('child_process').spawn;

  let bin = 'patch';
  const ext = /^win/.test(process.platform) ? '.exe' : '';
  bin += ext;
  const patch = spawn(bin, ['-p' + stripNum]);

  fs.createReadStream(patchFile)
    .on('data', function (data) {
      patch.stdin.write(data);
    })
    .on('close', function () {
      patch.stdin.end();
    });

  patch.stdout.on('data', function (data) {
    data
      .toString()
      .replace(/\r/g, '')
      .split('\n')
      .forEach(function (line) {
        if (line.trim().length) {
          resp.log.verb(line);
        }
      });
  });

  patch.stderr.on('data', function (data) {
    data
      .toString()
      .replace(/\r/g, '')
      .split('\n')
      .forEach(function (line) {
        if (line.trim().length) {
          resp.log.err(line);
        }
      });
  });

  patch.on('close', function (code) {
    process.chdir(currentDir);
    callback(code === 0 ? null : 'rc: ' + code);
  });
};

exports.autoPatch = function (patchesDir, srcDir, resp, callback) {
  var async = require('async');

  if (!fs.existsSync(patchesDir)) {
    callback();
    return;
  }

  var xFs = require('xcraft-core-fs');
  var xPlatform = require('xcraft-core-platform');

  var list = xFs
    .ls(
      patchesDir,
      new RegExp('^(?:[0-9]+|' + xPlatform.getOs() + '-).*.(?:patch|diff)$')
    )
    .sort();

  if (!list.length) {
    callback();
    return;
  }

  async.eachSeries(
    list,
    function (file, callback) {
      resp.log.info('apply patch %s in %s', file, srcDir);
      var patchFile = path.join(patchesDir, file);

      exports.patch(srcDir, patchFile, 1, resp, function (err) {
        callback(err ? 'patch failed: ' + file + ' ' + err : null);
      });
    },
    function (err) {
      callback(err);
    }
  );
};
