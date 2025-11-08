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
 * useNFTTransfer - Hook for transferring NFTs with encrypted recipient
 *
 * What it does:
 * - Encrypts the recipient address
 * - Calls the confidentialTransfer function
 * - Returns transfer status and functions
 */
export const useNFTTransfer = (parameters: {
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
  const [isTransferring, setIsTransferring] = useState<boolean>(false);

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

  const canTransfer = useMemo(
    () => Boolean(hasContract && instance && hasSigner && !isTransferring),
    [hasContract, instance, hasSigner, isTransferring],
  );

  const transferNFT = useCallback(
    async (tokenId: number, recipientAddress: string) => {
      if (isTransferring || !canTransfer) return;

      setIsTransferring(true);
      setMessage("Starting transfer process...");

      try {
        // Validate inputs
        if (!ethers.isAddress(recipientAddress)) {
          throw new Error("Invalid recipient address");
        }

        setMessage("Encrypting recipient address...");

        // Encrypt the recipient address
        const enc = await encryptWith(builder => {
          builder.addAddress(recipientAddress);
        });

        if (!enc) {
          throw new Error("Encryption failed");
        }

        const writeContract = getContract();
        if (!writeContract) {
          throw new Error("Contract or signer not available");
        }

        setMessage("Preparing transaction...");

        // Build parameters for the confidentialTransfer function
        // confidentialTransfer(uint256 tokenId, address to, externalEaddress encryptedTo, bytes calldata inputProof)
        const params = [tokenId, recipientAddress, toHex(enc.handles[0]), toHex(enc.inputProof)];

        setMessage("Sending transaction...");

        // Call the confidentialTransfer function
        const tx = await writeContract.confidentialTransfer(...params);

        setMessage("Waiting for confirmation...");
        const receipt = await tx.wait();

        setMessage(
          `NFT transferred successfully! Token ID: ${tokenId} to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`,
        );

        // Return success
        return { success: true, receipt };
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setMessage(`Transfer failed: ${errorMessage}`);
        console.error("Transfer error:", e);
        return { success: false, error: errorMessage };
      } finally {
        setIsTransferring(false);
      }
    },
    [isTransferring, canTransfer, encryptWith, getContract],
  );

  return {
    contractAddress: nftContract?.address,
    canTransfer,
    transferNFT,
    isTransferring,
    message,
    chainId,
    accounts,
    isConnected,
    ethersSigner,
  };
};
