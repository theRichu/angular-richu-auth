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

angular.module('richu.auth')

.directive('accessLevel', function($rootScope, Auth, ACCESS_LEVELS) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var prevDisp = element.css('display');
      var accessLevel, userRole;

      if ($rootScope.currentUser && $rootScope.currentUser.hasOwnProperty('role')) {
        userRole = $rootScope.currentUser.role;
      }

      function updateCSS() {
        if (userRole && accessLevel) {
          // console.info('둘다 있음', userRole, accessLevel);
          if (Auth.authorize(accessLevel, userRole) === 0) {
            element.css('display', 'none');
          } else {
            // console.info(prevDisp);
            element.css('display', prevDisp);
          }
        }
      }

      // updateCSS();
      $rootScope.$on('USER_CHANGED', function(event, data) {
        // console.info('유저 변경됨', data.role);
        if (data.role) {
          userRole = data.role;
        }
        updateCSS();
      });

      attrs.$observe('accessLevel', function(al) {
        if (al) {
          accessLevel = ACCESS_LEVELS[al];
        }
        updateCSS();
      });


    }
  };
});

angular.module('richu.auth')
.directive('showUser', function() {
	return {
		restrict: 'AE',
		template: '{{username}}',
		controller: function($scope, $rootScope) {
			$scope.username = $rootScope.currentUser.name;
			$rootScope.$on('USER_CHANGED', function(event, data) {
				$scope.username = data.name;
			});

		},
	};
});

/*jslint bitwise: true */
/* globals _*/



angular.module('richu.auth')
  .provider('Auth',
    function() {
      var self = this;

      return {
        $get: function($injector) {
          var rScope = $injector.get('$rootScope');
          var $resource = $injector.get('$resource');
          var AuthPersistance = $injector.get('AuthPersistance');
          var USER_ROLES = $injector.get('USER_ROLES');
          var AUTH_BASE_URL = $injector.get('AUTH_BASE_URL');
          var AUTH_SERVER_CONFIG = $injector.get('AUTH_SERVER_CONFIG');
          var AuthServer = $resource(AUTH_BASE_URL + ':auth/:provider/:action/:actionId', {
            action: '@action',
            actionId: '@actionId'
          }, AUTH_SERVER_CONFIG);
          // var ACCESS_LEVELS = $injector.get('ACCESS_LEVELS');

          rScope.currentUser = {};
          var initCurrentUser = function() {
            self.dbUser = AuthPersistance.user();
            if (self.dbUser === undefined || _.isEmpty(self.dbUser)) {
              initUser();
            } else {
              // console.info('DB에 저장된 유저가 있습니다.(밸리데이션 해야합니다)', self.dbUser);
              // checkVaildAccess
              rScope.currentUser = self.dbUser;
            }
          };
          initCurrentUser();

          function initUser() {
            var emptyUser = {
              role: USER_ROLES.public
            };
            AuthPersistance.changeUser(emptyUser);
            rScope.currentUser = emptyUser;
            // console.info('유저데이터를 초기화합니다.', rScope.currentUser);
            rScope.$broadcast('USER_CHANGED', rScope.currentUser);
          }

          function changeUser(user) {
            angular.extend(rScope.currentUser, user);
            AuthPersistance.changeUser(rScope.currentUser);
            // console.info('유저를 변경합니다.', rScope.currentUser);
            rScope.$broadcast('USER_CHANGED', rScope.currentUser);
          }

          return {
            permissionChanged: function(user) {
              changeUser(user);
            },

            updateUser: function(user) {
              var userData = user;
              delete user.passports;
              delete user.profiles;
              delete user.registrations;
              delete user.role;
              delete user.mask;
              delete user.username;
              delete user.email;
              delete user.createdAt;

              changeUser(userData);
            },
            authorize: function(accessLevel, role) {
              // console.info('Authorize: ', accessLevel.bitMask, role.bitMask, accessLevel.bitMask & role.bitMask);

              if (role === undefined) {
                role = rScope.currentUser.role;
              }

              return accessLevel.bitMask & role.bitMask;
            },

            isLoggedIn: function(user) {
              //  console.info('현재 유저', user, currentUser);
              if (user === undefined) {
                if (rScope.currentUser === undefined) {
                  initCurrentUser();
                }
                user = rScope.currentUser;
              }
              // return !!user.accessToken;
              return user.role.title !== USER_ROLES.public.title;
            },

            //TODO: findpassword
            findpassword: function(email, success, error){
              AuthServer.findpassword({email:email}, function(res){
                success(res);
              }, function(err){
                error(err);
              });
            },
            //TODO: resetpassword
            resetpassword: function(password, success, error){
              AuthServer.resetpassword({password:password}, function(res){
                success(res);
              }, function(err){
                error(err);
              });
            },

            //TODO: register
            checkUser: function(user, success, error){
              AuthServer.checkUser(user, function(res){
                success(res);
              }, function(err){
                error(err);
              });
            },
            register: function(form, success, error){
              AuthServer.register(form, function(res){
                success(res);
              }, function(err){
                error(err);
              });
            },

            loginByToken: function (token, success, error) {
              AuthServer.loginByToken(token, function(res) {
                // console.log('로그인 성공' , res);
                var resUserTemp = JSON.parse(angular.toJson(res));
                var resUser = {
                  role: {
                    title: resUserTemp.role,
                    bitMask: parseInt(resUserTemp.mask, 10)
                  }
                };

                delete resUserTemp.mask;
                delete resUserTemp.role;
                angular.extend(resUser, resUserTemp);

                // console.info(res_user);
                changeUser(resUser);
                // console.log(rScope.currentUser);
                success(resUser);

              }, function(err) {
                // console.log('로그인 에러남');
                AuthPersistance.clearAll();
                initUser();
                error(err);
              });
            },

            login: function(user, success, error) {

              AuthServer.login(user, function(res) {
                // console.log('로그인 성공' , res);
                var resUserTemp = JSON.parse(angular.toJson(res));
                var resUser = {
                  role: {
                    title: resUserTemp.role,
                    bitMask: parseInt(resUserTemp.mask, 10)
                  }
                };

                delete resUserTemp.mask;
                delete resUserTemp.role;
                angular.extend(resUser, resUserTemp);

                // console.info(res_user);
                changeUser(resUser);
                // console.log(rScope.currentUser);
                success(resUser);

              }, function(err) {
                // console.log('로그인 에러남');
                AuthPersistance.clearAll();
                initUser();
                error(err);
              });
            },

            logout: function(success) {
              // console.info('Auth logout');
              AuthPersistance.clearAll();
              initUser();
              // console.info(rScope.currentUser);
              success(rScope.currentUser);
            },
          };
        }
      };
    });


angular.module('richu.auth')
  .factory('AuthPersistance',
    function(localStorageService, USER_ROLES) {
      var initUser = {
        role: USER_ROLES.public
      };

      return {
        clearAll: function() {
          localStorageService.clearAll();
          // console.info('CLEAR ALL!!!!');
          localStorageService.set('user', initUser);
          // console.info('Local DB CLEAR');
        },

        user: function() {
          return localStorageService.get('user');
        },

        changeUser: function(newUser) {
          // console.info('로컬스토리지 유저 변경', newUser);
          localStorageService.set('user', newUser);
        }
      };
    }
  );
