
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
