"use client";

import { useMemo, useState } from "react";
import { useDonationSystem } from "~~/hooks/donation-system/useDonationSystem";

const PawPrintSvg = ({ className = "w-20 h-20", ...props }: any) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M47.5 18c2.8-3.6 2.3-8.7-1-12-3.3-3.3-8.4-3.8-12-1-3.2 2.5-4.3 6.9-3.4 10.8" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.12" />
    <path d="M27 34c-5-1-9.5 1-12 5-2.5 4.5-1.8 10.5 2 14 5 4.7 13 4.7 18 0 3.8-3.5 4.6-9.5 2-14-2.5-4-7-6-10-5z" fill="#2D2D2D" opacity="0.06" />
    <circle cx="18" cy="14" r="5" fill="#2D2D2D" opacity="0.08" />
    <circle cx="28" cy="10" r="4" fill="#2D2D2D" opacity="0.08" />
    <circle cx="38" cy="14" r="5" fill="#2D2D2D" opacity="0.08" />
  </svg>
);

const ArcadeDogTiny = ({ className = "w-12 h-12", ...props }: any) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <rect width="24" height="24" rx="4" fill="#FFD208" opacity="0.06" />
    <path d="M6 15c1.5-2 4-2 6-1s3 3 4 4" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="10" r="1.2" fill="#2D2D2D" />
    <circle cx="12" cy="9" r="1.2" fill="#2D2D2D" />
  </svg>
);

// Full arcade/pixel pet icons (match other panels)
const ArcadeDogSvg = ({ className = "w-64 h-64", ...props }: any) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet" {...props}>
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
      <rect x="6" y="30" width="30" height="12" />
      <rect x="36" y="30" width="12" height="10" />
      <rect x="8" y="42" width="6" height="6" />
      <rect x="20" y="42" width="6" height="6" />
      <rect x="32" y="42" width="6" height="6" />
      <rect x="48" y="28" width="4" height="6" />
      <rect x="50" y="24" width="2" height="4" />
    </g>
  </svg>
);

const ArcadeCatSvg = ({ className = "w-56 h-56", ...props }: any) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet" {...props}>
    <g fill="currentColor">
      <rect x="12" y="6" width="6" height="10" />
      <rect x="34" y="6" width="6" height="10" />
      <rect x="16" y="16" width="16" height="8" />
      <rect x="14" y="22" width="20" height="8" />
      <rect x="12" y="30" width="24" height="10" />
      <rect x="10" y="40" width="20" height="8" />
      <rect x="32" y="38" width="18" height="10" />
      <rect x="50" y="34" width="4" height="8" />
      <rect x="52" y="30" width="3" height="4" />
    </g>
  </svg>
);

const ArcadeRabbitSvg = ({ className = "w-48 h-48", ...props }: any) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet" {...props}>
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

type DonationType = "one-time" | "recurring";

export const DonorPanel = () => {
  const {
    donar,
    donarRecurrente,
    listaProtectoras,
    listaDonantes,
    isProcessing,
    message,
    refetchPool,
    userAddress,
  } = useDonationSystem();

  const [donationAmount, setDonationAmount] = useState("");
  const [selectedShelter, setSelectedShelter] = useState("");
  const [donationType, setDonationType] = useState<DonationType>("one-time");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [occurrences, setOccurrences] = useState("");

  const currentDonor = useMemo(() => {
    if (!userAddress) return undefined;
    return listaDonantes.find(d => d.address.toLowerCase() === userAddress.toLowerCase());
  }, [listaDonantes, userAddress]);

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
        alert("Please enter the number of occurrences for the recurring donation");
        return;
      }
      await donarRecurrente(donationAmount, frequency, parseInt(occurrences), selectedShelter);
    } else {
      await donar(donationAmount, selectedShelter);
    }

    setDonationAmount("");
    setOccurrences("");
    setTimeout(() => {
      refetchPool();
    }, 2000);
  };

  const sectionClass = "bg-white shadow-lg p-6 mb-8 rounded-2xl border border-gray-100 text-gray-900";
  const titleClass = "font-extrabold text-[#2D2D2D] text-xl mb-3 flex items-center gap-2";
  const buttonClass =
    "inline-flex items-center justify-center px-6 py-3 font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed rounded-xl";
  const primaryButtonClass = `${buttonClass} bg-[#FFD208] text-[#2D2D2D] hover:bg-[#E0B800] focus-visible:ring-[#E0B800]`;
  const toggleButtonClass = (active: boolean) =>
    `flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
      active ? "bg-[#FFD208] text-[#2D2D2D] shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD208] text-gray-900";

  return (
    <div className="relative max-w-6xl mx-auto p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* DEBUG: temporary banner to confirm DonorPanel renders */}
      <div className="absolute top-4 left-4 z-50 px-3 py-1 rounded-full bg-red-50 text-red-800 text-xs font-semibold">DonorPanel: mounted</div>
      {/* subtle yellow tint + repeating paw texture behind the page */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9E6] via-[#FFF3CC] to-[#F8F4E6] opacity-70" />
        <div
          className="absolute inset-0 bg-repeat opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>%3Cpath fill='%23FFD208' opacity='0.06' d='M32 44c-7 0-12 6-12 8s5 4 12 4 12-2 12-4-5-8-12-8zm-14-12c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14-6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14 6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z'/%3E%3C/svg%3E\")",
            backgroundSize: "160px 160px",
          }}
        />
      </div>
  <div className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFD208] via-[#FFE883] to-[#FFF9D1] border border-[#F6D75A] shadow-xl">
        <div className="absolute -top-12 -left-10 h-40 w-40 rounded-full bg-white/25" />
        <div className="absolute -bottom-16 -right-6 h-44 w-44 rounded-full bg-white/20" />
        <div className="relative px-8 py-10 text-[#2D2D2D]">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-[11px]">
              <span role="img" aria-label="spark" className="text-lg">
                🤝
              </span>
              <span className="normal-case">RescueDAO</span> Donor Hub
            </span>
            {userAddress && (
              <span className="inline-flex items-center gap-2 bg-[#2D2D2D] text-[#FFD208] px-4 py-2 rounded-full border border-black/20 shadow-sm text-xs font-bold uppercase tracking-wide font-arcade">
                Wallet {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </span>
            )}
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-xs font-bold uppercase tracking-wide font-arcade">
              {listaProtectoras.length} shelter{listaProtectoras.length === 1 ? "" : "s"}
            </span>
          </div>
          {/* richer consistent hero decorations (match ProtectoraPanel) */}
          <div className="absolute -top-8 -right-12 pointer-events-none transform rotate-6 opacity-40">
            <ArcadeDogSvg className="w-64 h-64" />
          </div>
          <div className="absolute -bottom-14 -left-12 pointer-events-none transform -rotate-6 opacity-30">
            <ArcadeCatSvg className="w-56 h-56" />
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none transform rotate-3 opacity-25">
            <ArcadeRabbitSvg className="w-48 h-48" />
          </div>
          {/* extra subtle paw prints to enrich the background (increased density and visibility) */}
          <div className="absolute top-6 left-6 pointer-events-none opacity-30">
            <PawPrintSvg className="w-28 h-28" />
          </div>
          <div className="absolute bottom-8 right-20 pointer-events-none opacity-30">
            <PawPrintSvg className="w-20 h-20" />
          </div>
          <div className="absolute top-8 right-12 pointer-events-none opacity-25 transform rotate-12">
            <PawPrintSvg className="w-16 h-16" />
          </div>
          <div className="absolute left-10 top-36 pointer-events-none opacity-25">
            <PawPrintSvg className="w-20 h-20" />
          </div>
          <div className="absolute left-1/2 top-20 -translate-x-1/2 pointer-events-none opacity-20">
            <PawPrintSvg className="w-36 h-36" />
          </div>
          {/* additional small arcade dogs and paw prints to match AdminPanel background */}
          <div className="absolute -top-6 left-6 pointer-events-none opacity-18 transform -rotate-6">
            <ArcadeDogTiny className="w-14 h-14" />
          </div>
          <div className="absolute bottom-10 right-6 pointer-events-none opacity-16">
            <PawPrintSvg className="w-24 h-24" />
          </div>
          <div className="absolute top-28 right-4 pointer-events-none opacity-14">
            <ArcadeDogTiny className="w-10 h-10" />
          </div>
          <h1 className="mt-5 text-4xl md:text-[42px] font-extrabold tracking-tight"><span className="normal-case">RescueDAO</span> — Donor Center</h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
            Support verified shelters in Sepolia with a minimal, wallet-first experience. Pick a destination, choose the amount,
            and confirm directly in your wallet.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 1</p>
              <p className="font-semibold text-[#2D2D2D]">Select shelter</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 2</p>
              <p className="font-semibold text-[#2D2D2D]">Choose amount & cadence</p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
              <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 3</p>
              <p className="font-semibold text-[#2D2D2D]">Confirm in your wallet</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className={sectionClass}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
              {/* ensure extra paw prints around the page edges to match AdminPanel */}
              <div className="absolute top-4 right-4 pointer-events-none opacity-20">
                <PawPrintSvg className="w-24 h-24" />
              </div>
              <div className="absolute bottom-6 left-6 pointer-events-none opacity-18">
                <PawPrintSvg className="w-20 h-20" />
              </div>
                <h3 className={titleClass}>❤️ Make a Donation</h3>
                <p className="text-sm text-gray-500">Funds move in native ETH on Sepolia. No custodial steps, ever.</p>
              </div>
                    {/* small arcade pet badge inside the donation card (decorative) */}
                    <div className="absolute top-4 left-4 pointer-events-none opacity-40">
                      <ArcadeDogTiny className="w-12 h-12" />
                    </div>
              {isProcessing && (
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#A38025] bg-[#FFF7CC] border border-[#FFD208] px-3 py-1 rounded-full font-arcade">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#A38025] animate-pulse" /> Processing…
                </span>
              )}
            </div>
            <form onSubmit={handleDonar} className="space-y-5">
              <div>
                <label htmlFor="protectora" className="block text-gray-700 font-medium mb-2">
                  Select a Shelter *
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

              <div>
                <label className="block text-gray-700 font-medium mb-2">Donation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setDonationType("one-time")} className={toggleButtonClass(donationType === "one-time")}>
                    💰 One‑time
                  </button>
                  <button type="button" onClick={() => setDonationType("recurring")} className={toggleButtonClass(donationType === "recurring")}>
                    🔄 Recurring
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="donationAmount" className="block text-gray-700 font-medium mb-2">
                  Amount {donationType === "recurring" ? "per period" : ""} (ETH Sepolia)
                </label>
                <input
                  id="donationAmount"
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

              {donationType === "recurring" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FFFCF0] border border-[#FFD208]/50 rounded-xl">
                  <div>
                    <label htmlFor="frecuencia" className="block text-gray-700 font-medium mb-2">
                      Frequency
                    </label>
                    <select
                      id="frequency"
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
                      Occurrences
                    </label>
                    <input
                      id="occurrences"
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
                      Estimated total: {donationAmount && occurrences ? (parseFloat(donationAmount) * parseInt(occurrences || "0")).toFixed(4) : "0.0000"} ETH
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-xs text-gray-500 font-arcade">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#FFD208]" />
                  Switching networks in your wallet may be required before confirming.
                </span>
                <button type="submit" className={primaryButtonClass} disabled={isProcessing}>
                  {isProcessing ? "⏳ Processing..." : donationType === "recurring" ? "🔄 Set up recurring" : "❤️ Donate now"}
                </button>
              </div>
            </form>
            {message && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  message.includes("Error")
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-green-50 text-green-800 border border-green-200"
                }`}
              >
                {message}
              </div>
            )}
            <div className="mt-4 text-xs text-gray-600">
              <p className="mb-1">Donations use native ETH on Sepolia. Ensure you have enough balance before confirming.</p>
              <p>Recurring donations simulate scheduling unless your contract supports it.</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className={`${sectionClass} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-[#FFD208]/30" />
            <div className="absolute top-6 right-6 pointer-events-none opacity-30">
              <ArcadeDogTiny className="w-10 h-10" />
            </div>
            <div className="absolute bottom-4 left-4 pointer-events-none opacity-30">
              <PawPrintSvg className="w-14 h-14" />
            </div>
            <div className="relative">
              <h3 className={titleClass}>👤 Your donor profile</h3>
              {currentDonor ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Name:</span> {currentDonor.nombre}
                  </p>
                  <p className="text-xs font-mono text-gray-600 break-words">
                    {currentDonor.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Thank you for supporting the community. Manage your donations from here.
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  Your account is not in the configured donors list. Ask an administrator to register you.
                </p>
              )}
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className={titleClass}>📚 Quick tips</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FFD208]" />
                <span>Verify addresses before confirming a transaction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FFD208]" />
                <span>Recurring donations help shelters plan with confidence.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FFD208]" />
                <span>Contact your chosen shelter if you have questions about fund usage.</span>
              </li>
            </ul>
          </div>

          <div className={`${sectionClass} bg-[#FFFCF0] border border-[#FFD208]/50`}>
            <h3 className={titleClass}>🌟 Experience highlights</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><span className="font-semibold text-[#2D2D2D]">Minimal & focused:</span> every action is one screen away.</p>
              <p><span className="font-semibold text-[#2D2D2D]">Consistent branding:</span> leveraging the original amber & charcoal palette.</p>
              <p><span className="font-semibold text-[#2D2D2D]">Wallet-first:</span> you stay in control from start to finish.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};


