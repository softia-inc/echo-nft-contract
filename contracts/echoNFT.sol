// SPDX-License-Identifier: NONE

pragma solidity ^0.8.0;

import "./OpenzeppelinERC721.sol";
import "./Counter.sol";

contract echoNFT is  ERC721URIStorage , ERC721Enumerable {
    using Counters for Counters.Counter;
    address public owner;
    address echonftwallet = 0x38C74e2b755cb36238Acc2446bf7a43D3359d90D;
    address echonftwalletSpare = 0x4E30527938d3Df6992cDBE803D8754b296E88e46;
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;
    Counters.Counter private _tokenIdTracker;
    mapping(uint => bool) public minted;

    constructor() ERC721("Echo NFT" , "ECHO" ) {
        owner = msg.sender;
    } 

    function mintNFT(string memory _tokenURI) public payable returns (uint256) {
        _safeMint( msg.sender , _tokenIdTracker.current());
        setTokenURI(_tokenIdTracker.current(), _tokenURI);
        minted[_tokenIdTracker.current()] = true;
        _tokenIdTracker.increment();
        return _tokenIdTracker.current();
    }

    function withdraw() public {
        require(msg.sender == echonftwallet);
        uint balance = address(this).balance;
        payable(echonftwallet).transfer(balance);
    }
    function withdrawSpare() public {
        require(msg.sender == echonftwalletSpare);
        uint balance = address(this).balance;
        payable(echonftwalletSpare).transfer(balance);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require( msg.sender == ownerOf(tokenId));
        _setTokenURI(tokenId, _tokenURI);
    } 

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal
        override(ERC721URIStorage)
    {
        super._setTokenURI(tokenId, _tokenURI);
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
}