
/*
 * grunt-codo-codo
 * https://github.com/Leny/grunt-codo-codo
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var CLITable, Codo, chalk, lodash, path;

path = require("path");

lodash = require("lodash");

chalk = require("chalk");

CLITable = require("cli-table");

Codo = require("./utils/command.js");

module.exports = function(grunt) {
  return grunt.registerMultiTask("codo", "Generate codo documentation.", function() {
    var aFolderSources, iPercent, oCodo, oData, oEntry, oOptions, oStats, oTable, sSection, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
    oOptions = this.options({
      extension: "coffee",
      output: (_ref = this.data.dest) != null ? _ref : "./doc",
      theme: "default",
      name: "Codo",
      title: "Documentation",
      readme: "README.md",
      quiet: false,
      verbose: false,
      undocumented: false,
      closure: false,
      "private": false,
      analytics: false,
      stats: true,
      extras: []
    });
    aFolderSources = [];
    this.filesSrc.filter(function(sFilePath) {
      return grunt.file.exists(sFilePath);
    }).forEach(function(sFilePath) {
      if (grunt.file.isDir(sFilePath)) {
        return aFolderSources.push(sFilePath);
      }
      if (grunt.file.isFile(sFilePath)) {
        return aFolderSources.push(path.dirname(sFilePath));
      }
    });
    aFolderSources = lodash.uniq(aFolderSources);
    oCodo = new Codo(aFolderSources, oOptions);
    oCodo.generate();
    if (oOptions.stats) {
      oTable = new CLITable({
        head: ["", chalk.cyan("Documented"), chalk.cyan("Undocumented"), chalk.cyan("Total"), chalk.cyan("Percent")]
      });
      oStats = oCodo.getStats();
      _ref1 = ["classes", "mixins", "methods"];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        sSection = _ref1[_i];
        oTable.push([chalk.cyan(sSection), oStats[sSection].documented, oStats[sSection].undocumented, oStats[sSection].total, (iPercent = oStats[sSection].percent) ? chalk[iPercent > 100 ? "yellow" : "green"]("" + iPercent + "%") : "-"]);
      }
      oTable.push([]);
      oTable.push(["", chalk.cyan("Files"), chalk.cyan("Extras"), chalk.cyan("Objects"), chalk.cyan("Coverage")]);
      oTable.push([chalk.underline.cyan(this.nameArgs), oStats.files, oStats.extras, oStats.all.total, chalk.bold[(iPercent = oStats.all.percent) > 100 ? "yellow" : "green"]("" + iPercent + "%")]);
      grunt.log.writeln();
      grunt.log.writeln(oTable.toString());
      grunt.log.writeln();
    }
    if (oOptions.undocumented && (oStats != null ? oStats : oStats = oCodo.getStats()).all.undocumented) {
      grunt.log.writeln();
      grunt.log.writeln(chalk.yellow.underline("Undocumented objects"));
      grunt.log.writeln();
      _ref2 = oStats.undocumented;
      _results = [];
      for (sSection in _ref2) {
        oData = _ref2[sSection];
        if (!oData.length) {
          continue;
        }
        oTable = new CLITable({
          head: [chalk.cyan(sSection), chalk.cyan("Path")]
        });
        for (_j = 0, _len1 = oData.length; _j < _len1; _j++) {
          oEntry = oData[_j];
          oTable.push([chalk.cyan(oEntry[0]), path.relative(process.cwd(), oEntry[1])]);
        }
        grunt.log.writeln(oTable.toString());
        _results.push(grunt.log.writeln());
      }
      return _results;
    }
  });
};
