var authConfig = {
  roles: [
    'public',
    'user',
    'lecturer',
    'orgadmin',
    'admin'
  ],
  accessLevels: {
    'public': '*',
    'anon': ['public'],
    'user': ['user', 'admin'],
    'lecturer': ['lecturer', 'admin'],
    'manager': ['orgadmin', 'admin'],
    'admin': ['admin']
  }
};

var _DEBUG = true;
if (!_DEBUG) {
  console.log = function() {};
  console.info = function() {};
}
