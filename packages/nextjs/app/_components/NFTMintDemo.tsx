"use client";

import { useMemo, useState } from "react";
import { useFhevm } from "@fhevm-sdk";
import { useAccount, useReadContract } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { useNFTMint } from "~~/hooks/nft-mint/useNFTMint";

/*
 * NFT Mint React component with a form to mint NFTs
 * Fields:
 *  - Owner Address: The encrypted owner address
 *  - Public URI: The public IPFS URI
 *  - Encrypted URI: The encrypted IPFS URI
 */
export const NFTMintDemo = () => {
  const { isConnected, chain, address } = useAccount();

  const chainId = chain?.id;

  //////////////////////////////////////////////////////////////////////////////
  // Form state
  //////////////////////////////////////////////////////////////////////////////
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [publicURI, setPublicURI] = useState<string>("");
  const [encryptedURI, setEncryptedURI] = useState<string>("");

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  // Create EIP-1193 provider from wagmi for FHEVM
  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;

    // Get the wallet provider from window.ethereum
    return (window as any).ethereum;
  }, []);

  const initialMockChains = { 31337: "http://localhost:8545" };

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true, // use enabled to dynamically create the instance on-demand
  });

  //////////////////////////////////////////////////////////////////////////////
  // useNFTMint is a custom hook containing all the NFT mint logic
  //////////////////////////////////////////////////////////////////////////////

  const nftMint = useNFTMint({
    instance: fhevmInstance,
    initialMockChains,
  });

  //////////////////////////////////////////////////////////////////////////////
  // Read contract owner
  //////////////////////////////////////////////////////////////////////////////

  const { data: contractOwner } = useReadContract({
    address: nftMint.contractAddress as `0x${string}` | undefined,
    abi: [
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "owner",
    query: {
      enabled: Boolean(nftMint.contractAddress),
    },
  });

  const isUserOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  //////////////////////////////////////////////////////////////////////////////
  // Form handlers
  //////////////////////////////////////////////////////////////////////////////

  const handleMint = async () => {
    if (!ownerAddress || !publicURI || !encryptedURI) {
      return;
    }
    await nftMint.mintNFT(ownerAddress, publicURI, encryptedURI);
  };

  const handleSetCurrentUserAsOwner = () => {
    if (address) {
      setOwnerAddress(address);
    }
  };

  const isFormValid = ownerAddress && publicURI && encryptedURI;

  //////////////////////////////////////////////////////////////////////////////
  // UI Styles
  //////////////////////////////////////////////////////////////////////////////

  const buttonClass =
    "inline-flex items-center justify-center px-6 py-3 font-semibold shadow-lg " +
    "transition-all duration-200 hover:scale-105 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 " +
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

  // Primary (accent) button — #FFD208 with dark text and warm hover #A38025
  const primaryButtonClass =
    buttonClass + " bg-[#FFD208] text-[#2D2D2D] hover:bg-[#A38025] focus-visible:ring-[#2D2D2D] cursor-pointer";

  // Secondary (neutral dark) button — #2D2D2D with light text and accent focus
  const secondaryButtonClass =
    buttonClass + " bg-black text-[#F4F4F4] hover:bg-[#1F1F1F] focus-visible:ring-[#FFD208] cursor-pointer";

  // Success/confirmed state — deeper gold #A38025 with dark text
  const successButtonClass =
    buttonClass + " bg-[#A38025] text-[#2D2D2D] hover:bg-[#8F6E1E] focus-visible:ring-[#2D2D2D]";

  const titleClass = "font-bold text-gray-900 text-xl mb-4 border-b-1 border-gray-700 pb-2";
  const sectionClass = "bg-[#f4f4f4] shadow-lg p-6 mb-6 text-gray-900";
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#FFD208] focus:border-transparent text-gray-900";
  const labelClass = "block text-sm font-medium text-gray-900 mb-2";

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-gray-900">
        <div className="flex items-center justify-center">
          <div className="bg-white bordershadow-xl p-8 text-center">
            <div className="mb-4">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-900/30 text-amber-400 text-3xl">
                ⚠️
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Wallet not connected</h2>
            <p className="text-gray-700 mb-6">Connect your wallet to mint NFTs.</p>
            <div className="flex items-center justify-center">
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-gray-900">
      {/* Header */}
      <div className="text-center mb-8 text-black">
        <h1 className="text-3xl font-bold mb-2">NFT Mint Demo</h1>
        <p className="text-gray-600">Mint NFTs with encrypted owner addresses using Fully Homomorphic Encryption</p>
      </div>

      {/* Owner Warning */}
      {contractOwner && !isUserOwner && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Only the contract owner can mint NFTs. The current owner is{" "}
                <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">{contractOwner}</code>
              </p>
              <p className="text-xs text-amber-700 mt-1">Your address: {address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mint Form */}
      <div className={sectionClass}>
        <h3 className={titleClass}>🎨 Mint NFT</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="ownerAddress" className={labelClass}>
              Owner Address <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="ownerAddress"
                type="text"
                placeholder="0x..."
                value={ownerAddress}
                onChange={e => setOwnerAddress(e.target.value)}
                className={inputClass}
              />
              <button onClick={handleSetCurrentUserAsOwner} className={secondaryButtonClass + " whitespace-nowrap"}>
                Use My Address
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              The address that will be the encrypted owner of this NFT. This will be encrypted on-chain.
            </p>
          </div>

          <div>
            <label htmlFor="publicURI" className={labelClass}>
              Public URI <span className="text-red-500">*</span>
            </label>
            <input
              id="publicURI"
              type="text"
              placeholder="ipfs://..."
              value={publicURI}
              onChange={e => setPublicURI(e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-gray-600 mt-1">
              The public IPFS URI for the NFT metadata (e.g., ipfs://QmXXXXXXX).
            </p>
          </div>

          <div>
            <label htmlFor="encryptedURI" className={labelClass}>
              Encrypted URI <span className="text-red-500">*</span>
            </label>
            <input
              id="encryptedURI"
              type="text"
              placeholder="ipfs://..."
              value={encryptedURI}
              onChange={e => setEncryptedURI(e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-gray-600 mt-1">
              The encrypted IPFS URI (stored on-chain but only accessible by authorized parties).
            </p>
          </div>

          <button
            className={nftMint.lastMintedTokenId ? successButtonClass : primaryButtonClass}
            disabled={!nftMint.canMint || !isFormValid}
            onClick={handleMint}
          >
            {nftMint.canMint && isFormValid
              ? nftMint.lastMintedTokenId
                ? `✅ Minted! Token ID: ${nftMint.lastMintedTokenId}`
                : "🎨 Mint NFT"
              : nftMint.isMinting
                ? "⏳ Minting..."
                : !isFormValid
                  ? "❌ Fill all fields"
                  : "❌ Cannot mint"}
          </button>
        </div>
      </div>

      {/* Messages */}
      {nftMint.message && (
        <div className={sectionClass}>
          <h3 className={titleClass}>💬 Status</h3>
          <div className="border bg-white border-gray-200 p-4">
            <p className="text-gray-800">{nftMint.message}</p>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={sectionClass}>
          <h3 className={titleClass}>🔧 FHEVM Instance</h3>
          <div className="space-y-3">
            {printProperty("Instance Status", fhevmInstance ? "✅ Connected" : "❌ Disconnected")}
            {printProperty("Status", fhevmStatus)}
            {printProperty("Error", fhevmError ?? "No errors")}
          </div>
        </div>

        <div className={sectionClass}>
          <h3 className={titleClass}>📊 Mint Status</h3>
          <div className="space-y-3">
            {printProperty("Contract Address", nftMint.contractAddress ?? "Not available")}
            {printProperty("Is Minting", nftMint.isMinting)}
            {printProperty("Can Mint", nftMint.canMint)}
            {printProperty("Last Token ID", nftMint.lastMintedTokenId?.toString() ?? "None")}
          </div>
        </div>
      </div>
    </div>
  );
};

function printProperty(name: string, value: unknown) {
  let displayValue: string;

  if (typeof value === "boolean") {
    return printBooleanProperty(name, value);
  } else if (typeof value === "string" || typeof value === "number") {
    displayValue = String(value);
  } else if (typeof value === "bigint") {
    displayValue = String(value);
  } else if (value === null) {
    displayValue = "null";
  } else if (value === undefined) {
    displayValue = "undefined";
  } else if (value instanceof Error) {
    displayValue = value.message;
  } else {
    displayValue = JSON.stringify(value);
  }
  return (
    <div className="flex justify-between items-center py-2 px-3 bg-white border border-gray-200 w-full">
      <span className="text-gray-800 font-medium">{name}</span>
      <span className="ml-2 font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 border border-gray-300 break-all">
        {displayValue}
      </span>
    </div>
  );
}

function printBooleanProperty(name: string, value: boolean) {
  return (
    <div className="flex justify-between items-center py-2 px-3  bg-white border border-gray-200 w-full">
      <span className="text-gray-700 font-medium">{name}</span>
      <span
        className={`font-mono text-sm font-semibold px-2 py-1 border ${
          value ? "text-green-800 bg-green-100 border-green-300" : "text-red-800 bg-red-100 border-red-300"
        }`}
      >
        {value ? "✓ true" : "✗ false"}
      </span>
    </div>
  );
}
