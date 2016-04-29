###
 * grunt-codo
 * https://github.com/frostney/grunt-codo
 *
 * Copyright (c) 2014 Johannes Stein
 * Licensed under the MIT license.
###

"use strict"

require( "coffee-script" ).register?()

Command = require "codo/lib/command"
Codo = require "codo/lib/codo"

module.exports = class CodoCommand extends Command

    constructor: ( @sources, @options ) ->
        @options.inputs = @sources
        @theme = @lookupTheme @options.theme

    generate: ->
        @env = Codo.parseProject process.cwd(), @options
        @theme.compile @env

    getStats: ->
        return @stats if @stats

        _stats = @collectStats @env

        iAllTotal = 0
        iAllUndocumented = 0

        for sSection, oData of _stats
            iAllTotal += oData.total
            iAllUndocumented += oData.undocumented.length

        return @stats =
            all:
                total: iAllTotal
                documented: iAllTotal - iAllUndocumented
                undocumented: iAllUndocumented
                percent: ( 100 - 100 / iAllTotal * iAllUndocumented ).toFixed 2
            files: @env.allFiles().length
            extras: @env.allExtras().length
            classes:
                total: _stats[ "Classes" ].total
                documented: _stats[ "Classes" ].total - _stats[ "Classes" ].undocumented.length
                undocumented: _stats[ "Classes" ].undocumented.length
                percent: _getDocumentationPercent _stats[ "Classes" ]
            mixins:
                total: _stats[ "Mixins" ].total
                documented: _stats[ "Mixins" ].total - _stats[ "Mixins" ].undocumented.length
                undocumented: _stats[ "Mixins" ].undocumented.length
                percent: _getDocumentationPercent _stats[ "Mixins" ]
            methods:
                total: _stats[ "Methods" ].total
                documented: _stats[ "Methods" ].total - _stats[ "Methods" ].undocumented.length
                undocumented: _stats[ "Methods" ].undocumented.length
                percent: _getDocumentationPercent _stats[ "Methods" ]
            undocumented:
                Classes: _stats[ "Classes" ].undocumented
                Mixins: _stats[ "Mixins" ].undocumented
                Methods: _stats[ "Methods" ].undocumented

    _getDocumentationPercent = ( oSection ) ->
        iPercent = ( 100 - 100 / oSection.total * oSection.undocumented.length ).toFixed 2
        if isNaN( iPercent ) then no else iPercent
