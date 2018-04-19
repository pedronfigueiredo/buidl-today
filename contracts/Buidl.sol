pragma solidity ^0.4.19;

import "./zeppelin/Destructible.sol";

contract Buidl is Destructible {
    address public owner;

    mapping(bytes32 => uint) agreementStake;

    function Buidl() public payable {
        owner = msg.sender;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function setOwner(address _newOwner) public {
        owner = _newOwner;
    }

    function createAgreement(bytes32 _agreementId) public payable {
        agreementStake[_agreementId] = msg.value;
    }

    function getAgreementStake(bytes32 _agreementId) public view returns (uint) {
        return (
            agreementStake[_agreementId]
        );
    }

    function withdraw(address _address, bytes32 _agreementId) public payable {
        _address.transfer(agreementStake[_agreementId]);
        agreementStake[_agreementId] = 0;
    }
}
