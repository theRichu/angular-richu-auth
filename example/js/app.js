'use strict';

/**
 * @ngdoc overview
 * @name boardTestApp
 * @description
 * # boardTestApp
 *
 * Main module of the application.
 */
angular
  .module('authTestApp', [
    'ui.router',
    'toastr',
    'richu.auth',
    'app.config',
  ]);
