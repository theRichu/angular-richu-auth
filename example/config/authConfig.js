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
    'findpassword': {
      method: 'POST',
      params: {
        action: 'user',
        actionId: 'findpassword',
      }
    },
    'resetpassword': {
      method: 'POST',
      params: {
        auth: 'auth',
        provider: 'local',
        action: 'reset'
      }
    },

    'checkUser': {
      method: 'GET',
      params: {
        action: 'user',
        actionId: 'check'
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
  .constant('AUTH_BASE_URL', 'http://localhost:1337/')


;
