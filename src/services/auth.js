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
