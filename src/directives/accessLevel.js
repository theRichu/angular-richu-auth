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
