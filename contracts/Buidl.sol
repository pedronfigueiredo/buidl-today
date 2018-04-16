pragma solidity ^0.4.19;

import "./zeppelin/Destructible.sol";

contract Buidl is Destructible {
    address private owner;

    // Address => numberOfAgreements
    mapping(address => uint) numberOfAgreements;

    // Address => (pledgeId => stakeAmount)
    mapping(address => mapping(uint => uint) agreementStake;

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

    function createAgreement(address _address) public payable {
        agreementStake[_address[numberOfAgreements[_address]]] = msg.value;
        numberOfAgreements[_address] += 1;
    }

    function getNumberOfAgreements(address _address) public view returns (uint) {
        return numberOfAgreements[_address];
    }

    function getAgreementStake(address _address, uint _agreementId) public view returns (uint) {
        return (
            agreementStake[_address[_agreementId]]
        );
    }

    function withdraw(address _address, uint _agreementId) public payable {
        _address.transfer(agreementStake[_address[_agreementId]]);
        agreementStake[_address[_agreementId]] = 0;
    }
}
