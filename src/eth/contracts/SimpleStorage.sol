pragma solidity >=0.4.16 <0.9.0;



contract SimpleStorage{
    
    string IpfsHash;
    
    // create struct called Ipfs, which contains the hash value of ipfs.
    struct Ipfs{
        string _ipfsHash;
    }
    
    
    Ipfs[] public ipfsHashes;

    
    
    // set ipfs file hash
    function set(string memory _ipfsHash) public{
        IpfsHash = _ipfsHash;
        ipfsHashes.push(Ipfs(_ipfsHash));
    }
    
    function get() public view returns(string memory){
        return IpfsHash;
    }
    
    function array_length() public view returns(uint256){
        return ipfsHashes.length;
    }
    
    
}