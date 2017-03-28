'use strict';

describe('Service: Auth', function() {

  // load the controller's module
  beforeEach(module('richu.auth'));

  var Auth,
    scope,
    rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_Auth_, $rootScope) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    Auth = _Auth_;
  }));

  var $httpBackend;

  beforeEach(inject(function($injector, _AUTH_BASE_URL_, _USER_ROLES_) {

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('POST', _AUTH_BASE_URL_ + 'auth/local').respond({
      role: _USER_ROLES_.user.title,
      mask: _USER_ROLES_.user.bitMask,
    });

  }));

  afterEach(function() {
    // $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  // it('초기상태 체크', inject(function(_USER_ROLES_) {
  //   expect(rootScope.currentUser.role.title).toEqual(_USER_ROLES_.public.title);
  //   expect(rootScope.currentUser.role.bitMask).toEqual(_USER_ROLES_.public.bitMask);
  // }));
  //
  it('유저롤 체크', inject(function(_USER_ROLES_) {
    console.log('유저롤', _USER_ROLES_);
  }));

  it('엑세스레벨 체크', inject(function(_ACCESS_LEVELS_) {
    console.log('엑세스 레벨', _ACCESS_LEVELS_);
  }));

  it('접근 권한 테스트', inject(function(_USER_ROLES_, _ACCESS_LEVELS_) {
    //퍼블릭->퍼블릭 접근 가능
    expect(Auth.authorize(_ACCESS_LEVELS_.public, _USER_ROLES_.public)).not.toEqual(0);
    //퍼블릭->유저 접근 불가
    expect(Auth.authorize(_ACCESS_LEVELS_.user, _USER_ROLES_.public)).toEqual(0);
    //퍼블릭->어드민 접근 불가
    expect(Auth.authorize(_ACCESS_LEVELS_.admin, _USER_ROLES_.public)).toEqual(0);

    //유저->퍼블릭 접근 가능
    expect(Auth.authorize(_ACCESS_LEVELS_.public, _USER_ROLES_.user)).not.toEqual(0);
    //유저->유저 접근 가능
    expect(Auth.authorize(_ACCESS_LEVELS_.user, _USER_ROLES_.user)).not.toEqual(0);
    //유저->어드민 접근 불가
    expect(Auth.authorize(_ACCESS_LEVELS_.admin, _USER_ROLES_.user)).toEqual(0);

    //어드민 -> 퍼블릭 접근 가능
    expect(Auth.authorize(_ACCESS_LEVELS_.public, _USER_ROLES_.admin)).not.toEqual(0);
    //어드민 -> 유저 접근 가능
    expect(Auth.authorize(_ACCESS_LEVELS_.user, _USER_ROLES_.admin)).not.toEqual(0);
    //어드민 -> 어드민 접근 가능
    expect(Auth.authorize(_ACCESS_LEVELS_.admin, _USER_ROLES_.admin)).not.toEqual(0);
  }));

  // it('관리자 로그인', inject(function(_USER_ROLES_) {
  //   Auth.login({
  //     identifier: 'therichu',
  //     password: 'flcbflcb12!'
  //   }, function(success) {
  //
  //     expect(success.role.title).toEqual(_USER_ROLES_.user.title);
  //     expect(success.role.bitMask).toEqual(_USER_ROLES_.user.bitMask);
  //
  //     expect(rootScope.currentUser.role.title).toEqual(_USER_ROLES_.user.title);
  //     expect(rootScope.currentUser.role.bitMask).toEqual(_USER_ROLES_.user.bitMask);
  //   });
  // $httpBackend.flush();
  // }));
  //
  //
  //
  // it('로그아웃', inject(function(_USER_ROLES_) {
  //   Auth.logout(function(success) {
  //     expect(success.role.title).toEqual(_USER_ROLES_.public.title);
  //     expect(success.role.bitMask).toEqual(_USER_ROLES_.public.bitMask);
  //   });
  // $httpBackend.flush();

  // }));




});



describe('Service: Auth : User', function() {
  // load the controller's module
  beforeEach(module('richu.auth'));

  var Auth,
    scope,
    rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_Auth_, $rootScope) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    Auth = _Auth_;
  }));

  var $httpBackend;

  beforeEach(inject(function($injector, _AUTH_BASE_URL_, _USER_ROLES_) {

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('POST', _AUTH_BASE_URL_ + 'auth/local').respond({
      role: _USER_ROLES_.user.title,
      mask: _USER_ROLES_.user.bitMask,
    });

  }));

  afterEach(function() {
    // $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('유저 로그인', inject(function(_USER_ROLES_) {
    Auth.login({
      identifier: 'user',
      password: 'password'
    }, function(success) {

      expect(success.role.title).toEqual(_USER_ROLES_.user.title);
      expect(success.role.bitMask).toEqual(_USER_ROLES_.user.bitMask);

      expect(rootScope.currentUser.role.title).toEqual(_USER_ROLES_.user.title);
      expect(rootScope.currentUser.role.bitMask).toEqual(_USER_ROLES_.user.bitMask);
      expect(Auth.isLoggedIn()).toBe(true);
    });
    $httpBackend.flush();
  }));

  it('로그아웃', inject(function(_USER_ROLES_) {
    Auth.logout(function(success) {
      expect(success.role.title).toEqual(_USER_ROLES_.public.title);
      expect(success.role.bitMask).toEqual(_USER_ROLES_.public.bitMask);
    });
    // $httpBackend.flush();
  }));
});


describe('Service: Auth : Admin', function() {
  // load the controller's module
  beforeEach(module('richu.auth'));

  var Auth,
    scope,
    rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_Auth_, $rootScope) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    Auth = _Auth_;
  }));

  var $httpBackend;

  beforeEach(inject(function($injector, _AUTH_BASE_URL_, _USER_ROLES_) {

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('POST', _AUTH_BASE_URL_ + 'auth/local').respond({
      role: _USER_ROLES_.admin.title,
      mask: _USER_ROLES_.admin.bitMask,
    });

  }));

  afterEach(function() {
    // $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('어드민 로그인', inject(function(_USER_ROLES_) {
    Auth.login({
      identifier: 'admin',
      password: 'password'
    }, function(success) {

      expect(success.role.title).toEqual(_USER_ROLES_.admin.title);
      expect(success.role.bitMask).toEqual(_USER_ROLES_.admin.bitMask);

      expect(rootScope.currentUser.role.title).toEqual(_USER_ROLES_.admin.title);
      expect(rootScope.currentUser.role.bitMask).toEqual(_USER_ROLES_.admin.bitMask);
      expect(Auth.isLoggedIn()).toBe(true);
    });
    $httpBackend.flush();
  }));

  it('로그아웃', inject(function(_USER_ROLES_) {
    Auth.logout(function(success) {
      expect(success.role.title).toEqual(_USER_ROLES_.public.title);
      expect(success.role.bitMask).toEqual(_USER_ROLES_.public.bitMask);
    });
    // $httpBackend.flush();
  }));
});
