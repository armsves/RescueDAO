"use client";

import { useMemo, useState } from "react";
import { useFhevm } from "@fhevm-sdk";
import { useAccount, useReadContract } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { useNFTMint } from "~~/hooks/nft-mint/useNFTMint";
import { PinataSDK } from "pinata";

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

  // New state for file uploads
  const [publicMetadata, setPublicMetadata] = useState({
    name: "",
    age: "",
    location: "",
    picture: null as File | null,
  });
  const [medicalFiles, setMedicalFiles] = useState<File[]>([]);
  const [uploadingPublic, setUploadingPublic] = useState(false);
  const [uploadingPrivate, setUploadingPrivate] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

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
  // File Upload Handlers
  //////////////////////////////////////////////////////////////////////////////

  const handlePublicMetadataUpload = async () => {
    if (!publicMetadata.picture || !publicMetadata.name) {
      setUploadStatus("❌ Please provide at least a name and picture");
      return;
    }

    setUploadingPublic(true);
    setUploadStatus("⏳ Uploading public metadata...");

    try {
      // Upload picture to Public IPFS
      const pictureUpload = await pinata.upload.public.file(publicMetadata.picture);
      const pictureUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${pictureUpload.cid}`;

      // Create metadata JSON
      const metadata = {
        name: publicMetadata.name,
        age: publicMetadata.age,
        location: publicMetadata.location,
        image: pictureUrl,
        description: `Pet NFT for ${publicMetadata.name}`,
      };

      // Upload metadata JSON to Public IPFS
      const metadataUpload = await pinata.upload.public.json(metadata);
      const metadataUri = `ipfs://${metadataUpload.cid}`;

      setPublicURI(metadataUri);
      setUploadStatus("✅ Public metadata uploaded successfully!");
    } catch (error) {
      console.error("Error uploading public metadata:", error);
      setUploadStatus("❌ Error uploading public metadata");
    } finally {
      setUploadingPublic(false);
    }
  };

  const handleMedicalFilesUpload = async () => {
    if (medicalFiles.length === 0) {
      setUploadStatus("❌ Please select medical files to upload");
      return;
    }

    setUploadingPrivate(true);
    setUploadStatus("⏳ Uploading medical records...");

    try {
      // Upload medical files to Private IPFS
      const uploads = await Promise.all(medicalFiles.map(file => pinata.upload.private.file(file)));

      // Create a JSON with all medical file CIDs
      const medicalData = {
        files: uploads.map((upload, index) => ({
          name: medicalFiles[index].name,
          cid: upload.cid,
          size: upload.size,
          type: medicalFiles[index].type,
        })),
        uploadDate: new Date().toISOString(),
      };

      // Upload the medical data index to Private IPFS
      const medicalDataUpload = await pinata.upload.private.json(medicalData);
      const encryptedUri = `ipfs://${medicalDataUpload.cid}`;

      setEncryptedURI(encryptedUri);
      setUploadStatus("✅ Medical records uploaded successfully!");
    } catch (error) {
      console.error("Error uploading medical files:", error);
      setUploadStatus("❌ Error uploading medical records");
    } finally {
      setUploadingPrivate(false);
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  // UI Styles
  //////////////////////////////////////////////////////////////////////////////

  const buttonClass =
    "inline-flex items-center justify-center px-6 py-3 font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed rounded-xl";

  const primaryButtonClass = `${buttonClass} bg-[#FFD208] text-[#2D2D2D] hover:bg-[#E0B800] focus-visible:ring-[#E0B800]`;
  const secondaryButtonClass = `${buttonClass} bg-black text-[#F4F4F4] hover:bg-[#1F1F1F] focus-visible:ring-[#FFD208]`;
  const successButtonClass = `${buttonClass} bg-[#A38025] text-[#2D2D2D] hover:bg-[#8F6E1E] focus-visible:ring-[#2D2D2D]`;

  const titleClass = "font-extrabold text-[#2D2D2D] text-xl mb-3 flex items-center gap-2";
  const sectionClass = "bg-white shadow-lg p-6 mb-8 rounded-2xl border border-gray-100 text-gray-900";
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD208] text-gray-900 transition-colors";
  const labelClass = "block text-gray-700 font-semibold mb-2";

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
    <div className="relative max-w-6xl mx-auto p-6 space-y-10 bg-gray-50 min-h-screen">
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
              <span role="img" aria-label="mint" className="text-lg">
                🎨
              </span>
              <span className="normal-case">RescueDAO</span> NFT Mint
            </span>
          </div>
          <h1 className="mt-5 text-4xl md:text-[42px] font-extrabold tracking-tight text-[#2D2D2D]">
            <span className="normal-case">RescueDAO</span> — Mint Pet NFT
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
            Mint NFTs with public pet information and private medical records using Fully Homomorphic Encryption.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide">Step 1</p>
              <p className="font-semibold text-[#2D2D2D]">Upload public data</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide">Step 2</p>
              <p className="font-semibold text-[#2D2D2D]">Upload medical records</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide">Step 3</p>
              <p className="font-semibold text-[#2D2D2D]">Mint your NFT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Warning */}
      {contractOwner && !isUserOwner && (
        <div className={`${sectionClass} bg-amber-50 border-amber-300`}>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="text-3xl">⚠️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-lg mb-2">Owner-Only Access</h3>
              <p className="text-sm text-amber-800 mb-2">
                <strong>Note:</strong> Only the contract owner can mint NFTs. The current owner is:
              </p>
              <code className="block bg-amber-100 px-3 py-2 rounded-lg text-xs font-mono break-all mb-2">
                {contractOwner}
              </code>
              <p className="text-xs text-amber-700">
                <strong>Your address:</strong> {address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Public Metadata Upload Section */}
      <div className={sectionClass}>
        <h3 className={titleClass}>🖼️ Upload Public Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="petName" className={labelClass}>
              Pet Name <span className="text-red-500">*</span>
            </label>
            <input
              id="petName"
              type="text"
              placeholder="Fluffy"
              value={publicMetadata.name}
              onChange={e => setPublicMetadata({ ...publicMetadata, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="petAge" className={labelClass}>
                Age
              </label>
              <input
                id="petAge"
                type="text"
                placeholder="3 years"
                value={publicMetadata.age}
                onChange={e => setPublicMetadata({ ...publicMetadata, age: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="petLocation" className={labelClass}>
                Location
              </label>
              <input
                id="petLocation"
                type="text"
                placeholder="New York"
                value={publicMetadata.location}
                onChange={e => setPublicMetadata({ ...publicMetadata, location: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="petPicture" className={labelClass}>
              Picture <span className="text-red-500">*</span>
            </label>
            <input
              id="petPicture"
              type="file"
              accept="image/*"
              onChange={e => setPublicMetadata({ ...publicMetadata, picture: e.target.files?.[0] || null })}
              className={inputClass}
            />
            <p className="text-xs text-gray-600 mt-1">Upload a picture of your pet (publicly visible)</p>
          </div>

          <button
            onClick={handlePublicMetadataUpload}
            disabled={uploadingPublic || !publicMetadata.name || !publicMetadata.picture}
            className={primaryButtonClass}
          >
            {uploadingPublic ? "⏳ Uploading..." : "📤 Upload Public Metadata"}
          </button>

          {publicURI && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">✅ Public URI: {publicURI}</p>
            </div>
          )}
        </div>
      </div>

      {/* Medical Records Upload Section */}
      <div className={sectionClass}>
        <h3 className={titleClass}>🏥 Upload Medical Records (Private)</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="medicalFiles" className={labelClass}>
              Medical Files <span className="text-red-500">*</span>
            </label>
            <input
              id="medicalFiles"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setMedicalFiles(Array.from(e.target.files || []))}
              className={inputClass}
            />
            <p className="text-xs text-gray-600 mt-1">
              Upload medical records like weight charts, blood test PDFs, vaccination records (stored privately)
            </p>
          </div>

          {medicalFiles.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800 font-medium mb-2">Selected files:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                {medicalFiles.map((file, index) => (
                  <li key={index}>
                    📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleMedicalFilesUpload}
            disabled={uploadingPrivate || medicalFiles.length === 0}
            className={primaryButtonClass}
          >
            {uploadingPrivate ? "⏳ Uploading..." : "🔒 Upload Medical Records"}
          </button>

          {encryptedURI && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">✅ Encrypted URI: {encryptedURI}</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <div className={sectionClass}>
          <h3 className={titleClass}>📊 Upload Status</h3>
          <div className="border bg-white border-gray-200 p-4">
            <p className="text-gray-800">{uploadStatus}</p>
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
