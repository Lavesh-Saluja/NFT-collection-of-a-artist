pragma solidity ^0.8.17;

interface IWhitelist{
    function list(address)external view returns(bool);
}