
/*
 * grunt-codo
 * https://github.com/frostney/grunt-codo
 *
 * Copyright (c) 2014 Johannes Stein
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
    var aFolderSources, i, iPercent, j, len, len1, oCodo, oData, oEntry, oOptions, oStats, oTable, ref, ref1, ref2, results, sSection;
    oOptions = this.options({
      extension: "coffee",
      output: (ref = this.data.dest) != null ? ref : "./doc",
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
      return aFolderSources.push(sFilePath);
    });
    aFolderSources = lodash.uniq(aFolderSources);
    oCodo = new Codo(aFolderSources, oOptions);
    oCodo.generate();
    if (oOptions.stats) {
      oTable = new CLITable({
        head: ["", chalk.cyan("Documented"), chalk.cyan("Undocumented"), chalk.cyan("Total"), chalk.cyan("Percent")]
      });
      oStats = oCodo.getStats();
      ref1 = ["classes", "mixins", "methods"];
      for (i = 0, len = ref1.length; i < len; i++) {
        sSection = ref1[i];
        oTable.push([chalk.cyan(sSection), oStats[sSection].documented, oStats[sSection].undocumented, oStats[sSection].total, (iPercent = oStats[sSection].percent) ? chalk[iPercent > 100 ? "yellow" : "green"](iPercent + "%") : "-"]);
      }
      oTable.push([]);
      oTable.push(["", chalk.cyan("Files"), chalk.cyan("Extras"), chalk.cyan("Objects"), chalk.cyan("Coverage")]);
      oTable.push([chalk.underline.cyan(this.nameArgs), oStats.files, oStats.extras, oStats.all.total, chalk.bold[(iPercent = oStats.all.percent) > 100 ? "yellow" : "green"](iPercent + "%")]);
      grunt.log.writeln();
      grunt.log.writeln(oTable.toString());
      grunt.log.writeln();
    }
    if (oOptions.undocumented && (oStats != null ? oStats : oStats = oCodo.getStats()).all.undocumented) {
      grunt.log.writeln();
      grunt.log.writeln(chalk.yellow.underline("Undocumented objects"));
      grunt.log.writeln();
      ref2 = oStats.undocumented;
      results = [];
      for (sSection in ref2) {
        oData = ref2[sSection];
        if (!oData.length) {
          continue;
        }
        oTable = new CLITable({
          head: [chalk.cyan(sSection), chalk.cyan("Path")]
        });
        for (j = 0, len1 = oData.length; j < len1; j++) {
          oEntry = oData[j];
          oTable.push([chalk.cyan(oEntry[0]), path.relative(process.cwd(), oEntry[1])]);
        }
        grunt.log.writeln(oTable.toString());
        results.push(grunt.log.writeln());
      }
      return results;
    }
  });
};
