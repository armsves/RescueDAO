"use client";

import Link from "next/link";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";

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

export const HomePage = () => {
  const features = [
    {
      icon: "🔒",
      title: "Private Medical Records",
      description: "Store sensitive pet medical information securely using Private IPFS, accessible only to NFT owners.",
    },
    {
      icon: "🎨",
      title: "Public Pet Profiles",
      description: "Showcase your pet's name, age, location, and photos on the public blockchain for everyone to see.",
    },
    {
      icon: "🔐",
      title: "FHE Technology",
      description: "Fully Homomorphic Encryption ensures owner addresses remain encrypted while enabling secure transfers.",
    },
    {
      icon: "🏥",
      title: "Medical Document Storage",
      description: "Upload blood tests, vaccination records, and weight charts as private PDFs linked to your NFT.",
    },
    {
      icon: "🖼️",
      title: "NFT Gallery",
      description: "Browse all minted pet NFTs with beautiful card layouts and instant metadata loading.",
    },
    {
      icon: "⚡",
      title: "Instant Access",
      description: "Generate temporary signed URLs to access private medical records without compromising security.",
    },
  ];

  const useCases = [
    {
      emoji: "🏠",
      title: "Animal Shelters",
      description: "Keep complete medical histories private while showcasing adoptable pets publicly.",
    },
    {
      emoji: "👨‍⚕️",
      title: "Veterinary Clinics",
      description: "Issue verifiable medical records as NFTs that owners can access anytime.",
    },
    {
      emoji: "🐕",
      title: "Pet Owners",
      description: "Maintain a permanent, portable record of your pet's health and identity.",
    },
    {
      emoji: "🔬",
      title: "Breeders",
      description: "Provide transparent lineage and health documentation for pedigree animals.",
    },
  ];

  const buttonClass =
    "inline-flex items-center justify-center px-8 py-4 font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-xl";
  const primaryButtonClass = `${buttonClass} bg-[#FFD208] text-[#2D2D2D] hover:bg-[#E0B800] focus-visible:ring-[#E0B800]`;
  const secondaryButtonClass = `${buttonClass} bg-[#2D2D2D] text-[#FFD208] hover:bg-black focus-visible:ring-[#FFD208]`;

  return (
    <div className="relative bg-gray-50 min-h-screen">
      {/* Background pattern */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFD208] via-[#FFE883] to-[#FFF9D1] border border-[#F6D75A] shadow-2xl">
          <div className="absolute -top-12 -right-10 h-48 w-48 rounded-full bg-white/30" />
          <div className="absolute -bottom-16 -left-8 h-52 w-52 rounded-full bg-white/20" />

          {/* Decorative pet icons */}
          <div className="absolute -top-8 -right-12 pointer-events-none transform rotate-6 opacity-20">
            <ArcadeDogSvg className="w-64 h-64" />
          </div>
          <div className="absolute -bottom-14 -left-12 pointer-events-none transform -rotate-6 opacity-16">
            <ArcadeCatSvg className="w-56 h-56" />
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none transform rotate-3 opacity-12">
            <ArcadeRabbitSvg className="w-48 h-48" />
          </div>

          {/* Paw prints */}
          <div className="absolute top-8 left-8 pointer-events-none opacity-5">
            <PawPrintSvg className="w-32 h-32" />
          </div>
          <div className="absolute bottom-10 right-24 pointer-events-none opacity-6">
            <PawPrintSvg className="w-24 h-24" />
          </div>

          <div className="relative px-8 py-16 md:py-20">
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#2D2D2D] mb-6">
              <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-xs">
                <span role="img" aria-label="rocket" className="text-lg">
                  🚀
                </span>
                Powered by FHE & IPFS
              </span>
              <span className="inline-flex items-center gap-2 bg-[#2D2D2D] text-[#FFD208] px-4 py-2 rounded-full border border-black/20 shadow-sm text-xs font-bold uppercase tracking-wide">
                🐾 Built on Zama
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#2D2D2D] mb-6 leading-tight">
              RescueDAO
              <span className="block text-3xl md:text-4xl mt-2 text-[#3F3F3F]">Pet NFT Platform</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#3F3F3F] max-w-3xl mb-10 leading-relaxed">
              Create NFTs for rescue pets with <strong>public profiles</strong> and{" "}
              <strong>private medical records</strong>. Built with Fully Homomorphic Encryption and Private IPFS for
              uncompromising privacy and security.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/nft-mint" className={primaryButtonClass}>
                🎨 Mint Pet NFT
              </Link>
              <Link href="/gallery" className={secondaryButtonClass}>
                🖼️ View Gallery
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-[#3F3F3F] font-medium">Connect your wallet to get started:</span>
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] mb-4">✨ Key Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              RescueDAO combines cutting-edge cryptography with decentralized storage to create the most secure pet
              identity platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow-lg p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                  <PawPrintSvg className="w-16 h-16" />
                </div>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white shadow-lg rounded-3xl border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] mb-4">🔧 How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A simple three-step process to create secure, privacy-preserving pet NFTs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FFD208] rounded-full flex items-center justify-center text-2xl font-bold text-[#2D2D2D] shadow-lg">
                1
              </div>
              <div className="bg-[#FFF9E6] p-6 rounded-2xl border-2 border-[#FFD208] h-full pt-8">
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">📸 Upload Public Data</h3>
                <p className="text-gray-700">
                  Add your pet's name, age, location, and a picture. This information will be visible to everyone on
                  the public IPFS network.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FFD208] rounded-full flex items-center justify-center text-2xl font-bold text-[#2D2D2D] shadow-lg">
                2
              </div>
              <div className="bg-[#FFF9E6] p-6 rounded-2xl border-2 border-[#FFD208] h-full pt-8">
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">🏥 Upload Private Medical Records</h3>
                <p className="text-gray-700">
                  Securely store blood tests, vaccination records, and medical PDFs on Private IPFS. Only NFT owners
                  can access these files.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FFD208] rounded-full flex items-center justify-center text-2xl font-bold text-[#2D2D2D] shadow-lg">
                3
              </div>
              <div className="bg-[#FFF9E6] p-6 rounded-2xl border-2 border-[#FFD208] h-full pt-8">
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">✅ Mint Your NFT</h3>
                <p className="text-gray-700">
                  Set the encrypted owner address using FHE technology and mint your NFT. The owner's identity remains
                  private while enabling secure transfers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] mb-4">🎯 Use Cases</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              RescueDAO serves multiple stakeholders in the pet care ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#FFD208] to-[#FFE883] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-[#F6D75A]"
              >
                <div className="text-5xl mb-4">{useCase.emoji}</div>
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">{useCase.title}</h3>
                <p className="text-[#3F3F3F] leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="bg-[#2D2D2D] text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
            <ArcadeDogSvg className="w-48 h-48 text-[#FFD208]" />
          </div>
          <div className="absolute bottom-6 left-6 opacity-10 pointer-events-none">
            <ArcadeCatSvg className="w-40 h-40 text-[#FFD208]" />
          </div>

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#FFD208] mb-6 text-center">🔬 Technology Stack</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto text-center mb-10">
              Built on the most advanced privacy-preserving technologies available in Web3.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-[#FFD208]/30">
                <h3 className="text-2xl font-bold text-[#FFD208] mb-3">⚡ Zama fhEVM</h3>
                <p className="text-gray-300">
                  Fully Homomorphic Encryption on Ethereum enables computations on encrypted data without decrypting it
                  first.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-[#FFD208]/30">
                <h3 className="text-2xl font-bold text-[#FFD208] mb-3">📦 Pinata IPFS</h3>
                <p className="text-gray-300">
                  Decentralized storage with both public and private IPFS networks for flexible data management.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-[#FFD208]/30">
                <h3 className="text-2xl font-bold text-[#FFD208] mb-3">🔗 Smart Contracts</h3>
                <p className="text-gray-300">
                  Solidity-based NFT contracts with encrypted owner addresses and secure transfer mechanisms.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-[#FFD208]/30">
                <h3 className="text-2xl font-bold text-[#FFD208] mb-3">⚛️ Next.js & React</h3>
                <p className="text-gray-300">
                  Modern frontend built with React hooks and Next.js for optimal performance and user experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFD208] via-[#FFE883] to-[#FFF9D1] border border-[#F6D75A] shadow-2xl p-8 md:p-12 text-center">
          <div className="absolute top-8 right-8 opacity-10 pointer-events-none">
            <PawPrintSvg className="w-40 h-40" />
          </div>
          <div className="absolute bottom-8 left-8 opacity-10 pointer-events-none">
            <PawPrintSvg className="w-32 h-32" />
          </div>

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-[#3F3F3F] max-w-2xl mx-auto mb-8">
              Create your first pet NFT today and experience the future of secure, privacy-preserving digital pet
              identity.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/nft-mint" className={primaryButtonClass}>
                🎨 Start Minting
              </Link>
              <Link href="/gallery" className={secondaryButtonClass}>
                🖼️ Explore Gallery
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
