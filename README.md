# angular-richu-auth

Angular JS 프로젝트에 권한에 관련된 기능을 추가할 수 있는 모듈입니다.

Role Based 접근 정책을 가지고 있으며 유닉스의 퍼미션과 비슷한 체계를 가지고 있습니다.

## 환경설정
Config는 두가지 방법으로 이루어 집니다. 초기 설정(pre-config)와 angular 내부에서 사용될 설정입니다.

초기 설정 파일
* pre-config.js : angular 이전에 로드해줍니다.


    var authConfig = {
      roles: [
        'public',
        'user',
        'admin'
      ],
      accessLevels: {
        'public': '*',
        'anon': ['public'],
        'user': ['user', 'admin'],
        'admin': ['admin']
      }
    };


accessLevels 는 해당 권한에 접근할수 있는 role을 정의합니다. *는 모든 역할을 의미합니다.

* authConfig.js

    angular
      .module('richu.auth.config', [])

      .constant('AUTH_PREFIX', 'rb')
      .constant('AUTH_STATE_HOME', 'user.home')
      .constant('AUTH_STATE_LOGIN', 'anon.login')
      .constant('AUTH_SERVER_CONFIG', {
        'register': {
          method: 'POST',
          params: {
            auth: 'auth',
            provider: 'local',
            action: 'register'
          }
        },
        'login': {
          method: 'POST',
          params: {
            auth: 'auth',
            provider: 'local'
          }
        },
        'checkUser': {
          method: 'GET',
          params: {
            action: 'user',
            action2: 'check'
          }
        },
        'viewUser': {
          method: 'GET',
          params: {
            action: 'user'
          }
        },
        'updateUser': {
          method: 'PUT',
          params: {
            action: 'user'
          }
        },
      })
      // .constant('AUTH_BASE_URL', 'http://new.sogangmba.com/api/');
      .constant('AUTH_BASE_URL', 'http://localhost:1337/');



## 사용법
1. 로그인과 로그아웃 기본 템플릿을 사용하고 싶다면 (직접 설치)


    <script src="bower_components/angular-richu-auth/dist/richu-auth.js"></script>
    <script src="bower_components/angular-richu-auth/dist/richu-auth-tpl.js"></script>

2. bower를 통해 설치: 사설 Bower를 통해 제공되므로 .bowerrc파일을 수정해야 합니다.


    {
      "directory": "bower_components",
      "registry": "http://bower.veroeroe.com",
      "timeout": 300000
    }

 * 설치 : `bower install --save angular-richu-auth`


2. `app.js`


    angular
      .module('authTestApp', [
        'ui.router',
        'toastr',
        'richu.config',
        'richu.auth',
        'app.config'
      ]);



2. `access-level` 디렉티브를 통해 화면 뷰를 제어합니다.


## 서버 세팅

`sails new richu_auth_server`
`npm install sails-generate-auth --save`


sails generate auth를 통해 로그인/로그아웃 등 구현

`npm install passport passport-local passport-http-bearer validator bcryptjs--save`


config/bootstrap.js 에 cb()위에



    sails.services.passport.loadStrategies();



config/policies.js 에


    '*': [ 'passport', /* your auth dependant policies go here */ ]



config/locales/en.json 에


    {
      "Error.Passport.Password.Invalid": "The provided password is invalid!",
      "Error.Passport.Password.Wrong": "Whoa, that password wasn't quite right!",
      "Error.Passport.Password.NotSet": "Oh no, you haven't set a password yet!",
      "Error.Passport.Username.NotFound": "Uhm, what's your name again?",
      "Error.Passport.User.Exists": "This username is already taken.",
      "Error.Passport.Email.NotFound": "That email doesn't seem right",
      "Error.Passport.Email.Missing": "You need to supply an email-address for verification",
      "Error.Passport.Email.Exists": "This email already exists. So try logging in.",
      "Error.Passport.Username.Missing": "You need to supply a username",
      "Error.Passport.Password.Missing": "Oh no, you haven't set a password yet!",
      "Error.Passport.Generic": "Snap. Something went wrong with authorization."
    }




config/routes.js


    'post /auth/local': 'AuthController.callback',
    'post /auth/local/:action': 'AuthController.callback',

    'get /auth/:provider': 'AuthController.provider',
    'get /auth/:provider/callback': 'AuthController.callback',
    'get /auth/:provider/:action': 'AuthController.callback',



## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
