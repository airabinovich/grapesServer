app.controller('RegisterController', function RegisterController($scope,$http,$location,$rootScope) {
        var vm = this;
        vm.register = register;
        function register() {
            vm.dataLoading = true;
			var passHash= CryptoJS.SHA1($scope.user.password).toString();
			$scope.user.password= passHash;
			var apiUrl='http://'+$rootScope.globals.serverIp+'/api/register';
			$http.post(apiUrl, $scope.user).success( function(){           
                        $location.path('/');
                });
        }
});