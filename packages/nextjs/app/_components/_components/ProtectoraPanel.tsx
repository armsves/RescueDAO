"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDonationSystem, Animal } from "~~/hooks/donation-system/useDonationSystem";

type Pet = Animal;

const PawSvg = ({ className = "w-20 h-20 text-white/20" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden>
    <path d="M47.2 23.6c3.6-2.6 6.2-7.6 4.8-11.6-1.6-4.9-7.4-6.1-11.1-3.3-3.6 2.6-6.1 7.6-4.8 11.6 1.6 4.9 7.4 6.1 11.1 3.3zM18.8 23.6c-3.6-2.6-6.2-7.6-4.8-11.6 1.6-4.9 7.4-6.1 11.1-3.3 3.6 2.6 6.1 7.6 4.8 11.6-1.6 4.9-7.4 6.1-11.1 3.3zM32 34.5c4.7 0 8.5 3.8 8.5 8.5 0 4.7-6.2 11.5-8.5 11.5-2.3 0-8.5-6.8-8.5-11.5C23.5 38.3 27.3 34.5 32 34.5zM12.5 36.5c2.4 0 4.3 2 4.3 4.5 0 2.5-2 5.9-4.3 5.9s-4.3-3.4-4.3-5.9c0-2.5 1.9-4.5 4.3-4.5zM51.5 36.5c2.4 0 4.3 2 4.3 4.5 0 2.5-2 5.9-4.3 5.9s-4.3-3.4-4.3-5.9c0-2.5 1.9-4.5 4.3-4.5z" />
  </svg>
);

// Arcade / pixel-style dog and cat icons for a friendlier UI
// clearer arcade-style silhouettes for dog, cat, rabbit (more readable)
const ArcadeDogSvg = ({ className = "w-10 h-10 text-[#2D2D2D]" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    {/* fox-terrier inspired 8-bit dog: pointed ears and elongated snout */}
    <g fill="currentColor">
      {/* left ear */}
      <rect x="6" y="4" width="6" height="10" />
      <rect x="12" y="8" width="4" height="6" />

      {/* right ear */}
      <rect x="34" y="4" width="6" height="10" />
      <rect x="30" y="8" width="4" height="6" />

      {/* head */}
      <rect x="10" y="14" width="20" height="10" />
      <rect x="8" y="22" width="24" height="10" />

      {/* snout (elongated to the right) */}
      <rect x="28" y="20" width="18" height="8" />
      <rect x="36" y="18" width="10" height="4" />
      <rect x="44" y="16" width="6" height="4" />

      {/* body */}
      <rect x="6" y="30" width="30" height="12" />
      <rect x="36" y="30" width="12" height="10" />

      {/* legs */}
      <rect x="8" y="42" width="6" height="6" />
      <rect x="20" y="42" width="6" height="6" />
      <rect x="32" y="42" width="6" height="6" />

      {/* tail (pointing up) */}
      <rect x="48" y="28" width="4" height="6" />
      <rect x="50" y="24" width="2" height="4" />
    </g>
  </svg>
);

const ArcadeCatSvg = ({ className = "w-10 h-10 text-[#2D2D2D]" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    {/* refined pixel cat that pairs with the fox-terrier dog style */}
    <g fill="currentColor">
      {/* pointy ears */}
      <rect x="12" y="6" width="6" height="10" />
      <rect x="34" y="6" width="6" height="10" />

      {/* forehead / eyes block */}
      <rect x="16" y="16" width="16" height="8" />
      <rect x="14" y="22" width="20" height="8" />

      {/* cheeks / whisker area */}
      <rect x="12" y="30" width="24" height="10" />

      {/* body */}
      <rect x="10" y="40" width="20" height="8" />
      <rect x="32" y="38" width="18" height="10" />

      {/* tail curling */}
      <rect x="50" y="34" width="4" height="8" />
      <rect x="52" y="30" width="3" height="4" />
    </g>
  </svg>
);

const ArcadeRabbitSvg = ({ className = "w-10 h-10 text-[#2D2D2D]" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    <g fill="currentColor">
      {/* ears */}
      <rect x="22" y="4" width="4" height="10" />
      <rect x="28" y="4" width="4" height="10" />

      {/* head / body */}
      <rect x="18" y="14" width="16" height="10" />
      <rect x="14" y="24" width="24" height="12" />

      {/* feet */}
      <rect x="16" y="36" width="6" height="6" />
      <rect x="30" y="36" width="6" height="6" />
    </g>
  </svg>
);

// Paw print decorative SVG used as faint background in panels
const PawPrintSvg = ({ className = "w-24 h-24 text-black/10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden>
    <path d="M32 44c-7 0-12 6-12 8s5 4 12 4 12-2 12-4-5-8-12-8zm-14-12c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14-6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14 6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z" />
  </svg>
);

const usePetLoader = (petIds: bigint[], fetchPet: (id: bigint) => Promise<Pet | null>, refetchTrigger: any) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadPets = async () => {
      setLoadError(null);
      if (!petIds || petIds.length === 0) {
        setPets([]);
        return;
      }
      setLoadingPets(true);
      try {
        const petsData = await Promise.all(
          petIds.map(id => fetchPet(id)),
        );
        setPets(petsData.filter((a): a is Pet => a !== null));
      } catch (error) {
        console.error("Error loading pets:", error);
        setLoadError("There was an error loading the list of pets.");
        setPets([]);
      } finally {
        setLoadingPets(false);
      }
    };
    loadPets();
  }, [petIds, fetchPet, refetchTrigger]);

  return { pets, loadingPets, loadError };
};

export const ProtectoraPanel = () => {
  const {
    agregarAnimal: addPet,
    retirarDelPool: withdrawFromPool,
    obtenerAnimal: fetchPet,
    animalesIds: petIds,
    poolDonaciones: donationPool,
    protectoraInfo: shelterInfo,
    isProcessing,
    message,
    refetchAnimalesIds: refetchPetIds,
  } = useDonationSystem();
  
  const { pets, loadingPets, loadError } = usePetLoader(
    petIds, 
    fetchPet, 
    !isProcessing && message.includes("successfully") 
  ); 

  const [newPet, setNewPet] = useState({ name: "", species: "" });

  const [withdrawal, setWithdrawal] = useState({ amount: "", destinationAddress: "" });
  const WITHDRAWAL_DESTINATION: "wallet" = "wallet";

  const handleAddPet = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPet.name || !newPet.species) {
      alert("Please complete the pet's name and species.");
      return;
    }
    
    await addPet(newPet.name, newPet.species);
    
    setNewPet({ name: "", species: "" }); 
  }, [addPet, newPet.name, newPet.species]);

  const handleWithdraw = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawal.amount);
    
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!withdrawal.destinationAddress) {
      alert("Please enter the destination address.");
      return;
    }
    
    const available = parseFloat(donationPool || "0");
    if (amount > available) {
        alert(`The amount to withdraw (${amount}) exceeds the total available (${available} USDC).`);
        return;
    }
    
    // Call withdraw using "wallet" destination only
    await withdrawFromPool(withdrawal.amount, WITHDRAWAL_DESTINATION, withdrawal.destinationAddress);
    
    setWithdrawal(prev => ({ ...prev, amount: "", destinationAddress: "" }));
  }, [withdrawFromPool, withdrawal.amount, withdrawal.destinationAddress, donationPool]);

  const sectionClass = "relative overflow-hidden bg-white shadow-lg p-6 mb-8 rounded-2xl border border-gray-100 text-gray-900";
  const titleClass = "font-extrabold text-[#2D2D2D] text-xl mb-3 flex items-center gap-2";
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD208] text-gray-900 transition-colors";
  const buttonClass =
    "inline-flex items-center justify-center px-6 py-3 font-semibold text-lg transition-all duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed rounded-xl";
  const primaryButtonClass = `${buttonClass} bg-[#FFD208] text-[#2D2D2D] hover:bg-[#E0B800] focus-visible:ring-[#E0B800]`;
  const secondaryButtonClass = `${buttonClass} bg-black text-[#F4F4F4] hover:bg-[#1F1F1F] focus-visible:ring-[#FFD208]`;
  
  const poolDisplayClass = "font-mono text-2xl font-bold text-black bg-[#FFFCF0] px-4 py-3 rounded-xl border border-[#FFD208]";

  const isWithdrawDisabled = useMemo(() => {
    const isInvalidAmount = parseFloat(withdrawal.amount) <= 0 || isNaN(parseFloat(withdrawal.amount));
    const isMissingAddress = !withdrawal.destinationAddress;
    const isPoolEmpty = parseFloat(donationPool || "0") <= 0;
    
    return isProcessing || isInvalidAmount || isMissingAddress || isPoolEmpty;
  }, [isProcessing, withdrawal.amount, withdrawal.destinationAddress, donationPool]);

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFD208] via-[#FFE883] to-[#FFF9D1] border border-[#F6D75A] shadow-xl">
        <div className="absolute -top-8 -right-12 pointer-events-none transform rotate-6 opacity-20">
          <ArcadeDogSvg className="w-64 h-64" />
        </div>
        <div className="absolute -bottom-16 -left-12 pointer-events-none transform -rotate-6 opacity-16">
          <ArcadeCatSvg className="w-56 h-56" />
        </div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none transform rotate-3 opacity-12">
          <ArcadeRabbitSvg className="w-48 h-48" />
        </div>
        {/* extra subtle paw prints to enrich the background (increased density) */}
        <div className="absolute top-6 left-6 pointer-events-none opacity-5">
          <PawPrintSvg className="w-28 h-28" />
        </div>
        <div className="absolute bottom-8 right-20 pointer-events-none opacity-6">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute top-8 right-12 pointer-events-none opacity-6 transform rotate-12">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        <div className="absolute left-10 top-36 pointer-events-none opacity-6">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute left-1/2 top-20 -translate-x-1/2 pointer-events-none opacity-4">
          <PawPrintSvg className="w-36 h-36" />
        </div>
        <div className="relative px-8 py-10 text-[#2D2D2D]">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm font-arcade text-[11px]">
              <span role="img" aria-label="home" className="text-lg">🏠</span>
              Shelter console
            </span>
            {shelterInfo && (
              <span className="inline-flex items-center gap-2 bg-[#2D2D2D] text-[#FFD208] px-4 py-2 rounded-full border border-black/20 shadow-sm text-xs font-bold uppercase tracking-wide font-arcade">
                {shelterInfo.nombre}
              </span>
            )}
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-xs font-bold uppercase tracking-wide font-arcade">
              Pool: {donationPool || "0.00"} USDC
            </span>
            <div className="ml-2 inline-flex items-center gap-2">
              <div className="p-1 rounded bg-white/60 shadow-sm">
                <ArcadeDogSvg className="w-10 h-10" />
              </div>
              <div className="p-1 rounded bg-white/60 shadow-sm">
                <ArcadeCatSvg className="w-10 h-10" />
              </div>
            </div>
          </div>
          <h1 className="mt-5 text-4xl md:text-[42px] font-extrabold tracking-tight"><span className="normal-case">RescueDAO</span> — Shelter Dashboard</h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
            Track your donation pool, showcase adoptable pets, and transfer funds to your operational wallet with a warm, friendly interface.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 1</p>
              <p className="font-semibold text-[#2D2D2D]">Review pool balance</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 2</p>
              <p className="font-semibold text-[#2D2D2D]">Add rescue stories</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 3</p>
              <p className="font-semibold text-[#2D2D2D]">Withdraw or earmark funds</p>
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="absolute -bottom-8 -right-8 opacity-8 pointer-events-none transform rotate-6">
          <PawPrintSvg className="w-32 h-32" />
        </div>
        {/* extra paws for Add New Pet panel to ensure paw prints in background */}
        <div className="absolute top-6 right-6 pointer-events-none opacity-6 transform rotate-6">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute left-6 bottom-10 pointer-events-none opacity-5">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        {/* decorative pet icons for visual consistency */}
        <div className="absolute top-4 left-4 pointer-events-none opacity-10">
          <ArcadeDogSvg className="w-12 h-12 text-[#FFD208]/60" />
        </div>
        <div className="absolute bottom-8 left-8 pointer-events-none opacity-8">
          <ArcadeCatSvg className="w-14 h-14 text-[#2D2D2D]/20" />
        </div>
        <div className="absolute top-3 left-6 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute top-16 right-12 opacity-5 pointer-events-none">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        <div className="absolute top-4 right-6 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute left-4 top-24 opacity-6 pointer-events-none transform -rotate-6">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        <div className="absolute top-2 right-4 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute top-2 right-4 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute top-8 left-8 opacity-6 pointer-events-none transform -rotate-6">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute top-1/2 right-10 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        <div className="absolute top-2 right-4 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute -bottom-6 -left-6 opacity-10 pointer-events-none transform rotate-12">
          <PawPrintSvg className="w-36 h-36" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>💰 Available Donation Pool</h3>
            <p className="text-sm text-gray-500">This reflects on-chain balance or the local simulation if no contract is deployed.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D2D2D] bg-[#FFD208]/40 px-3 py-1 rounded-full font-arcade">
            Updated in real time
          </span>
        </div>
        <div className="flex flex-wrap gap-4 items-center bg-gray-50 border border-gray-200 p-6 rounded-xl">
          <span className="text-gray-700 font-medium text-xl">Total available to transfer</span>
          <span className={poolDisplayClass}>{donationPool || "0.00"} USDC</span>
        </div>
      </div>

      
      {(isProcessing || message) && (
        <div className={`${sectionClass} ${message.includes("Error") ? "bg-red-50 border-red-300" : "bg-green-50 border-green-300"} transition-all duration-500`}> 
          <div className="absolute top-0 right-0 -translate-y-8 opacity-8 pointer-events-none">
            <PawPrintSvg className="w-32 h-32" />
          </div>
          {/* small pet icons in processing panel */}
          <div className="absolute top-4 right-6 pointer-events-none opacity-10">
            <ArcadeRabbitSvg className="w-12 h-12 text-[#2D2D2D]/30" />
          </div>
          <div className="absolute bottom-6 right-6 pointer-events-none opacity-8">
            <ArcadeDogSvg className="w-12 h-12 text-[#FFD208]/40" />
          </div>
          <div className="absolute top-6 left-4 opacity-6 pointer-events-none">
            <PawPrintSvg className="w-20 h-20" />
          </div>
          <div className="absolute bottom-6 left-6 opacity-6 pointer-events-none transform rotate-12">
            <PawPrintSvg className="w-16 h-16" />
          </div>
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            {isProcessing ? "⏳ Processing Transaction" : message.includes("successfully") ? "✅ Success" : "❌ Error"}
          </h3>
          <p className={`${message.includes("Error") ? "text-red-800" : "text-green-800"}`}>
            {isProcessing ? "Please wait for confirmation in your wallet..." : message}
          </p>
        </div>
      )}

      
      <div className={sectionClass}>
        <div className="absolute -bottom-8 -right-8 opacity-8 pointer-events-none transform rotate-6">
          <PawPrintSvg className="w-32 h-32" />
        </div>
        {/* extra paw prints for Withdraw panel */}
        <div className="absolute top-6 left-8 pointer-events-none opacity-6">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute right-6 top-24 pointer-events-none opacity-5 transform -rotate-6">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        <div className="absolute top-2 right-6 opacity-10 pointer-events-none">
          <ArcadeCatSvg className="w-12 h-12 text-[#2D2D2D]/30" />
        </div>
        <div className="absolute bottom-10 left-6 opacity-8 pointer-events-none">
          <ArcadeDogSvg className="w-12 h-12 text-[#FFD208]/40" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>➕ Add New Pet</h3>
            <p className="text-sm text-gray-500">Share their name and species. Stories matter—keep it short and friendly.</p>
          </div>
          {isProcessing && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#A38025] bg-[#FFF7CC] border border-[#FFD208] px-3 py-1 rounded-full font-arcade">
              <span className="inline-block h-2 w-2 rounded-full bg-[#A38025] animate-pulse" /> Processing…
            </span>
          )}
        </div>
        <form onSubmit={handleAddPet} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="petName" className="block text-gray-700 font-semibold mb-2">
                Pet Name
              </label>
              <input
                id="petName"
                type="text"
                value={newPet.name}
                onChange={e => setNewPet({ ...newPet, name: e.target.value })}
                placeholder="e.g. Luna"
                className={inputClass}
                disabled={isProcessing}
                required
              />
            </div>
            <div>
              <label htmlFor="petSpecies" className="block text-gray-700 font-semibold mb-2">
                Species
              </label>
              <input
                id="petSpecies"
                type="text"
                value={newPet.species}
                onChange={e => setNewPet({ ...newPet, species: e.target.value })}
                placeholder="e.g. Dog, Cat, Rabbit"
                className={inputClass}
                disabled={isProcessing}
                required
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs text-gray-500 font-arcade">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#FFD208]" />
              Details are stored locally unless your contract persists them on-chain.
            </span>
            <button type="submit" className={primaryButtonClass} disabled={isProcessing}>
              {isProcessing ? "⏳ Processing..." : "✅ Register Pet"}
            </button>
          </div>
        </form>
      </div>

      
      <div className={sectionClass}>
        <div className="absolute -bottom-8 -right-8 opacity-8 pointer-events-none transform rotate-6">
          <PawPrintSvg className="w-32 h-32" />
        </div>
        {/* small background pet icons for withdraw panel */}
        <div className="absolute top-4 left-6 opacity-8 pointer-events-none">
          <ArcadeDogSvg className="w-12 h-12 text-[#FFD208]/40" />
        </div>
        <div className="absolute top-12 right-8 opacity-6 pointer-events-none">
          <ArcadeCatSvg className="w-12 h-12 text-[#2D2D2D]/30" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>💸 Withdraw Funds to Wallet</h3>
            <p className="text-sm text-gray-500">Move USDC to your operational wallet. Destination must match a valid address.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs text-gray-500 font-arcade">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#FFD208]" />
            Gas fees apply depending on network congestion.
          </span>
        </div>
        <form onSubmit={handleWithdraw} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="withdrawAmount" className="block text-gray-700 font-semibold mb-2">
                Amount to Withdraw (USDC)
              </label>
              <input
                id="withdrawAmount"
                type="number"
                step="0.01"
                min="0.01"
                value={withdrawal.amount}
                onChange={e => setWithdrawal({ ...withdrawal, amount: e.target.value })}
                placeholder={`Max: ${donationPool || "0.00"}`}
                className={inputClass}
                disabled={isProcessing}
                required
              />
            </div>
            <div>
                <label htmlFor="destinationAddress" className="block text-gray-700 font-semibold mb-2">
                  Destination Wallet Address
                </label>
                <input
                  id="destinationAddress"
                  type="text"
                  value={withdrawal.destinationAddress}
                  onChange={e => setWithdrawal({ ...withdrawal, destinationAddress: e.target.value })}
                  placeholder="0x..."
                  className={inputClass}
                  disabled={isProcessing}
                  required
                />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs text-gray-500 font-arcade">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#FFD208]" />
              Track hashes in your wallet to audit each withdrawal.
            </span>
            <button
              type="submit"
              className={secondaryButtonClass}
              disabled={isWithdrawDisabled}
            >
              {isProcessing ? "⏳ Processing..." : "💸 Confirm Wallet Withdrawal"}
            </button>
          </div>
        </form>
      </div>

  <div className={sectionClass}>
        <div className="absolute -top-6 -left-6 opacity-6 pointer-events-none transform -rotate-6">
          <PawPrintSvg className="w-28 h-28" />
        </div>
        {/* small decorative pet icons for the pets list panel */}
        <div className="absolute top-6 right-6 pointer-events-none opacity-10">
          <ArcadeCatSvg className="w-12 h-12 text-[#2D2D2D]/30" />
        </div>
        <div className="absolute bottom-6 left-6 pointer-events-none opacity-9">
          <ArcadeDogSvg className="w-14 h-14 text-[#FFD208]/40" />
        </div>
        <div className="absolute bottom-6 right-6 opacity-6 pointer-events-none transform rotate-6">
          <PawPrintSvg className="w-24 h-24" />
        </div>
        <div className="absolute left-1/2 bottom-10 -translate-x-1/2 opacity-5 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>📋 Our Pets ({pets.length})</h3>
            <p className="text-sm text-gray-500">Every entry helps donors understand your mission. Keep details concise.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#FFD208]" />
            Auto-refresh after confirmed transactions.
          </span>
        </div>
        {loadingPets ? (
          <div className="text-center py-8 text-xl text-[#FFD208] font-semibold">
            <span className="animate-spin mr-2">🔄</span> Loading pets...
          </div>
        ) : loadError ? (
            <div className="text-center py-8 text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg">
                ❌ {loadError}
            </div>
        ) : pets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#FFD208] bg-[#FFFCF0] px-6 py-10 text-center text-gray-600">
            <span className="text-3xl">🐾</span>
            <p className="text-sm max-w-sm">No pets registered yet. Add your first rescue using the form above so donors can meet them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map(pet => (
              <div
                key={String(pet.id)}
                className="relative bg-gray-50 border border-gray-200 p-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-[#FFD208]"
              >
                {/* subtle paw in each pet card background */}
                <div className="absolute bottom-3 left-3 pointer-events-none opacity-6">
                  <PawPrintSvg className="w-14 h-14 text-black/6" />
                </div>
                <div className="absolute top-4 right-4 opacity-95">
                      {pet.especie && (pet.especie.toLowerCase().includes("dog") || pet.especie.toLowerCase().includes("perro")) ? (
                        <div className="transform hover:scale-110 transition-transform"><ArcadeDogSvg className="w-12 h-12" /></div>
                      ) : pet.especie && (pet.especie.toLowerCase().includes("cat") || pet.especie.toLowerCase().includes("gato")) ? (
                        <div className="transform hover:scale-110 transition-transform"><ArcadeCatSvg className="w-12 h-12" /></div>
                      ) : (
                        <div className="transform hover:scale-110 transition-transform"><PawSvg className="w-12 h-12 text-[#FFD208]" /></div>
                      )}
                </div>
                <h4 className="font-extrabold text-xl text-[#2D2D2D] mb-2">{pet.nombre}</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-bold">Species:</span> {pet.especie}
                  </p>
                  <p>
                    <span className="font-bold">ID:</span> {String(pet.id)}
                  </p>
                  <p>
                    <span className="font-bold">Status:</span>{' '}
                    <span className={pet.activo ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {pet.activo ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

