"use client";

import { useState } from "react";
import { useDonationSystem } from "~~/hooks/donation-system/useDonationSystem";

type DonationType = "one-time" | "recurring";

export const DonationPool = () => {
  const { donar, donarRecurrente, listaProtectoras, isProcessing, message, refetchPool } = useDonationSystem();
  const [donationAmount, setDonationAmount] = useState("");
  const [selectedShelter, setSelectedShelter] = useState("");
  const [donationType, setDonationType] = useState<DonationType>("one-time");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [occurrences, setOccurrences] = useState("");

  const handleDonar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!selectedShelter) {
      alert("Please select a shelter");
      return;
    }

    if (donationType === "recurring") {
      if (!occurrences || parseInt(occurrences) <= 0) {
        alert("Please enter how many times the recurring donation should run");
        return;
      }
      await donarRecurrente(donationAmount, frequency, parseInt(occurrences), selectedShelter);
    } else {
      await donar(donationAmount, selectedShelter);
    }

    setDonationAmount("");
    setOccurrences("");
    // Refresh pool after a short delay
    setTimeout(() => {
      refetchPool();
    }, 2000);
  };

  const sectionClass = "bg-white shadow-lg p-6 mb-8 rounded-2xl border border-gray-100 text-gray-900";
  const titleClass = "font-extrabold text-[#2D2D2D] text-xl mb-4 flex items-center gap-2";
  const buttonClass =
    "inline-flex items-center justify-center px-6 py-3 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed bg-[#FFD208] text-[#2D2D2D] hover:bg-[#A38025] focus-visible:ring-[#2D2D2D] cursor-pointer rounded-xl";
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD208] text-gray-900";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 text-gray-900 bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFD208] via-[#FFE883] to-[#FFF9D1] border border-[#F6D75A] shadow-xl">
        <div className="absolute -top-10 -right-12 h-36 w-36 rounded-full bg-white/25" />
        <div className="absolute -bottom-14 -left-8 h-44 w-44 rounded-full bg-white/20" />
        <div className="relative px-8 py-10 text-[#2D2D2D]">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-sm font-semibold font-arcade text-[11px]">
            <span role="img" aria-label="heart" className="text-lg">
              ❤️
            </span>
            Public donation portal
          </div>
          <h1 className="mt-5 text-4xl md:text-[42px] font-extrabold tracking-tight">Support a Shelter</h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
            Choose a shelter, pick an amount, and confirm in your wallet. Your USDC will be routed directly according to the
            current configuration.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 1</p>
              <p className="font-semibold text-[#2D2D2D]">Select a shelter</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 2</p>
              <p className="font-semibold text-[#2D2D2D]">Set amount & cadence</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 3</p>
              <p className="font-semibold text-[#2D2D2D]">Confirm in your wallet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation form */}
      <div className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>❤️ Make a donation</h3>
            <p className="text-sm text-gray-500">You stay in control: we never take custody of your funds.</p>
          </div>
          {isProcessing && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#A38025] bg-[#FFF7CC] border border-[#FFD208] px-3 py-1 rounded-full font-arcade">
              <span className="inline-block h-2 w-2 rounded-full bg-[#A38025] animate-pulse" /> Processing...
            </span>
          )}
        </div>
        <form onSubmit={handleDonar} className="space-y-4">
          {/* Shelter selector */}
          <div>
            <label htmlFor="protectora" className="block text-gray-700 font-medium mb-2">
              Select a shelter *
            </label>
            <select
              id="protectora"
              value={selectedShelter}
              onChange={e => setSelectedShelter(e.target.value)}
              className={inputClass}
              disabled={isProcessing}
              required
            >
              <option value="">-- Choose a shelter --</option>
              {listaProtectoras.map(prot => (
                <option key={prot.address} value={prot.address}>
                  {prot.nombre} ({prot.address.slice(0, 6)}...{prot.address.slice(-4)})
                </option>
              ))}
            </select>
          </div>

          {/* Donation type selector */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Donation type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDonationType("one-time")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  donationType === "one-time"
                    ? "bg-[#FFD208] text-[#2D2D2D] shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                💰 One-time
              </button>
              <button
                type="button"
                onClick={() => setDonationType("recurring")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  donationType === "recurring"
                    ? "bg-[#FFD208] text-[#2D2D2D] shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                🔄 Recurring donation
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="cantidadDonacion" className="block text-gray-700 font-medium mb-2">
              Amount {donationType === "recurring" ? "per period" : ""} (USDC)
            </label>
            <input
              id="cantidadDonacion"
              type="number"
              step="0.01"
              min="0"
              value={donationAmount}
              onChange={e => setDonationAmount(e.target.value)}
              placeholder="10.00"
              className={inputClass}
              disabled={isProcessing}
            />
          </div>

          {/* Extra fields for recurring donations */}
          {donationType === "recurring" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FFFCF0] border border-[#FFD208]/50 rounded-xl">
              <div>
                <label htmlFor="frecuencia" className="block text-gray-700 font-medium mb-2">
                  Frequency
                </label>
                <select
                  id="frecuencia"
                  value={frequency}
                  onChange={e => setFrequency(e.target.value as "daily" | "weekly" | "monthly")}
                  className={inputClass}
                  disabled={isProcessing}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label htmlFor="numeroVeces" className="block text-gray-700 font-medium mb-2">
                  Number of occurrences
                </label>
                <input
                  id="numeroVeces"
                  type="number"
                  min="1"
                  max="100"
                  value={occurrences}
                  onChange={e => setOccurrences(e.target.value)}
                  placeholder="12"
                  className={inputClass}
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Total: {donationAmount && occurrences ? (parseFloat(donationAmount) * parseInt(occurrences || "0")).toFixed(2) : "0.00"} USDC
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <span className="inline-flex items-center gap-2 text-xs text-gray-500 font-arcade">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#FFD208]" />
              Approvals may be required if using ERC-20 when a contract is live.
            </span>
            <button type="submit" className={buttonClass} disabled={isProcessing}>
              {isProcessing ? "⏳ Processing..." : donationType === "recurring" ? "🔄 Set up recurring donation" : "❤️ Donate now"}
            </button>
          </div>
        </form>
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes("Error") 
              ? "bg-red-50 text-red-800 border border-red-200" 
              : "bg-green-50 text-green-800 border border-green-200"
          }`}>
            {message}
          </div>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs text-gray-600">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-[#2D2D2D] font-semibold mb-1">Network reminder</p>
            <p>Ensure your wallet is connected to the right testnet (Sepolia by default) before confirming any transaction.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-[#2D2D2D] font-semibold mb-1">Transparency</p>
            <p>All donations are routed directly; record the transaction hash for your personal audit trail.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

