// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

contract SimpleStorage {
  uint ipfsHash;

  function set(uint x) public {
    ipfsHash = x;
  }

  function get() public view returns (uint) {
    return ipfsHash;
  }
}
