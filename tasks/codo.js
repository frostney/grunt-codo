(function() {
  'use strict';
  var Codo, Command, Table,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('coffee-script');

  Codo = require('codo/lib/codo');

  Command = require('codo/lib/command');

  Table = require('cli-table');

  module.exports = function(grunt) {
    var GruntCommand;
    GruntCommand = (function(_super) {
      __extends(GruntCommand, _super);

      function GruntCommand() {
        this.theme = this.lookupTheme(this.options.theme);
        this.generate();
      }

      GruntCommand.prototype.generate = function() {
        var data, entry, environment, overall, section, sections, table, undocumented, _i, _len, _ref, _results;
        environment = Codo.parseProject(process.cwd(), this.options);
        sections = this.collectStats(environment);
        this.theme.compile(environment);
        if (this.options.undocumented) {
          _results = [];
          for (section in sections) {
            data = sections[section];
            if (!(data.undocumented.length !== 0)) {
              continue;
            }
            table = new Table({
              head: [section, 'Path']
            });
            _ref = data.undocumented;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              entry = _ref[_i];
              table.push(entry);
            }
            grunt.log.writeln(table.toString());
            _results.push(grunt.log.writeln(''));
          }
          return _results;
        } else {
          overall = 0;
          undocumented = 0;
          for (section in sections) {
            data = sections[section];
            overall += data.total;
            undocumented += data.undocumented.length;
          }
          table = new Table({
            head: ['', 'Total', 'Undocumented']
          });
          table.push(['Files', environment.allFiles().length, ''], ['Extras', environment.allExtras().length, ''], ['Classes', sections['Classes'].total, sections['Classes'].undocumented.length], ['Mixins', sections['Mixins'].total, sections['Mixins'].undocumented.length], ['Methods', sections['Methods'].total, sections['Methods'].undocumented.length]);
          grunt.log.writeln(table.toString());
          grunt.log.writeln('');
          grunt.log.writeln("  Totally documented: " + ((100 - 100 / overall * undocumented).toFixed(2)) + "%");
          return grunt.log.writeln('');
        }
      };

      return GruntCommand;

    })(Command);
    return grunt.registerTask("codo", "Generates Codo documentation", function() {
      var options;
      options = this.options({
        inputs: ["src"],
        output: "doc",
        theme: "default",
        quiet: false,
        verbose: false,
        undocumented: false,
        closure: false,
        debug: true,
        "private": false,
        analytics: false,
        title: "API Documentation"
      });
      GruntCommand.prototype.options = {
        quiet: options.quiet,
        q: options.quiet,
        verbose: options.verbose,
        v: options.verbose,
        undocumented: options.undocumented,
        u: options.undocumented,
        closure: options.closure,
        debug: options.debug,
        d: options.debug,
        "private": options["private"],
        p: options["private"],
        platform: "core",
        stack: true,
        output: options.output,
        o: options.output,
        theme: options.theme,
        analytics: options.analytics,
        a: options.analytics,
        title: options.title,
        t: options.title,
        inputs: options.inputs
      };
      return GruntCommand.run();
    });
  };

}).call(this);
