;(function() {
  'use strict'

  angular.module('app').controller('MainCtrl', MainCtrl)

  MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash']

  function MainCtrl($scope, $localStorage, socket, lodash) {
    $scope.message = ''
    $scope.messages = []
    $scope.users = []
    $scope.likes = []
    $scope.mynickname = $localStorage.nickname
    let nickname = $scope.mynickname

    $scope.joinPrivate = () => {
      socket.emit('join-private', {
        nickname
      })
      console.log('private room joined')
    }

    $scope.groupPm = () => {
      console.log('private message sent')
      socket.emit('private-chat', { message: 'hello everybody!' })
    }

    socket.on('show-message', message => {
      console.log('show message', message)
    })
    socket.emit('get-users')

    socket.on('all-users', function(data) {
      $scope.users = data.filter(function(item) {
        return item.nickname !== nickname
      })
    })

    socket.on('message-received', data => {
      $scope.messages.push(data)
    })

    socket.on('user-liked', data => {
      console.log('user-liked', data)
      $scope.likes.push(data.from)
    })

    $scope.sendMessage = data => {
      var newMessage = {
        message: $scope.message,
        from: $scope.mynickname
      }

      socket.emit('send-message', newMessage)
      $scope.message = ''
      // $scope.messages.push(newMessage)
    }

    $scope.sendLike = user => {
      console.log(user)
      const id = lodash.get(user, 'socketid')
      const likeObj = { from: nickname, like: id }
      console.log('socket emit send like', likeObj)
      socket.emit('send-like', likeObj)
    }
  }
})()
