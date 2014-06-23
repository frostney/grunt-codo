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
            options:
                arrow_spacing:
                    level: "error"
                camel_case_classes:
                    level: "error"
                duplicate_key:
                    level: "error"
                indentation:
                    level: "ignore"
                max_line_length:
                    level: "ignore"
                no_backticks:
                    level: "error"
                no_empty_param_list:
                    level: "error"
                no_stand_alone_at:
                    level: "error"
                no_tabs:
                    level: "error"
                no_throwing_strings:
                    level: "error"
                no_trailing_semicolons:
                    level: "error"
                no_unnecessary_fat_arrows:
                    level: "error"
                space_operators:
                    level: "error"
            task:
                files:
                    src: [ "src/*.coffee" ]
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

    grunt.registerTask "default", [
        "coffeelint"
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
