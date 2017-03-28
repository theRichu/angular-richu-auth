'use strict';
/* extern authConfig */


/**
 * @ngdoc function
 * @name richu.board.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the richu.board
 */
angular
  .module('app.config', ['richu.auth'])

.constant('BASE_URL', 'http://localhost:1337/')

.constant('IMG_BASE_URL', 'http://localhost:1337/')

// .constant('IMG_BASE_URL', 'http://playgonggam.com/api/')
.run(function($rootScope, BASE_URL, IMG_BASE_URL) {
  $rootScope.BASE_URL = BASE_URL;
  $rootScope.IMG_BASE_URL = IMG_BASE_URL;
})

.config(
  function($stateProvider, ACCESS_LEVELS) {
    $stateProvider
      .state('user', {
        abstract: true,
        data: {
          access: ACCESS_LEVELS.user
        },
        url: '/user',
        template: '<ui-view/>',
      })


    .state('anon', {
      abstract: true,
      data: {
        access: ACCESS_LEVELS.anon
      },
      url: '/anon',
      template: '<ui-view/>',
    })

    .state('anon.register', {
      url: '/join',
      templateUrl: 'templates/join.html',
      controller: function($scope, $rootScope, $state, Auth, toastr) {
        $scope.checkIfEmailExists = function(input) {
          if (!input.$viewValue) {
            return;
          }
          Auth.checkUser({
            email: input.$viewValue
          }, function(success) {
            console.log(success);
            if (success.result === 'available') {
              input.$setValidity('exists', true);
            } else {
              input.$setValidity('exists', false);
            }
          }, function() {
            input.$setValidity('exists', false);
          });
        };

        $scope.checkIfExists = function(input) {
          if (!input.$viewValue) {
            return;
          }
          Auth.checkUser({
            username: input.$viewValue
          }, function(success) {
            console.log(success);
            if (success.result === 'available') {
              input.$setValidity('exists', true);
            } else {
              input.$setValidity('exists', false);
            }
          }, function() {
            input.$setValidity('exists', false);
          });
        };

        $scope.signupForm = {};
        $scope.join = function(signupForm) {
          Auth.register(signupForm,
            function(res) {
              $scope.signup.$setPristine();
              delete $scope.signupForm.password;
              $scope.confirmPassword = '';
              toastr.info(res.username + '님! 로그인해 주세요', '회원가입 성공');
              $state.go('gonggam.home');
            },
            function(err) {
              toastr.error(err, '회원가입 실패');
              delete $scope.signupForm.password;
              $scope.confirmPassword = '';

              console.error(err);
            });
        };
      }
    })


    .state('anon.findpassword', {
      url: '/findpassword',
      templateUrl: 'templates/findpassword.html',
      controllerAs: 'vm',
      controller: function(Auth) {
        var vm = this;
        vm.sent = false;
        vm.submit = function() {
          Auth.findpassword(vm.email, function(success) {
            console.log(success);
            vm.sent = true;
          }, function(err) {
            console.log(err);
          });
        };
      }
    })

    .state('user.resetpassword', {
      url: '/resetpassword',
      templateUrl: 'templates/resetpassword.html',
      controllerAs: 'vm',
      controller: function(Auth) {
        var vm = this;

        vm.submit = function() {
          Auth.resetpassword(vm.password, function(success) {
            console.log(success);
          }, function(err) {
            console.log(err);
          });
        };
      }
    })


    .state('user.my', {
      url: '/my',
      controller: function($rootScope, $scope, $state) {
        $state.go('profile.view', {
          profileId: $rootScope.currentUser.username
        });
      }
    })

    .state('user.logout', {
      url: '/logout',
      // templateUrl: 'views/user/home.html',
      controller: function($scope, $rootScope, $state, Auth) {

        Auth.logout(function() {
          // console.log('로그아웃', res);
          $state.go('gonggam.home', {
            reload: true
          });
        });
      }
    })

    .state('anon.login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: function($scope, $rootScope, $state, Auth, toastr) {
        $scope.loginForm = {};
        $scope.startLogin = function() {
          Auth.login($scope.loginForm,
            function(res) {
              $scope.login = {};
              $scope.loginForm = {};
              toastr.info(res.username + '로그인 성공', '로그인');
              $state.go('user.home');
              // $window.history.back();
            },
            function(err) {
              toastr.error('로그인 실패', '로그인');
              // $window.location.reload();
              console.error(err);
              delete $scope.loginForm.password;
            });
        };
      }
    });
  }
)

// 라우팅 설정
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
  $urlRouterProvider.rule(function($injector, $location) {
    if ($location.protocol() === 'file') {
      return;
    }

    var path = $location.path(),
      // Note: misnomer. This returns a query object, not a search string
      search = $location.search(),
      params;

    // check to see if the path already ends in '/'
    if (path[path.length - 1] === '/') {
      return;
    }

    // If there was no search string / query params, return with a `/`
    if (Object.keys(search).length === 0) {
      return path + '/';
    }

    // Otherwise build the search string and return a `/?` prefix
    params = [];
    angular.forEach(search, function(v, k) {
      params.push(k + '=' + v);
    });
    return path + '/?' + params.join('&');
  });

  // $locationProvider.html5Mode(true);
  // $locationProvider.hashPrefix('!');

  $httpProvider.interceptors.push(function($q, $location, $injector) {
    return {
      'responseError': function(response) {
        if (response.status === 401 || response.status === 403) {
          $location.path('/login');
        } else if (response.status === 508) {
          Auth.logout(function(res) {
            $location.path('/login');
          });
        }
        return $q.reject(response);
      }
    };
  });
});
