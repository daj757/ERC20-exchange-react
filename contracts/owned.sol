pragma solidity ^0.4.0;

contract Owned {
    address owner;
    
    modifier onlyowner(){
        if (msg.sender == owner) {
            _;
        }
    }
    
    function owned () public {
        owner = msg.sender;
    }
}