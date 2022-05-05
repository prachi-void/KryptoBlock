pragma solidity 0.5.16;

contract fileStore{
string Hash;

function set(string memory _Hash)public
{
Hash=_Hash;
}
function get() public view returns(string memory){
return Hash;
}
}