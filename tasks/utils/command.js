
/*
 * grunt-codo-codo
 * https://github.com/Leny/grunt-codo-codo
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var Codo, CodoCommand, Command, _base,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof (_base = require("coffee-script")).register === "function") {
  _base.register();
}

Command = require("codo/lib/command");

Codo = require("codo/lib/codo");

module.exports = CodoCommand = (function(_super) {
  var _getDocumentationPercent;

  __extends(CodoCommand, _super);

  function CodoCommand(sources, options) {
    this.sources = sources;
    this.options = options;
    this.options.inputs = this.sources;
    this.theme = this.lookupTheme(this.options.theme);
  }

  CodoCommand.prototype.generate = function() {
    this.env = Codo.parseProject(process.cwd(), this.options);
    return this.theme.compile(this.env);
  };

  CodoCommand.prototype.getStats = function() {
    var iAllTotal, iAllUndocumented, oData, sSection, _stats;
    if (this.stats) {
      return this.stats;
    }
    _stats = this.collectStats(this.env);
    iAllTotal = 0;
    iAllUndocumented = 0;
    for (sSection in _stats) {
      oData = _stats[sSection];
      iAllTotal += oData.total;
      iAllUndocumented += oData.undocumented.length;
    }
    return this.stats = {
      all: {
        total: iAllTotal,
        documented: iAllTotal - iAllUndocumented,
        undocumented: iAllUndocumented,
        percent: (100 - 100 / iAllTotal * iAllUndocumented).toFixed(2)
      },
      files: this.env.allFiles().length,
      extras: this.env.allExtras().length,
      classes: {
        total: _stats["Classes"].total,
        documented: _stats["Classes"].total - _stats["Classes"].undocumented.length,
        undocumented: _stats["Classes"].undocumented.length,
        percent: _getDocumentationPercent(_stats["Classes"])
      },
      mixins: {
        total: _stats["Mixins"].total,
        documented: _stats["Mixins"].total - _stats["Mixins"].undocumented.length,
        undocumented: _stats["Mixins"].undocumented.length,
        percent: _getDocumentationPercent(_stats["Mixins"])
      },
      methods: {
        total: _stats["Methods"].total,
        documented: _stats["Methods"].total - _stats["Methods"].undocumented.length,
        undocumented: _stats["Methods"].undocumented.length,
        percent: _getDocumentationPercent(_stats["Methods"])
      },
      undocumented: {
        Classes: _stats["Classes"].undocumented,
        Mixins: _stats["Mixins"].undocumented,
        Methods: _stats["Methods"].undocumented
      }
    };
  };

  _getDocumentationPercent = function(oSection) {
    var iPercent;
    iPercent = (100 - 100 / oSection.total * oSection.undocumented.length).toFixed(2);
    if (isNaN(iPercent)) {
      return false;
    } else {
      return iPercent;
    }
  };

  return CodoCommand;

})(Command);
