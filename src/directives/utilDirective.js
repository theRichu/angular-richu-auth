angular.module('richu.auth')
.directive('showUser', function() {
	return {
		restrict: 'AE',
		template: '{{username}}',
		controller: function($scope, $rootScope) {
			$scope.username = $rootScope.currentUser.name;
			$rootScope.$on('USER_CHANGED', function(event, data) {
				$scope.username = data.name;
			});

		},
	};
});
