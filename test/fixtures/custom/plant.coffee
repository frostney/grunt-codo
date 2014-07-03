# Base class for all plants.
#
# @example How to subclass an plant
#   class Tree extends plant
#     grow: ( speed ) ->
#
class Example.Plant

  # Construct a new plant.
  #
  # @param [String] name the name of the plant
  # @param [Date] birthDate when the plant was born
  #
  constructor: (@name, @birthDate = new Date()) ->

  # Make the plant grow.
  #
  # @example Grow a plant
  #   new Tree( 'Yggdrasil' ).grow( 1 )
  #
  # @option options [Number] speed the growth in cm
  #
  grow: (options = {}) ->

  clone: ->
