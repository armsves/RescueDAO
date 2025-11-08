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

// Decorative arcade paw + pet icons
const PawPrintSvg = ({ className = "w-24 h-24 text-black/8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden>
    <path d="M32 44c-7 0-12 6-12 8s5 4 12 4 12-2 12-4-5-8-12-8zm-14-12c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14-6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14 6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z" />
  </svg>
);

const ArcadeDogSvg = ({ className = "w-12 h-12 text-[#2D2D2D]" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    <g fill="currentColor">
      <rect x="6" y="4" width="6" height="10" />
      <rect x="12" y="8" width="4" height="6" />
      <rect x="34" y="4" width="6" height="10" />
      <rect x="30" y="8" width="4" height="6" />
      <rect x="10" y="14" width="20" height="10" />
      <rect x="8" y="22" width="24" height="10" />
      <rect x="28" y="20" width="18" height="8" />
      <rect x="36" y="18" width="10" height="4" />
      <rect x="44" y="16" width="6" height="4" />
    </g>
  </svg>
);

const ArcadeCatSvg = ({ className = "w-12 h-12 text-[#2D2D2D]" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    <g fill="currentColor">
      <rect x="12" y="6" width="6" height="10" />
      <rect x="34" y="6" width="6" height="10" />
      <rect x="16" y="16" width="16" height="8" />
      <rect x="14" y="22" width="20" height="8" />
      <rect x="12" y="30" width="24" height="10" />
      <rect x="10" y="40" width="20" height="8" />
    </g>
  </svg>
);

const ArcadeRabbitSvg = ({ className = "w-10 h-10 text-[#2D2D2D]" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    <g fill="currentColor">
      <rect x="22" y="4" width="4" height="10" />
      <rect x="28" y="4" width="4" height="10" />
      <rect x="18" y="14" width="16" height="10" />
      <rect x="14" y="24" width="24" height="12" />
      <rect x="16" y="36" width="6" height="6" />
      <rect x="30" y="36" width="6" height="6" />
    </g>
  </svg>
);

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

  const sectionClass = "bg-white shadow-lg p-6 mb-8 rounded-2xl border border-gray-100 text-gray-900";
  const cardClass = "bg-white border border-gray-300 shadow-md hover:shadow-xl transition-shadow duration-300 p-4 rounded-2xl";

  if (!isConnected) {
    return (
      <div className="relative max-w-6xl mx-auto p-6 space-y-10 bg-gray-50 min-h-screen">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9E6] via-[#FFF3CC] to-[#F8F4E6] opacity-60" />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white shadow-xl p-8 text-center rounded-2xl border border-gray-100">
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
    <div className="relative max-w-7xl mx-auto p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* subtle yellow tint + repeating paw texture behind the page */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9E6] via-[#FFF3CC] to-[#F8F4E6] opacity-60" />
        <div
          className="absolute inset-0 bg-repeat opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>%3Cpath fill='%23FFD208' opacity='0.06' d='M32 44c-7 0-12 6-12 8s5 4 12 4 12-2 12-4-5-8-12-8zm-14-12c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14-6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14 6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z'/%3E%3C/svg%3E\")",
            backgroundSize: "160px 160px",
          }}
        />
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFD208] via-[#FFE883] to-[#FFF9D1] border border-[#F6D75A] shadow-xl">
        <div className="absolute -top-12 -right-10 h-36 w-36 rounded-full bg-white/30" />
        <div className="absolute -bottom-14 -left-6 h-40 w-40 rounded-full bg-white/20" />
        
        {/* Decorative pet icons */}
        <div className="absolute -top-8 -right-12 pointer-events-none transform rotate-6 opacity-20">
          <ArcadeDogSvg className="w-64 h-64" />
        </div>
        <div className="absolute -bottom-14 -left-12 pointer-events-none transform -rotate-6 opacity-16">
          <ArcadeCatSvg className="w-56 h-56" />
        </div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none transform rotate-3 opacity-12">
          <ArcadeRabbitSvg className="w-48 h-48" />
        </div>
        
        {/* Paw prints */}
        <div className="absolute top-6 left-6 pointer-events-none opacity-5">
          <PawPrintSvg className="w-28 h-28" />
        </div>
        <div className="absolute bottom-8 right-20 pointer-events-none opacity-6">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        
        <div className="relative px-8 py-10">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#2D2D2D]">
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-[11px]">
              <span role="img" aria-label="gallery" className="text-lg">
                🖼️
              </span>
              <span className="normal-case">RescueDAO</span> NFT Gallery
            </span>
            <span className="inline-flex items-center gap-2 bg-[#2D2D2D] text-[#FFD208] px-4 py-2 rounded-full border border-black/20 shadow-sm text-xs font-bold uppercase tracking-wide">
              {nfts.length} NFT{nfts.length === 1 ? "" : "s"}
            </span>
          </div>
          <h1 className="mt-5 text-4xl md:text-[42px] font-extrabold tracking-tight text-[#2D2D2D]">
            <span className="normal-case">RescueDAO</span> — NFT Gallery
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
            Browse all minted Pet NFTs with their public information and private medical records (owner access only).
          </p>
          <div className="mt-6">
            <button
              onClick={() => refetchTokens()}
              className="inline-flex items-center justify-center px-6 py-3 font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-xl bg-[#FFD208] text-[#2D2D2D] hover:bg-[#E0B800] focus-visible:ring-[#E0B800]"
            >
              🔄 Refresh Gallery
            </button>
          </div>
        </div>
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