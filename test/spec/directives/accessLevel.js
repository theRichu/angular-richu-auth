'use strict';

describe('Directive: AccessLevel : Public', function() {

  // load the controller's module
  beforeEach(module('richu.auth'));

  var Auth,
    scope,
    rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_Auth_, $rootScope, _USER_ROLES_) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    Auth = _Auth_;
    rootScope.currentUser = {
      role: _USER_ROLES_.public
    };
    // $factory('Auth', {
    //   $scope: scope
    // });
  }));

  var publicElement, userElement, adminElement, anonElement, $scope;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope;
    publicElement = angular.element('<div access-level="public"></div>');
    anonElement = angular.element('<div access-level="anon"></div>');
    userElement = angular.element('<div access-level="user"></div>');
    adminElement = angular.element('<div access-level="admin"></div>');

    $compile(publicElement)($rootScope);
    $compile(anonElement)($rootScope);
    $compile(userElement)($rootScope);
    $compile(adminElement)($rootScope);
  }));


  it('퍼블릭 화면제어', inject(function(_USER_ROLES_) {

    expect(rootScope.currentUser.role.title).toEqual(_USER_ROLES_.public.title);
    expect(rootScope.currentUser.role.bitMask).toEqual(_USER_ROLES_.public.bitMask);

    $scope.$digest();

    // console.log(publicElement.css('display'));
    // console.log(anonElement.css('display'));
    // console.log(userElement.css('display'));
    // console.log(adminElement.css('display'));
    //


    expect(publicElement.css('display')).not.toEqual('none');
    expect(anonElement.css('display')).not.toEqual('none');
    expect(userElement.css('display')).toEqual('none');
    expect(adminElement.css('display')).toEqual('none');

  }));

});


describe('Directive: AccessLevel : User', function() {

  // load the controller's module
  beforeEach(module('richu.auth'));

  var Auth,
    scope,
    rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_Auth_, $rootScope, _USER_ROLES_) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    Auth = _Auth_;
    rootScope.currentUser = {
      role: _USER_ROLES_.user
    };
    // $factory('Auth', {
    //   $scope: scope
    // });
  }));

  var publicElement, userElement, adminElement, anonElement, $scope;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope;
    publicElement = angular.element('<div access-level="public"></div>');
    anonElement = angular.element('<div access-level="anon"></div>');
    userElement = angular.element('<div access-level="user"></div>');
    adminElement = angular.element('<div access-level="admin"></div>');

    $compile(publicElement)($rootScope);
    $compile(anonElement)($rootScope);
    $compile(userElement)($rootScope);
    $compile(adminElement)($rootScope);
  }));


  it('유저 화면제어', inject(function(_USER_ROLES_) {

    expect(rootScope.currentUser.role.title).toEqual(_USER_ROLES_.user.title);
    expect(rootScope.currentUser.role.bitMask).toEqual(_USER_ROLES_.user.bitMask);

    $scope.$digest();

    // console.log(publicElement.css('display'));
    // console.log(anonElement.css('display'));
    // console.log(userElement.css('display'));
    // console.log(adminElement.css('display'));



    expect(publicElement.css('display')).not.toEqual('none');
    expect(anonElement.css('display')).toEqual('none');
    expect(userElement.css('display')).not.toEqual('none');
    expect(adminElement.css('display')).toEqual('none');

  }));





});


describe('Directive: AccessLevel : Admin', function() {

  // load the controller's module
  beforeEach(module('richu.auth'));

  var Auth,
    scope,
    rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_Auth_, $rootScope, _USER_ROLES_) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    Auth = _Auth_;
    rootScope.currentUser = {
      role: _USER_ROLES_.admin
    };
    // $factory('Auth', {
    //   $scope: scope
    // });
  }));

  var publicElement, userElement, adminElement, anonElement, $scope;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope;
    publicElement = angular.element('<div access-level="public"></div>');
    anonElement = angular.element('<div access-level="anon"></div>');
    userElement = angular.element('<div access-level="user"></div>');
    adminElement = angular.element('<div access-level="admin"></div>');

    $compile(publicElement)($rootScope);
    $compile(anonElement)($rootScope);
    $compile(userElement)($rootScope);
    $compile(adminElement)($rootScope);
  }));


  it('어드민 화면제어', inject(function(_USER_ROLES_) {

    expect(rootScope.currentUser.role.title).toEqual(_USER_ROLES_.admin.title);
    expect(rootScope.currentUser.role.bitMask).toEqual(_USER_ROLES_.admin.bitMask);

    $scope.$digest();

    // console.log(publicElement.css('display'));
    // console.log(anonElement.css('display'));
    // console.log(userElement.css('display'));
    // console.log(adminElement.css('display'));



    expect(publicElement.css('display')).not.toEqual('none');
    expect(anonElement.css('display')).toEqual('none');
    expect(userElement.css('display')).not.toEqual('none');
    expect(adminElement.css('display')).not.toEqual('none');

  }));





});
