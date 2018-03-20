pragma solidity ^0.4.19;

import "./zeppelin/Destructible.sol";

contract Buidl is Destructible {
    address private owner;
    uint public numberOfAgreements;
    
    mapping(uint => uint) agreementStake;
    
    // event LogCreateAgreement(uint agreementId, uint agreementStake);
    
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
    
    function getNumberOfAgreements() public view returns (uint) {
        return numberOfAgreements;
    }
    
    function createAgreement(uint _agreementId) public payable {
        agreementStake[_agreementId] = msg.value;
        numberOfAgreements += 1;
        // emit LogCreateAgreement(_agreementId, msg.value);
    }
    
    function getAgreementStake(uint _agreementId) public view returns (uint) {
        return (
            agreementStake[_agreementId]
        );
    }
    
    function withdraw(address _to, uint _agreementId) public payable {
        _to.transfer(agreementStake[_agreementId]);
        delete agreementStake[_agreementId];
        numberOfAgreements -= 1;
    }
}
