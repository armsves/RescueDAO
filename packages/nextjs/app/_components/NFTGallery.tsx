"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { PinataSDK } from "pinata";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import deployedContracts from "~~/contracts/deployedContracts";

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
});

interface NFTMetadata {
  name?: string;
  age?: string;
  location?: string;
  image?: string;
  description?: string;
}

interface MedicalRecord {
  name: string;
  cid: string;
  size: number;
  type: string;
}

interface MedicalData {
  files: MedicalRecord[];
  uploadDate: string;
}

interface NFTCardData {
  tokenId: number;
  publicURI: string;
  encryptedURI: string;
  metadata?: NFTMetadata;
  medicalData?: MedicalData;
  isLoadingMetadata: boolean;
  isLoadingMedical: boolean;
  isOwner: boolean;
  isCheckingOwnership: boolean;
}

export const NFTGallery = () => {
  const { isConnected, chain, address } = useAccount();
  const chainId = chain?.id;

  const [nfts, setNfts] = useState<NFTCardData[]>([]);
  const [expandedTokenId, setExpandedTokenId] = useState<number | null>(null);
  const [medicalAccessLinks, setMedicalAccessLinks] = useState<Record<number, Record<string, string>>>({});

  // Get contract address
  const contractAddress =
    chainId && deployedContracts[chainId]?.SimpleConfidentialNFT?.address
      ? (deployedContracts[chainId].SimpleConfidentialNFT.address as `0x${string}`)
      : undefined;

  // Get contract ABI
  const contractABI =
    chainId && deployedContracts[chainId]?.SimpleConfidentialNFT?.abi
      ? deployedContracts[chainId].SimpleConfidentialNFT.abi
      : [];

  // Read all minted token IDs
  const { data: tokenIds, refetch: refetchTokens } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getAllMintedTokens",
    query: {
      enabled: Boolean(contractAddress && isConnected),
    },
  });

  // Fetch metadata from IPFS
  const fetchMetadata = async (uri: string): Promise<NFTMetadata | undefined> => {
    try {
      if (!uri || uri === "") return undefined;

      // Extract CID from IPFS URI
      const cid = uri.replace("ipfs://", "");
      const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch metadata");

      const metadata = await response.json();
      return metadata;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return undefined;
    }
  };

  // Check if connected wallet is the owner of the NFT
  const checkOwnership = async (tokenId: number): Promise<boolean> => {
    try {
      if (!address || !contractAddress) return false;

      const response = await fetch(
        `/api/nft/check-ownership?tokenId=${tokenId}&contractAddress=${contractAddress}&walletAddress=${address}`,
      );
      const data = await response.json();
      return data.isOwner || false;
    } catch (error) {
      console.error("Error checking ownership:", error);
      return false;
    }
  };

  // Fetch medical data from Private IPFS (only if owner)
  const fetchMedicalData = async (uri: string, isOwner: boolean): Promise<MedicalData | undefined> => {
    try {
      if (!uri || uri === "" || !isOwner) return undefined;

      // Extract CID from IPFS URI
      const cid = uri.replace("ipfs://", "");

      // Create signed access link for private content
      const accessLink = await pinata.gateways.private.createAccessLink({
        cid,
        expires: 300, // 5 minutes
      });

      const response = await fetch(accessLink);
      if (!response.ok) throw new Error("Failed to fetch medical data");

      const medicalData = await response.json();
      return medicalData;
    } catch (error) {
      console.error("Error fetching medical data:", error);
      return undefined;
    }
  };

  // Create access link for individual medical file (only if owner)
  const createMedicalFileAccessLink = async (tokenId: number, cid: string): Promise<string> => {
    try {
      const accessLink = await pinata.gateways.private.createAccessLink({
        cid,
        expires: 300, // 5 minutes
      });

      setMedicalAccessLinks(prev => ({
        ...prev,
        [tokenId]: {
          ...(prev[tokenId] || {}),
          [cid]: accessLink,
        },
      }));

      return accessLink;
    } catch (error) {
      console.error("Error creating access link:", error);
      return "";
    }
  };

  // Load NFT data
  useEffect(() => {
    const loadNFTs = async () => {
      if (!tokenIds || !Array.isArray(tokenIds) || tokenIds.length === 0) {
        setNfts([]);
        return;
      }

      const nftPromises = (tokenIds as bigint[]).map(async tokenId => {
        const id = Number(tokenId);

        // Read public URI
        const publicURIResult = await fetch(`/api/nft/public-uri?tokenId=${id}&contractAddress=${contractAddress}`);
        const publicURIData = await publicURIResult.json();
        const publicURI = publicURIData.uri || "";

        // Read encrypted URI
        const encryptedURIResult = await fetch(
          `/api/nft/encrypted-uri?tokenId=${id}&contractAddress=${contractAddress}`,
        );
        const encryptedURIData = await encryptedURIResult.json();
        const encryptedURI = encryptedURIData.uri || "";

        const nftData: NFTCardData = {
          tokenId: id,
          publicURI,
          encryptedURI,
          isLoadingMetadata: true,
          isLoadingMedical: true,
          isOwner: false,
          isCheckingOwnership: true,
        };

        // Check ownership first
        checkOwnership(id).then(isOwner => {
          setNfts(prev =>
            prev.map(nft => (nft.tokenId === id ? { ...nft, isOwner, isCheckingOwnership: false } : nft)),
          );

          // Fetch medical data only if owner
          if (encryptedURI && isOwner) {
            fetchMedicalData(encryptedURI, isOwner).then(medicalData => {
              setNfts(prev =>
                prev.map(nft => (nft.tokenId === id ? { ...nft, medicalData, isLoadingMedical: false } : nft)),
              );
            });
          } else {
            setNfts(prev => prev.map(nft => (nft.tokenId === id ? { ...nft, isLoadingMedical: false } : nft)));
          }
        });

        // Fetch metadata asynchronously
        if (publicURI) {
          fetchMetadata(publicURI).then(metadata => {
            setNfts(prev =>
              prev.map(nft => (nft.tokenId === id ? { ...nft, metadata, isLoadingMetadata: false } : nft)),
            );
          });
        } else {
          nftData.isLoadingMetadata = false;
        }

        return nftData;
      });

      const loadedNFTs = await Promise.all(nftPromises);
      setNfts(loadedNFTs);
    };

    loadNFTs();
  }, [tokenIds, contractAddress, address]);

  const toggleExpanded = (tokenId: number) => {
    setExpandedTokenId(prev => (prev === tokenId ? null : tokenId));
  };

  const sectionClass = "bg-[#f4f4f4] shadow-lg p-6 mb-6 text-gray-900";
  const titleClass = "font-bold text-gray-900 text-xl mb-4 border-b-1 border-gray-700 pb-2";
  const cardClass = "bg-white border border-gray-300 shadow-md hover:shadow-xl transition-shadow duration-200 p-4";

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-gray-900">
        <div className="flex items-center justify-center">
          <div className="bg-white shadow-xl p-8 text-center">
            <div className="mb-4">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-900/30 text-amber-400 text-3xl">
                ⚠️
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Wallet not connected</h2>
            <p className="text-gray-700 mb-6">Connect your wallet to view NFTs.</p>
            <div className="flex items-center justify-center">
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 text-gray-900">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={() => refetchTokens()}
          className="mt-4 px-4 py-2 bg-[#FFD208] text-[#2D2D2D] hover:bg-[#A38025] font-semibold shadow-md transition-all"
        >
          🔄 Refresh Gallery
        </button>
      </div>

      {/* NFT Grid */}
      {nfts.length === 0 ? (
        <div className={sectionClass}>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🎨</span>
            <h3 className="text-xl font-bold mb-2">No NFTs minted yet</h3>
            <p className="text-gray-600">Be the first to mint a Pet NFT!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map(nft => (
            <div key={nft.tokenId} className={cardClass}>
              {/* Owner Indicator - Top Right of Card */}
              {nft.isOwner && (
                <div className="flex justify-end mb-2">
                  <span className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">👑 You Own This</span>
                </div>
              )}

              {/* Image with Token ID Badge Overlay */}
              <div className="mb-4 aspect-square bg-gray-200 flex items-center justify-center overflow-hidden relative">
                {/* Token ID Badge - Top Left of Image */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-[#FFD208] text-[#2D2D2D] px-3 py-1 text-sm font-bold shadow-lg">
                    Token #{nft.tokenId}
                  </span>
                </div>

                {nft.isLoadingMetadata ? (
                  <div className="animate-pulse text-gray-400">Loading...</div>
                ) : nft.metadata?.image ? (
                  <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name || `Token ${nft.tokenId}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">🐾</span>
                )}
              </div>

              {/* Public Metadata */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">
                  {nft.isLoadingMetadata ? "Loading..." : nft.metadata?.name || "Unnamed Pet"}
                </h3>

                {!nft.isLoadingMetadata && nft.metadata && (
                  <div className="text-sm space-y-1">
                    {nft.metadata.age && (
                      <p className="text-gray-700">
                        <span className="font-medium">Age:</span> {nft.metadata.age}
                      </p>
                    )}
                    {nft.metadata.location && (
                      <p className="text-gray-700">
                        <span className="font-medium">Location:</span> {nft.metadata.location}
                      </p>
                    )}
                    {nft.metadata.description && (
                      <p className="text-gray-600 text-xs italic">{nft.metadata.description}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Medical Records Section - Only accessible to owner */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleExpanded(nft.tokenId)}
                  disabled={!nft.isOwner && !nft.isCheckingOwnership}
                  className={`w-full flex justify-between items-center py-2 px-3 transition-colors ${
                    nft.isOwner
                      ? "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      : "bg-gray-50 cursor-not-allowed opacity-60"
                  }`}
                >
                  <span className="font-medium text-sm">
                    {nft.isOwner ? "🏥 Medical Records" : "🔒 Medical Records (Owner Only)"}
                  </span>
                  {nft.isOwner && <span>{expandedTokenId === nft.tokenId ? "▼" : "▶"}</span>}
                </button>

                {expandedTokenId === nft.tokenId && nft.isOwner && (
                  <div className="mt-3 space-y-2">
                    {nft.isLoadingMedical ? (
                      <p className="text-sm text-gray-500 animate-pulse">Loading medical records...</p>
                    ) : nft.medicalData ? (
                      <>
                        <p className="text-xs text-gray-600 mb-2">
                          Uploaded: {new Date(nft.medicalData.uploadDate).toLocaleDateString()}
                        </p>
                        <div className="space-y-2">
                          {nft.medicalData.files.map((file, index) => (
                            <div key={index} className="bg-gray-50 p-2 text-xs">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-gray-800">{file.name}</span>
                                <span className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                              </div>
                              <button
                                onClick={async () => {
                                  const link = await createMedicalFileAccessLink(nft.tokenId, file.cid);
                                  if (link) window.open(link, "_blank");
                                }}
                                className="text-[#FFD208] hover:text-[#A38025] text-xs underline"
                              >
                                🔒 View Private File
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No medical records available</p>
                    )}
                  </div>
                )}

                {!nft.isOwner && !nft.isCheckingOwnership && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-xs text-amber-800">
                      ⚠️ Medical records are only accessible to the NFT owner for privacy protection.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};