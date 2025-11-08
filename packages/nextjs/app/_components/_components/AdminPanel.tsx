"use client";

import { useState, useCallback } from "react";

// Decorative arcade paw + pet icons (small, reusable here)
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
import { useDonationSystem } from "~~/hooks/donation-system/useDonationSystem";

export const AdminPanel = () => {
  // hook returns some Spanish-named properties; map to English locals for clarity
  const { agregarProtectora: addShelter, listaProtectoras, isProcessing, message } = useDonationSystem();
  const shelters = listaProtectoras; // local alias in English

  const [shelterAddress, setShelterAddress] = useState("");
  const [shelterName, setShelterName] = useState("");

  const handleAddShelter = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shelterAddress || !shelterName) {
      alert("Please complete all fields (Address and Name).");
      return;
    }

    await addShelter(shelterAddress, shelterName);
    
    // Clear inputs only on successful transaction start (or completion, depending on hook logic)
    if (!isProcessing) {
      setShelterAddress("");
      setShelterName("");
    }
  }, [addShelter, shelterAddress, shelterName, isProcessing]);

  // --- Style Classes ---
  const sectionClass = "bg-white shadow-lg p-6 mb-8 rounded-2xl border border-gray-100 text-gray-900";
  const titleClass = "font-extrabold text-[#2D2D2D] text-xl mb-4 flex items-center gap-2";
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD208] text-gray-900 transition-colors";
  const buttonClass =
    "inline-flex items-center justify-center px-6 py-3 font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed rounded-xl";
  const primaryButtonClass = `${buttonClass} bg-[#FFD208] text-[#2D2D2D] hover:bg-[#E0B800] focus-visible:ring-[#E0B800]`;

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
      {/* Hero / header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFD208] via-[#FFE883] to-[#FFF9D1] border border-[#F6D75A] shadow-xl">
        <div className="absolute -top-12 -right-10 h-36 w-36 rounded-full bg-white/30" />
        <div className="absolute -bottom-14 -left-6 h-40 w-40 rounded-full bg-white/20" />
          {/* richer consistent hero decorations (match ProtectoraPanel) */}
          <div className="absolute -top-8 -right-12 pointer-events-none transform rotate-6 opacity-20">
            <ArcadeDogSvg className="w-64 h-64" />
          </div>
          <div className="absolute -bottom-14 -left-12 pointer-events-none transform -rotate-6 opacity-16">
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
        <div className="relative px-8 py-10">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#2D2D2D]">
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-[11px]">
              <span role="img" aria-label="spark" className="text-lg">
                ⚙️
              </span>
              <span className="normal-case">RescueDAO</span> Admin
            </span>
            <span className="inline-flex items-center gap-2 bg-[#2D2D2D] text-[#FFD208] px-4 py-2 rounded-full border border-black/20 shadow-sm text-xs font-bold uppercase tracking-wide">
              {shelters.length} shelter{shelters.length === 1 ? "" : "s"}
            </span>
          </div>
          <h1 className="mt-5 text-4xl md:text-[42px] font-extrabold tracking-tight text-[#2D2D2D]"><span className="normal-case">RescueDAO</span> — Admin Panel</h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
            Keep the network curated without leaving this minimal console. Add new shelters, monitor addresses, and keep the
            donation flow tidy.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide">Step 1</p>
              <p className="font-semibold text-[#2D2D2D]">Collect the wallet</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide">Step 2</p>
              <p className="font-semibold text-[#2D2D2D]">Assign a friendly name</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="text-[10px] text-gray-600 uppercase tracking-wide">Step 3</p>
              <p className="font-semibold text-[#2D2D2D]">Confirm in the form below</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Shelter */}
      <div className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>➕ Add New Shelter</h3>
            <p className="text-sm text-gray-500">Keep entries short & human readable. Addresses are stored in lowercase.</p>
          </div>
          {isProcessing && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#A38025] bg-[#FFF7CC] border border-[#FFD208] px-3 py-1 rounded-full">
              <span className="inline-block h-2 w-2 rounded-full bg-[#A38025] animate-pulse" /> Processing...
            </span>
          )}
        </div>
        <form onSubmit={handleAddShelter} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
                Wallet address
              </label>
              <input
                id="address"
                type="text"
                value={shelterAddress}
                onChange={e => setShelterAddress(e.target.value)}
                placeholder="0x..."
                className={inputClass}
                disabled={isProcessing}
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Display name
              </label>
              <input
                id="name"
                type="text"
                value={shelterName}
                onChange={e => setShelterName(e.target.value)}
                placeholder="Ex: Happy Paws Shelter"
                className={inputClass}
                disabled={isProcessing}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#FFD208]" />
              Add only trusted organizations. Changes sync instantly in local storage.
            </span>
            <button type="submit" className={primaryButtonClass} disabled={isProcessing}>
              {isProcessing ? "⏳ Processing..." : "✅ Add Shelter"}
            </button>
          </div>
        </form>
      </div>

      {/* ensure paw prints in Add New Shelter panel */}
      <div className="absolute top-4 right-4 pointer-events-none opacity-6">
        <PawPrintSvg className="w-20 h-20" />
      </div>
      <div className="absolute bottom-6 left-6 pointer-events-none opacity-5">
        <PawPrintSvg className="w-16 h-16" />
      </div>

      {/* Messages */}
      {message && (
        <div className={`${sectionClass} ${message.includes("Error") ? "bg-red-50 border-red-300" : "bg-green-50 border-green-300"}`}>
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            {message.includes("Error") ? "❌ Error" : "💬 Message"}
          </h3>
          <p className={message.includes("Error") ? "text-red-800" : "text-green-800"}>{message}</p>
        </div>
      )}

      {/* Shelter list */}
      <div className={sectionClass}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>📋 Registered Shelters ({listaProtectoras.length})</h3>
            <p className="text-sm text-gray-500">Review the live registry. Accounts are stored locally until a contract takes over.</p>
          </div>
          {listaProtectoras.length > 0 && (
            <span className="text-xs font-semibold text-[#2D2D2D] bg-[#FFD208]/40 px-3 py-1 rounded-full">
              Last added: {listaProtectoras[listaProtectoras.length - 1].nombre}
            </span>
          )}
        </div>
        {listaProtectoras.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#FFD208] bg-[#FFFCF0] px-6 py-10 text-center text-gray-600">
            <span className="text-3xl">🗂️</span>
            <p className="text-sm max-w-sm">
              No shelters registered yet. Use the form above to add your first organization and they will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {listaProtectoras.map((shelter, index) => (
                <div
                  key={shelter.address}
                  className="relative bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:border-[#FFD208]"
                >
                  {/* small decorative paw per shelter card */}
                  <div className="absolute bottom-3 left-3 pointer-events-none opacity-6">
                    <PawPrintSvg className="w-12 h-12 text-black/6" />
                  </div>
                  <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD208]/70 text-[#2D2D2D] text-[11px] font-bold">
                      {index + 1}
                    </span>
                    Shelter
                  </span>
                  <span className="text-xs font-semibold bg-[#2D2D2D] text-[#FFD208] px-2 py-1 rounded-full">
                    {shelter.address.slice(0, 6)}...{shelter.address.slice(-4)}
                  </span>
                </div>
                <p className="text-lg font-bold text-[#2D2D2D]">{shelter.nombre}</p>
                <div className="rounded-xl bg-white border border-gray-200 px-4 py-2 text-xs text-gray-600 break-all">
                  {shelter.address}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};