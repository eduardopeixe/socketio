;(function() {
  'use strict'

  angular.module('app').factory('socket', socket)

  // Angular won't intercept data coming from the browser
  socket.$inject = ['$rootScope']

  function socket($rootScope) {
    //open connection between server and browser
    var socket = io.connect()

    //return to make them public
    return {
      on: on,
      emit: emit
    }

    // Socket 'on' and 'emit' methods here
    function on(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments
        $rootScope.$apply(function() {
          callback.apply(socket, args)
        })
      })
    }
    function emit(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args)
          }
        })
      })
    }
  }
})()
