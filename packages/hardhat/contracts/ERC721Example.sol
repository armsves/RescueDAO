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

        eaddress owner = FHE.fromExternal(encryptedOwner, inputProof);
        _encryptedOwners[tokenId] = owner;
        _publicTokenURIs[tokenId] = publicURI;
        _encryptedTokenURIs[tokenId] = encryptedURI;
        _allTokens.push(tokenId);

        // Grant permissions
        FHE.allowThis(owner);
        FHE.allow(owner, msg.sender);

        emit NFTMinted(tokenId, publicURI, encryptedURI);

        return tokenId;
    }

    /// @notice Transfer NFT to encrypted recipient
    /// @param tokenId The token to transfer
    /// @param to The recipient address in plaintext (for verification and event emission)
    /// @param encryptedTo The encrypted address of the recipient  
    /// @param inputProof The proof for the encrypted address
    /// @dev Only the current token owner can transfer
    function confidentialTransfer(
        uint256 tokenId,
        address to,
        externalEaddress encryptedTo,
        bytes calldata inputProof
    ) public virtual {
        require(_exists(tokenId), TokenDoesNotExist(tokenId));
        require(to != address(0), InvalidReceiver(address(0)));

        // Get current encrypted owner
        eaddress currentOwner = _encryptedOwners[tokenId];
        require(FHE.isInitialized(currentOwner), UnauthorizedCaller(msg.sender));

        // Check if caller is the current owner
        ebool isOwner = FHE.eq(currentOwner, FHE.asEaddress(msg.sender));
        
        // Decrypt new owner address
        eaddress newOwner = FHE.fromExternal(encryptedTo, inputProof);
        
        // Only update if caller is owner, otherwise keep current owner
        // This will make the transfer fail silently if caller is not owner
        // In a production system, you'd want to decrypt isOwner and revert
        eaddress finalOwner = FHE.select(isOwner, newOwner, currentOwner);
        _encryptedOwners[tokenId] = finalOwner;

        // Grant permissions to the final owner (whether changed or not)
        FHE.allowThis(finalOwner);
        FHE.allow(finalOwner, to);
        FHE.allow(finalOwner, msg.sender);
        FHE.allow(finalOwner, owner());

        emit Transfer(tokenId, msg.sender, to);
    }

    /// @notice Get the encrypted owner of a token
    function encryptedOwnerOf(uint256 tokenId) external view returns (eaddress) {
        require(_exists(tokenId), TokenDoesNotExist(tokenId));
        return _encryptedOwners[tokenId];
    }

    /// @notice Check if an address is the owner of a token (returns encrypted bool)
    /// @param tokenId The token ID to check
    /// @param account The address to check ownership for
    /// @return An encrypted boolean indicating ownership
    function isOwnerOf(uint256 tokenId, address account) external returns (ebool) {
        require(_exists(tokenId), TokenDoesNotExist(tokenId));
        eaddress currentOwner = _encryptedOwners[tokenId];
        return FHE.eq(currentOwner, FHE.asEaddress(account));
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
