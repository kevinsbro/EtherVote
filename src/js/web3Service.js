(function () {
    var app = angular.module('App')
	app.service('web3Service', function() {
		var web3Provider = null;
		var contracts = {};
		
		// Init web3
		if (typeof web3 !== 'undefined') {
			web3Provider = web3.currentProvider;
			web3 = new Web3(web3Provider);
		}
		
		/////////////////////////////////////////////
		// Gets if web3 is enabled on this browser //
		/////////////////////////////////////////////
		this.browserEnabled = function() {
			return (web3Provider != null);
		}
		
		///////////////////////////////
		// Gets all loaded contracts //
		///////////////////////////////
		this.getLoadedContracts = function() {
			return contracts;
		}
		
		////////////////////////////////////////////////
		// Load contract artifact from the given JSON //
		////////////////////////////////////////////////
		this.loadContractJSON = function(name, jsonURL, callback) {
			/*
			$.getJSON(jsonURL, function(data) {
				var artifact = data;
				contracts[name] = TruffleContract(artifact);
				contracts[name].setProvider(web3Provider);
				if(callback) callback(contracts[name]);
			});
			*/
			
			return $.getJSON(jsonURL).then(function(data) {
				var artifact = data;
				var contract = TruffleContract(artifact);
				contract.setProvider(web3Provider);
				contracts[name] = contract;
				
				return contract
			});
		}
		
		///////////////////////////////////////////////////////////
		// Gets the deployed instance of the given contract name //
		///////////////////////////////////////////////////////////
		this.deployed = function(name) {
			return contracts[name].deployed();
		}
		
	});
}());