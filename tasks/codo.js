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
    var GruntCommand, _ref;
    GruntCommand = (function(_super) {
      __extends(GruntCommand, _super);

      function GruntCommand() {
        _ref = GruntCommand.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GruntCommand.prototype.generate = function() {
        var data, entry, environment, overall, section, sections, table, undocumented, _i, _len, _ref1, _results;
        environment = Codo.parseProject(this.input, this.options);
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
            _ref1 = data.undocumented;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              entry = _ref1[_i];
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
    return grunt.registerTask('codo', 'Generates Codo documentation', function() {
      var options;
      options = this.options({
        source: 'src',
        output: 'doc',
        theme: 'default',
        quiet: false,
        verbose: false,
        undocumented: false,
        closure: false,
        debug: true
      });
      GruntCommand.prototype.options = [
        {
          name: 'help',
          alias: 'h',
          describe: 'Show this help'
        }, {
          name: 'version',
          describe: 'Show version'
        }, {
          name: 'output',
          alias: 'o',
          describe: 'The output directory',
          "default": options.output
        }, {
          name: 'output-dir'
        }, {
          name: 'theme',
          describe: 'The theme to be used',
          "default": options.theme
        }, {
          name: 'name',
          alias: 'n',
          describe: 'The project name used'
        }, {
          name: 'quiet',
          alias: 'q',
          describe: 'Supress warnings',
          boolean: true,
          "default": options.quiet
        }, {
          name: 'verbose',
          alias: 'v',
          describe: 'Show parsing errors',
          boolean: true,
          "default": options.verbose
        }, {
          name: 'undocumented',
          alias: 'u',
          describe: 'List undocumented objects',
          boolean: true,
          "default": options.undocumented
        }, {
          name: 'closure',
          describe: 'Try to parse closure-like block comments',
          boolean: true,
          "default": options.closure
        }, {
          name: 'debug',
          alias: 'd',
          boolean: options.debug
        }
      ];
      return GruntCommand.run();
    });
  };

}).call(this);
