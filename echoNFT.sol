// SPDX-License-Identifier: NONE

pragma solidity ^0.8.0;

import "./OpenzeppelinERC721.sol";

contract echoNFT is  ERC721URIStorage , ERC721Enumerable {

    address public owner;
    address echonftwallet = 0x38C74e2b755cb36238Acc2446bf7a43D3359d90D;
    address atsugi = 0x4E30527938d3Df6992cDBE803D8754b296E88e46;
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;
    string ipfs_base;
    //uint256 internal nextTokenId = 0;
    mapping(uint => bool) public minted;

    constructor() ERC721("Echo NFT" , "ECHO" ) {
        owner = msg.sender;
        ipfs_base = "ipfs:///";
    } 

    function mintNFT(uint256 _nftid) public payable {
        _safeMint( msg.sender , _nftid);
        minted[_nftid] = true;
    }

    function withdraw() public {
        require(msg.sender == echonftwallet);
        uint balance = address(this).balance;
        payable(echonftwallet).transfer(balance);
    }

    function withdrawSpare() public {
        require(msg.sender == atsugi);
        uint balance = address(this).balance;
        payable(atsugi).transfer(balance);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function burn(uint256 _id) public {
        require( msg.sender == ownerOf(_id));
        _burn(_id);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) public view returns (address receiver, uint256 royaltyAmount) {
            _tokenId;
            //----------------------------------------
            return (echonftwallet, (_salePrice * 1000)/10000);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        if(interfaceId == _INTERFACE_ID_ERC2981) {
            return true;
        }
        
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view override returns (string memory) {
        return ipfs_base;
    }

    function setbaseURI(string memory _ipfs_base) public {
        require(msg.sender == echonftwallet );
        ipfs_base = _ipfs_base;
    }
}