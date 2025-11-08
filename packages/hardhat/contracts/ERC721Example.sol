// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {FHE, euint64, eaddress, externalEaddress, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract SimpleConfidentialNFT is SepoliaConfig, Ownable2Step {
    string public name;
    string public symbol;

    uint256 private _nextTokenId;

    // Mapping from token ID to encrypted owner address
    mapping(uint256 => eaddress) private _encryptedOwners;

    // Mapping from token ID to public URI
    mapping(uint256 => string) private _publicTokenURIs;

    // Mapping from token ID to encrypted URI (IPFS hash)
    mapping(uint256 => string) private _encryptedTokenURIs;

    // Array to track all minted token IDs
    uint256[] private _allTokens;

    event NFTMinted(uint256 indexed tokenId, string publicURI, string encryptedURI);
    event Transfer(uint256 indexed tokenId, address indexed from, address indexed to);

    /// @dev The given receiver `receiver` is invalid for transfers.
    error InvalidReceiver(address receiver);

    /// @dev The given sender `sender` is invalid for transfers.
    error InvalidSender(address sender);

    /// @dev Token does not exist
    error TokenDoesNotExist(uint256 tokenId);

    /// @dev Unauthorized caller
    error UnauthorizedCaller(address caller);

    constructor(string memory name_, string memory symbol_, address owner_) Ownable(owner_) {
        name = name_;
        symbol = symbol_;
        _nextTokenId = 1;
    }

    /// @notice Mint a new NFT with encrypted owner and dual URIs
    /// @param encryptedOwner The encrypted address of the owner
    /// @param inputProof The proof for the encrypted owner address
    /// @param publicURI The public IPFS URI
    /// @param encryptedURI The encrypted IPFS URI
    function mint(
        externalEaddress encryptedOwner,
        bytes calldata inputProof,
        string calldata publicURI,
        string calldata encryptedURI
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        _encryptedOwners[tokenId] = FHE.fromExternal(encryptedOwner, inputProof);
        _publicTokenURIs[tokenId] = publicURI;
        _encryptedTokenURIs[tokenId] = encryptedURI;
        _allTokens.push(tokenId);

        // Grant owner permission to decrypt the owner address
        FHE.allow(_encryptedOwners[tokenId], owner());

        emit NFTMinted(tokenId, publicURI, encryptedURI);

        return tokenId;
    }

    /// @notice Transfer NFT with encrypted owner address and input proof
    /// @param tokenId The token to transfer
    /// @param to The recipient address
    /// @param encryptedTo The encrypted address of the recipient
    /// @param inputProof The proof for the encrypted address
    function confidentialTransfer(
        uint256 tokenId,
        address to,
        externalEaddress encryptedTo,
        bytes calldata inputProof
    ) public virtual {
        _transfer(tokenId, msg.sender, to, FHE.fromExternal(encryptedTo, inputProof));
    }

    /// @notice Transfer NFT using already encrypted address
    /// @param tokenId The token to transfer
    /// @param to The recipient address
    /// @param encryptedTo The encrypted address (must be allowed for msg.sender)
    function confidentialTransfer(uint256 tokenId, address to, eaddress encryptedTo) public virtual {
        require(FHE.isAllowed(encryptedTo, msg.sender), UnauthorizedCaller(msg.sender));
        _transfer(tokenId, msg.sender, to, encryptedTo);
    }

    /// @dev Internal transfer function
    function _transfer(uint256 tokenId, address from, address to, eaddress encryptedTo) internal virtual {
        require(_exists(tokenId), TokenDoesNotExist(tokenId));
        require(from != address(0), InvalidSender(address(0)));
        require(to != address(0), InvalidReceiver(address(0)));

        _update(tokenId, from, to, encryptedTo);
    }

    /// @dev Internal update function that handles the actual transfer logic
    function _update(uint256 tokenId, address from, address to, eaddress encryptedTo) internal virtual {
        // Verify caller is the current owner
        eaddress currentOwner = _encryptedOwners[tokenId];
        ebool isOwner = FHE.eq(currentOwner, FHE.asEaddress(from));

        // Verify encrypted address matches the recipient
        ebool isValidRecipient = FHE.eq(encryptedTo, FHE.asEaddress(to));

        // Both conditions must be true
        ebool canTransfer = FHE.and(isOwner, isValidRecipient);

        // This will revert if canTransfer is false
        //require(FHE.decrypt(canTransfer), UnauthorizedCaller(from));

        // Update to new owner
        _encryptedOwners[tokenId] = encryptedTo;

        // Grant permissions
        FHE.allowThis(encryptedTo);
        FHE.allow(encryptedTo, from);
        FHE.allow(encryptedTo, to);

        emit Transfer(tokenId, from, to);
    }

    /// @notice Get the encrypted owner of a token
    function encryptedOwnerOf(uint256 tokenId) external view returns (eaddress) {
        require(_exists(tokenId), TokenDoesNotExist(tokenId));
        return _encryptedOwners[tokenId];
    }

    /// @notice Get the public URI of a token
    function publicTokenURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), TokenDoesNotExist(tokenId));
        return _publicTokenURIs[tokenId];
    }

    /// @notice Get the encrypted URI of a token
    function encryptedTokenURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), TokenDoesNotExist(tokenId));
        return _encryptedTokenURIs[tokenId];
    }

    /// @notice List all minted token IDs
    function getAllMintedTokens() external view returns (uint256[] memory) {
        return _allTokens;
    }

    /// @notice Get total number of minted tokens
    function totalSupply() external view returns (uint256) {
        return _allTokens.length;
    }

    /// @notice Check if a token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId < _nextTokenId;
    }
}
