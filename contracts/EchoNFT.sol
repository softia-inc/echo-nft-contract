// SPDX-License-Identifier: NONE

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./utils/Counters.sol";

contract echoNFT is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => bool) public minted;
    // key is token id, value is community owner address.
    mapping(uint256 => address) public communityOwner;

    constructor() ERC721("Echo NFT", "ECHO") {
        _tokenIdCounter.increment();
    }

    function mint(uint256 tokenId, string memory _tokenURI) public payable {
        require(tokenId == _tokenIdCounter.current());
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        minted[tokenId] = true;
        communityOwner[tokenId] = msg.sender;
    }

    function bulkMint(
        uint256 numberOfToken,
        uint256 tokenId,
        string memory _tokenURI
    ) public payable {
        require(tokenId == _tokenIdCounter.current());
        require(numberOfToken <= 100);
        for (uint256 i = 0; i < numberOfToken; i++) {
            uint256 id = tokenId + i;
            mint(id, _tokenURI);
        }
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        override(ERC721URIStorage)
    {
        super._setTokenURI(tokenId, _tokenURI);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function burn(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId));
        _burn(tokenId);
        minted[tokenId] = false;
        communityOwner[tokenId] = address(0);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        if (interfaceId == _INTERFACE_ID_ERC2981) {
            return true;
        }

        return super.supportsInterface(interfaceId);
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function isExistToken(uint256 tokenId) public view returns (bool) {
        return minted[tokenId];
    }

    function setCommunityOwner(uint256[] memory tokenIds, address newAddress)
        public
    {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(communityOwner[tokenIds[i]] == msg.sender);
            require(minted[tokenIds[i]]);
            communityOwner[tokenIds[i]] = newAddress;
        }
    }

    function getCommunityOwner(uint256 tokenId) public view returns (address) {
        return communityOwner[tokenId];
    }
}
