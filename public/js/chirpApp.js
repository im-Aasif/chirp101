var app = angular.module('chirpApp', ['ngRoute','ngResource']).run(function($rootScope){
	$rootScope.authenticated = false;
	$rootScope.current_user = '';

	$rootScope.signout = function(){
		$http.get('/auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = '';
	};
});

app.config(function($routeProvider){
	$routeProvider
	//the main timeline display
	.when('/', {
		templateUrl: 'main.html',
		controller: 'mainController'
	})
	//the login page display
	.when('/login',{
		templateUrl: 'login.html',
		controller: 'authController'		
	})
	//the register page display
	.when('/register', {
		templateUrl: 'register.html',
		controller: 'authController'
	});
});

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

app.controller('mainController', function($scope, postService, $rootScope) {
	$scope.posts = postService.query();
	$scope.newPost = {
		created_by: '',
		text: '',
		created_at: ''
	};

	$scope.post = function(){
		$scope.newPost.created_by = $rootScope.current_user;
		console.log("created_by: " + $scope.created_by);
		console.log("current_user: " + $rootScope.current_user);
		$scope.newPost.created_at = Date.now();
		postService.save($scope.newPost, function(){
			$scope.posts = postService.query();
			$scope.newPost = {
				created_by: '',
				text: '',
				created_at: ''
		};
		console.log($scope.posts);
		});
	}
});


app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = 
	{
		username: '',
		password: ''
	};
	$scope.error_message = '';

	$scope.login = function(){
		//function to implement login logic
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};

	$scope.register = function(){
		//function to implement register logic
		$http.post('/auth/signup', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};
});
