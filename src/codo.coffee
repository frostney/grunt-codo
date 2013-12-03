'use strict'

require 'coffee-script'

Codo = require 'codo/lib/codo'
Command = require 'codo/lib/command'
Table = require 'cli-table'

module.exports = (grunt) ->
  
  class GruntCommand extends Command
    generate: ->
      environment = Codo.parseProject(@input, @options)
      sections    = @collectStats(environment)
  
      @theme.compile(environment)
  
      if @options.undocumented
        for section, data of sections when data.undocumented.length != 0
          table = new Table
            head: [section, 'Path']
  
          table.push(entry) for entry in data.undocumented
          grunt.log.writeln table.toString()
          grunt.log.writeln ''
      else
        overall      = 0
        undocumented = 0
  
        for section, data of sections
          overall      += data.total
          undocumented += data.undocumented.length
  
        table = new Table
          head: ['', 'Total', 'Undocumented']
  
        table.push(
          ['Files', environment.allFiles().length, ''],
          ['Extras', environment.allExtras().length, ''],
          ['Classes', sections['Classes'].total, sections['Classes'].undocumented.length],
          ['Mixins', sections['Mixins'].total, sections['Mixins'].undocumented.length],
          ['Methods', sections['Methods'].total, sections['Methods'].undocumented.length]
        )
  
        grunt.log.writeln table.toString()
        grunt.log.writeln ''
        grunt.log.writeln "  Totally documented: #{(100 - 100/overall*undocumented).toFixed(2)}%"
        grunt.log.writeln ''
  

  grunt.registerTask 'codo', 'Generates Codo documentation', ->
    
    options = @options
      source: 'src'
      output: 'doc'
      theme: 'default'
      quiet: false
      verbose: false
      undocumented: false
      closure: false
      debug: true
      
    GruntCommand::options = [
      {name: 'help', alias: 'h', describe: 'Show this help'}
      {name: 'version', describe: 'Show version'}
      {name: 'output', alias: 'o', describe: 'The output directory', default: options.output}
      {name: 'output-dir'}
      {name: 'theme', describe: 'The theme to be used', default: options.theme}
      {name: 'name', alias: 'n', describe: 'The project name used'}
      #{name: 'readme', alias: 'r', describe: 'The readme file used'}
      {name: 'quiet', alias: 'q', describe: 'Supress warnings', boolean: true, default: options.quiet}
      {name: 'verbose', alias: 'v', describe: 'Show parsing errors', boolean: true, default: options.verbose}
      {name: 'undocumented', alias: 'u', describe: 'List undocumented objects', boolean: true, default: options.undocumented}
      {name: 'closure', describe: 'Try to parse closure-like block comments', boolean: true, default: options.closure}
      {name: 'debug', alias: 'd', boolean: options.debug}
    ]
    
    GruntCommand.run()
    