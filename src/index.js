'use strict';
/*globals authConfig */
/*jshint bitwise: false*/


angular.module('richu.auth', [
  'richu.auth.config',
  'ngResource',
  'ui.router',
  'toastr',
  'LocalStorageModule'
])

//로컬 스토리지
.config(function(localStorageServiceProvider, AUTH_PREFIX) {
  localStorageServiceProvider
    .setPrefix(AUTH_PREFIX || '');
})

// .run(function($injector, $rootScope) {
//   $injector.get('$http').defaults.transformRequest = function(data, headersGetter) {
//     // console.log($rootScope.currentUser);
//     if ($rootScope.currentUser !== undefined && $rootScope.currentUser.hasOwnProperty('accessToken') && $rootScope.currentUser.accessToken) {
//       headersGetter().Authorization = 'Bearer ' + $rootScope.currentUser.accessToken;
//     }
//     if (data) {
//       return angular.toJson(data);
//     }
//   };
// })


// 라우팅 접근권한
// .run(function($rootScope, $state, Auth, ACCESS_LEVELS, AUTH_STATE_HOME, AUTH_STATE_LOGIN) {
//   $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
//     var targetAuth = (toState.hasOwnProperty('data')) ? toState.data.access : ACCESS_LEVELS.public;
//     if (!Auth.authorize(targetAuth)) {
//       $rootScope.error = 'Seems like you tried accessing a route you don\'t have access to...';
//       event.preventDefault();
//
//       if (fromState.url === '^') {
//         if (Auth.isLoggedIn()) {
//           $state.go(AUTH_STATE_HOME);
//         } else {
//           $rootScope.error = null;
//           $state.go(AUTH_STATE_LOGIN);
//         }
//       }
//     }
//   });
// })

/**********************   유 저   **********************/
//유저롤
.constant('USER_ROLES', (function() {
  var bitMask = '01';
  var userRoles = {};

  for (var role in authConfig.roles) {
    var intCode = parseInt(bitMask, 2);
    userRoles[authConfig.roles[role]] = {
      bitMask: intCode,
      title: authConfig.roles[role]
    };
    bitMask = (intCode << 1).toString(2);
  }
  return userRoles;
})())

///엑세스 레벨
.constant('ACCESS_LEVELS', (function() {

  var bitMask = '01';
  var userRoles = {};

  for (var role in authConfig.roles) {
    var intCode = parseInt(bitMask, 2);
    userRoles[authConfig.roles[role]] = {
      bitMask: intCode,
      title: authConfig.roles[role]
    };
    bitMask = (intCode << 1).toString(2);
  }

  function buildAccessLevels(accessLevelDeclarations) {
    var accessLevels = {};
    var resultBitMask = '';
    var role;
    for (var level in accessLevelDeclarations) {

      if (typeof accessLevelDeclarations[level] === 'string') {
        if (accessLevelDeclarations[level] === '*') {

          resultBitMask = '';

          for (role in userRoles) {
            resultBitMask += '1';
          }
          //accessLevels[level] = parseInt(resultBitMask, 2);
          accessLevels[level] = {
            bitMask: parseInt(resultBitMask, 2)
          };
        } else {
          console.error('Access Control Error: Could not parse \'' + accessLevelDeclarations[level] + '\' as access definition for level \'' + level + '\'');
        }
      } else {
        resultBitMask = 0;
        for (role in accessLevelDeclarations[level]) {
          if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role])) {
            resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask;
          } else {
            console.error('Access Control Error: Could not find role \'' + accessLevelDeclarations[level][role] + '\' in registered roles while building access for \'' + level + '\'');
          }
        }
        accessLevels[level] = {
          bitMask: resultBitMask
        };
      }
    }
    return accessLevels;
  }
  return buildAccessLevels(authConfig.accessLevels);
})())

;
