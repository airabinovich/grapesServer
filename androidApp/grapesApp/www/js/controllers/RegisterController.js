app.controller('RegisterController', function RegisterController($scope,$http,$location,$rootScope) {
        var vm = this;
        vm.register = register;
        function register() {
            vm.dataLoading = true;
			var passHash= CryptoJS.SHA1($scope.user.password).toString();
			$scope.user.password= passHash;
			$http.post('http://192.168.0.5/api/register', $scope.user).success( function(){           
                        $location.path('/');
                });
        }
});