app.controller('LoginController', LoginController);
	LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;
        vm.login = login;
        (function initController(){
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
 
        function login() {
            vm.dataLoading = true;
			var passHash= CryptoJS.SHA1(vm.password).toString()
            AuthenticationService.Login(vm.username, passHash,vm.serverIp, function (response){
                if(response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password, vm.serverIp);
                    $location.path('home');
                } else {
                    FlashService.Error(response.message);
					vm.errorMsg="Incorrect user or password"
                    vm.dataLoading = false;
                }
            });
        };
};