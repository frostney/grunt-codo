###
 * grunt-codo
 * https://github.com/Stoney-FD/grunt-codo
 *
 * Copyright (c) 2013 Johannes Stein
 * Licensed under the MIT license.
###

"use strict"

module.exports = ( grunt ) ->

    require( "matchdep" ).filterDev( "grunt-*" ).forEach grunt.loadNpmTasks

    grunt.initConfig
        coffeelint:
            options: grunt.file.readJSON "coffeelint.json"
            task:
                files:
                    src: [ "Gruntfile.coffee", "src/**/*.coffee" ]
        coffee:
            options:
                bare: yes
            task:
                files:
                    "tasks/utils/command.js": "src/utils/command.coffee"
                    "tasks/codo.js": "src/codo.coffee"
        clean:
            test: [ "test/expected", "doc" ]
        codo:
            default:
                options: {}
                src: "test/fixtures/default"
            custom:
                options:
                    name: "Codo-codo"
                    title: "Codo-codo Documentation"
                    extra: [ "LICENSE-MIT" ]
                    undocumented: yes
                    stats: no
                src: [
                    "test/fixtures/default"
                    "test/fixtures/custom/**/*.coffee"
                ]
                dest: "test/expected/custom-docs"

    grunt.loadTasks "tasks"

    grunt.registerTask "lint", [
      "coffeelint"
    ]

    grunt.registerTask "default", [
        "lint"
        "coffee"
        "clean"
        "codo"
    ]

    grunt.registerTask "build", [
        "coffeelint"
        "coffee"
    ]

    grunt.registerTask "test", [
        "clean"
        "codo"
    ]
