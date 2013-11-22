'use strict'

module.exports = (grunt) ->

  codo = require 'codo'

  grunt.registerTask 'codo', 'Generates Codo documentation', ->
    
    options = @options
      source: 'src'
      output: 'doc'
      
    done = @async()

    done()
