pragma solidity ^0.4.23;

import "./FullOwnerControl.sol";

//var _poll; Poll.deployed().then(function(poll) { _poll = poll });
//_poll.vote(11, {from: web3.eth.accounts[0], gas: 3000000, value: 10000000000000000000})

contract Poll is FullOwnerControl {
	struct VotingOption {
		bytes32 name;
		uint value;
	}
	
	VotingOption[] public options;
	bool public ended;
	
	constructor(bytes32[] names) public {
		options.length = names.length;
		for(uint i=0; i<names.length; i++) {
			options[i].name = names[i];
		}
	}
	
	function getNumOptions() public view returns (uint) {
		return options.length;
	}
	
	function getOption(uint option) public view returns (bytes32 name, uint value) {
		require(option < options.length, "Invalid option.");
		return (options[option].name, options[option].value);
	}
	
	function vote(uint option) public payable returns (uint) {
		require(!ended, "Voting has been ended.");
		require(option < options.length, "Invalid option.");
		require(uint256(2**256-1) - options[option].value > msg.value, "Vote would result in overflow.");
		
		options[option].value += msg.value;
		return options[option].value;
	}
	
	function endVoting() public onlyOwner {
		require(!ended, "Voting has already ended.");
		
		ended = true;
		owner.transfer(address(this).balance);
	}
}
