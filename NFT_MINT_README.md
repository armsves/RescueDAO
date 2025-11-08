# NFT Mint Page

This page allows users to mint NFTs with encrypted owner addresses using Fully Homomorphic Encryption (FHE).

## Location
- **Route**: `/nft-mint`
- **Component**: `packages/nextjs/app/_components/NFTMintDemo.tsx`
- **Hook**: `packages/nextjs/hooks/nft-mint/useNFTMint.tsx`

## Features

### Smart Contract
The page interacts with the `SimpleConfidentialNFT` contract deployed on Sepolia testnet.

### Required Fields

1. **Owner Address** (required)
   - The Ethereum address that will be the encrypted owner of the NFT
   - This address is encrypted using FHE before being stored on-chain
   - Button available to auto-fill with current user's address

2. **Public URI** (required)
   - The public IPFS URI for the NFT metadata
   - Example: `ipfs://QmXXXXXXX`
   - This is stored unencrypted and visible to everyone

3. **Encrypted URI** (required)
   - The encrypted IPFS URI
   - Stored on-chain but only accessible by authorized parties
   - Example: `ipfs://QmYYYYYYY`

## How It Works

1. **Connect Wallet**: User must connect their wallet to interact with the contract
2. **Fill Form**: Enter all three required fields
3. **Encrypt Owner**: The owner address is encrypted using the FHEVM instance
4. **Submit Transaction**: The mint function is called with:
   - Encrypted owner address
   - Proof for the encrypted address
   - Public URI
   - Encrypted URI
5. **Confirmation**: After successful minting, the Token ID is displayed

## Technical Details

### Encryption Process
- Uses `addAddress()` method from the FHEVM SDK to encrypt Ethereum addresses
- The encryption type is `externalEaddress` (external encrypted address)
- Generates a proof that is submitted along with the encrypted data

### Contract Function
```solidity
function mint(
    externalEaddress encryptedOwner,
    bytes calldata inputProof,
    string calldata publicURI,
    string calldata encryptedURI
) external onlyOwner returns (uint256)
```

**Note**: This function has `onlyOwner` modifier, meaning only the contract owner can mint NFTs.

### Hook Architecture
The `useNFTMint` hook follows the same pattern as `useFHECounterWagmi`:
- Uses `useFHEEncryption` for encrypting data
- Uses `useWagmiEthers` for wallet integration
- Uses `useDeployedContractInfo` to get contract details
- Provides status tracking and error handling

## UI Components

### Status Display
- **FHEVM Instance Status**: Shows if the FHE instance is connected
- **Mint Status**: Shows current minting state and capabilities
- **Messages**: Real-time feedback during the minting process

### Visual Design
- Uses the same color scheme as FHECounter demo
- Primary action button: Yellow (#FFD208)
- Secondary buttons: Black (#2D2D2D)
- Success state: Gold (#A38025)

## Navigation

A navigation menu has been added to the header with links to:
- FHE Counter (Home page)
- NFT Mint (New page)

Desktop: Horizontal navigation bar
Mobile: Hamburger menu

## Testing

To test the mint functionality:

1. Start the Next.js development server:
   ```bash
   pnpm start
   ```

2. Navigate to `http://localhost:3000/nft-mint`

3. Connect your wallet (must be on Sepolia testnet)

4. **Important**: Your wallet address must be the owner of the `SimpleConfidentialNFT` contract to successfully mint

5. Fill in all three fields and click "Mint NFT"

## Contract Deployment

The SimpleConfidentialNFT contract is deployed at:
- **Address**: `0x66CC4784E96980bd2aa41CFF4C967E8f9CC0A816`
- **Network**: Sepolia (Chain ID: 11155111)
- **Block**: 9582626

To deploy to other networks, use the Hardhat deployment scripts in `packages/hardhat/deploy/`.
