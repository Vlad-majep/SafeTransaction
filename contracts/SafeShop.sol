// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract SafeShop {
    address payable public seller;
    address payable public buyer;
    uint public price;
    uint public totalSupply;

    enum Status {
        Created,
        Locked, 
        Release,
        Inactive
    }

    Status public status;

    modifier onlyBuyer {
        require(msg.sender == buyer, "You are not buyer");
        _;
    }

    modifier onlySeller {
        require(msg.sender == seller, "You are not seller");
        _;
    }

    modifier inStatus(Status _status) {
        require(status == _status, "Invalid state");
        _;
    }

    constructor (
        uint _price, uint _totalSupply)
    {
        seller = payable(msg.sender);
        price = _price;
        totalSupply = _totalSupply;
    }

    function confirmPurchase() external payable inStatus(Status.Created) {
        require(msg.value == 2 * price, "Pending don't x2 price");
        buyer = payable(msg.sender);
        status = Status.Locked;
    }

    function comfirmRecieved() external inStatus(Status.Locked) onlyBuyer {
        status = Status.Release;
        buyer.transfer(price);
    }

    function paySeller() external payable onlySeller inStatus(Status.Release) {
        status = Status.Inactive;
        seller.transfer(3 * price);
    }

    function abort() external onlySeller inStatus(Status.Created) {
        status = Status.Inactive;
        seller.transfer(address(this).balance); 
    }
}
