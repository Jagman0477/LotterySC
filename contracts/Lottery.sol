// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Lottery{

    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enterLottery() public payable {
        require(msg.value >= .01 ether);
        players.push(msg.sender);
    }

    function pickWinner() public managerOnly {
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }

    function random() public view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function getPlayer() public view returns(address[] memory){
        return players;
    }


    modifier managerOnly(){
        require(msg.sender == manager);
        _;
    }
}