"use client";

import { useCallback, useMemo, useState } from "react";
import { useDeployedContractInfo } from "../helper";
import { useWagmiEthers } from "../wagmi/useWagmiEthers";
import { FhevmInstance } from "@fhevm-sdk";
import { toHex, useFHEEncryption } from "@fhevm-sdk";
import { ethers } from "ethers";
import type { Contract } from "~~/utils/helper/contract";
import type { AllowedChainIds } from "~~/utils/helper/networks";

/**
 * useNFTMint - Hook for minting NFTs with encrypted owner
 *
 * What it does:
 * - Encrypts the owner address
 * - Calls the mint function with encrypted owner and URIs
 * - Returns minting status and functions
 */
export const useNFTMint = (parameters: {
  instance: FhevmInstance | undefined;
  initialMockChains?: Readonly<Record<number, string>>;
}) => {
  const { instance, initialMockChains } = parameters;

  // Wagmi + ethers interop
  const { chainId, accounts, isConnected, ethersSigner } = useWagmiEthers(initialMockChains);

  // Resolve deployed contract info once we know the chain
  const allowedChainId = typeof chainId === "number" ? (chainId as AllowedChainIds) : undefined;
  const { data: nftContract } = useDeployedContractInfo({
    contractName: "SimpleConfidentialNFT",
    chainId: allowedChainId,
  });

  // Status
  const [message, setMessage] = useState<string>("");
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [lastMintedTokenId, setLastMintedTokenId] = useState<bigint | undefined>(undefined);

  type NFTContractInfo = Contract<"SimpleConfidentialNFT"> & { chainId?: number };

  // Helpers
  const hasContract = Boolean(nftContract?.address && nftContract?.abi);
  const hasSigner = Boolean(ethersSigner);

  const getContract = useCallback(() => {
    if (!hasContract || !ethersSigner || !nftContract) return undefined;
    return new ethers.Contract(nftContract.address, (nftContract as NFTContractInfo).abi as any, ethersSigner);
  }, [hasContract, ethersSigner, nftContract]);

  // Encryption
  const { encryptWith } = useFHEEncryption({
    instance,
    ethersSigner: ethersSigner as any,
    contractAddress: nftContract?.address,
  });

  const canMint = useMemo(
    () => Boolean(hasContract && instance && hasSigner && !isMinting),
    [hasContract, instance, hasSigner, isMinting],
  );

  const mintNFT = useCallback(
    async (ownerAddress: string, publicURI: string, encryptedURI: string) => {
      if (isMinting || !canMint) return;

      setIsMinting(true);
      setMessage("Starting mint process...");
      setLastMintedTokenId(undefined);

      try {
        // Validate inputs
        if (!ethers.isAddress(ownerAddress)) {
          throw new Error("Invalid owner address");
        }
        if (!publicURI || !encryptedURI) {
          throw new Error("Both public and encrypted URIs are required");
        }

        setMessage("Encrypting owner address...");

        // Encrypt the owner address
        const enc = await encryptWith(builder => {
          builder.addAddress(ownerAddress);
        });

        if (!enc) {
          throw new Error("Encryption failed");
        }

        const writeContract = getContract();
        if (!writeContract) {
          throw new Error("Contract or signer not available");
        }

        setMessage("Preparing transaction...");

        // Check if user is the contract owner
        const owner = await writeContract.owner();
        const userAddress = await ethersSigner!.getAddress();
        
        if (owner.toLowerCase() !== userAddress.toLowerCase()) {
          throw new Error(`Only the contract owner can mint. Owner: ${owner}, You: ${userAddress}`);
        }

        // Build parameters for the mint function
        // Pass handles[0] and inputProof separately, then the URIs
        const params = [toHex(enc.handles[0]), toHex(enc.inputProof), publicURI, encryptedURI];

        setMessage("Sending transaction...");

        // Call the mint function
        const tx = await writeContract.mint(...params);

        setMessage("Waiting for confirmation...");
        const receipt = await tx.wait();

        // Parse the NFTMinted event to get the token ID
        const mintEvent = receipt.logs
          .map((log: any) => {
            try {
              return writeContract.interface.parseLog(log);
            } catch {
              return null;
            }
          })
          .find((parsed: any) => parsed?.name === "NFTMinted");

        const tokenId = mintEvent?.args?.tokenId;
        setLastMintedTokenId(tokenId);

        setMessage(`NFT minted successfully! Token ID: ${tokenId}`);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setMessage(`Minting failed: ${errorMessage}`);
        console.error("Minting error:", e);
      } finally {
        setIsMinting(false);
      }
    },
    [isMinting, canMint, encryptWith, getContract, ethersSigner],
  );

  return {
    contractAddress: nftContract?.address,
    canMint,
    mintNFT,
    isMinting,
    message,
    lastMintedTokenId,
    chainId,
    accounts,
    isConnected,
    ethersSigner,
  };
};
