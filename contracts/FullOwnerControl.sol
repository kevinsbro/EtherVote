pragma solidity ^0.4.23;

contract FullOwnerControl {
	address owner;
	
	modifier onlyOwner {
		require(msg.sender == owner, "Only owner can call this function.");
		_;
	}
	
	constructor() public {
		owner = msg.sender;
	}
	
	function close() public onlyOwner {
        selfdestruct(owner);
    }
}




