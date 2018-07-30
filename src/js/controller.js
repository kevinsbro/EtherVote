var app = angular.module('App', ['ngMaterial']);
app.controller('AppCtrl', function($scope, $mdDialog, $mdToast, web3Service) {	
	
	web3Service.loadContractJSON('Poll', 'contracts/Poll.json').then(function(contract) {
		web3Service.deployed('Poll').then(function(instance) {
			var pollInstance = instance;
			pollInstance.getNumOptions.call().then(function(result) {
				$scope.options = [];
				var totalOptions = result.toNumber();
				for(var i=0; i<totalOptions; i++) {
					pollInstance.getOption.call(i).then(function(result) {
						var name = web3.toUtf8(result[0]);
						$scope.options.push({
							index: $scope.options.length,
							name: name,
							image: name=='Ethereum'?'ethereum.png':'etherclassic.png',
							amount: result[1].toNumber()/1000000000000000000,
							percentage: 0.0
						});
						
						if($scope.options.length == totalOptions) {
							var totalAmount = 0;
							for(var j=0; j<totalOptions; j++) totalAmount += $scope.options[j].amount;
							for(var j=0; j<totalOptions; j++) {
								var option = $scope.options[j];
								if(option.amount > 0) option.percentage = option.amount/totalAmount;
							}
							$scope.$apply();
						}
					});
				}
			});
		});
	});
	
	$scope.web3Enabled = web3Service.browserEnabled();
	
	$scope.options = [];
	
	$scope.vote = function(option, ev) {
		var confirm = $mdDialog.prompt()
			.title('Voting For: ' + option.name)
			.textContent('Send Ether to vote.')
			.clickOutsideToClose(true)
			.placeholder('Amount')
			.ariaLabel('Amount')
			.targetEvent(ev)
			.ok('Vote!')
			.cancel('Cancel');

		$mdDialog.show(confirm).then(function(result) {
			var amount = parseFloat(result);
			if(isNaN(amount)) {
				notify('Invalid vote amount.');
				return;
			}
			
			web3Service.deployed('Poll').then(function(instance) {
				var pollInstance = instance;
				pollInstance.vote(option.index, {from: web3.eth.accounts[0], gas: 3000000, value: amount*1000000000000000000});
			});
		});
	};
	
	$scope.endVoting = function(ev) {
		var confirm = $mdDialog.confirm()
			.title('Are you sure you want to end the voting?')
			.textContent('All funds will be transferred to the owner account.')
			.clickOutsideToClose(true)
			.ariaLabel('Lucky day')
			.targetEvent(ev)
			.ok('End Voting')
			.cancel('Cancel');

		$mdDialog.show(confirm).then(function() {
			web3Service.deployed('Poll').then(function(instance) {
				var pollInstance = instance;
				pollInstance.endVoting();
			});
		});
	};

	function notify(text) {
		var toast = $mdToast.simple()
			.textContent('Invalid vote amount.')
			.highlightAction(true)
			.highlightClass('md-warn')
			.position('top right');
		$mdToast.show(toast);
	}
});
