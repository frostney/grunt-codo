###
 * grunt-codo
 * https://github.com/Stoney-FD/grunt-codo
 *
 * Copyright (c) 2014 Johannes Stein
 * Licensed under the MIT license.
###

"use strict"

path = require "path"
lodash = require "lodash"
chalk = require "chalk"
CLITable = require "cli-table"

Codo = require "./utils/command.js"

module.exports = ( grunt ) ->

    grunt.registerMultiTask "codo", "Generate codo documentation.", ->
        oOptions = @options
            extension: "coffee"
            output: @data.dest ? "./doc"
            theme: "default"
            name: "Codo"
            title: "Documentation"
            readme: "README.md"
            quiet: no
            verbose: no
            undocumented: no
            closure: no
            private: no
            analytics: no
            stats: yes
            extras: []

        aFolderSources = []

        @filesSrc
            .filter ( sFilePath ) ->
                grunt.file.exists sFilePath
            .forEach ( sFilePath ) ->
                return aFolderSources.push sFilePath

        aFolderSources = lodash.uniq aFolderSources

        oCodo = new Codo aFolderSources, oOptions

        oCodo.generate()

        if oOptions.stats
            oTable = new CLITable
                head: [ "", chalk.cyan( "Documented" ), chalk.cyan( "Undocumented" ), chalk.cyan( "Total" ), chalk.cyan( "Percent" ) ]

            oStats = oCodo.getStats()

            for sSection in [ "classes", "mixins", "methods" ]
                oTable.push [
                    chalk.cyan sSection
                    oStats[ sSection ].documented
                    oStats[ sSection ].undocumented
                    oStats[ sSection ].total
                    if iPercent = oStats[ sSection ].percent then chalk[ if iPercent > 100 then "yellow" else "green" ]( "#{ iPercent }%" ) else "-"
                ]
            oTable.push []
            oTable.push [ "", chalk.cyan( "Files" ), chalk.cyan( "Extras" ), chalk.cyan( "Objects" ), chalk.cyan( "Coverage" ) ]
            oTable.push [
                chalk.underline.cyan @nameArgs
                oStats.files
                oStats.extras
                oStats.all.total
                chalk.bold[ if ( iPercent = oStats.all.percent ) > 100 then "yellow" else "green" ]( "#{ iPercent }%" )
            ]

            grunt.log.writeln()
            grunt.log.writeln oTable.toString()
            grunt.log.writeln()

        if oOptions.undocumented and ( oStats ?= oCodo.getStats() ).all.undocumented
            grunt.log.writeln()
            grunt.log.writeln chalk.yellow.underline "Undocumented objects"
            grunt.log.writeln()

            for sSection, oData of oStats.undocumented when oData.length
                oTable = new CLITable
                    head: [ chalk.cyan( sSection ), chalk.cyan( "Path" ) ]

                for oEntry in oData
                    oTable.push [
                        chalk.cyan oEntry[ 0 ]
                        path.relative process.cwd(), oEntry[ 1 ]
                    ]
                grunt.log.writeln oTable.toString()
                grunt.log.writeln()
