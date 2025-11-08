"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RainbowKitCustomConnectButton } from "~~/components/helper";
import { useOutsideClick } from "~~/hooks/helper";

// Arcade paw icon for logo
const PawIconSvg = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden>
    <path d="M32 44c-7 0-12 6-12 8s5 4 12 4 12-2 12-4-5-8-12-8zm-14-12c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14-6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14 6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z" />
  </svg>
);

/**
 * Site header
 */
export const Header = () => {
  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  const navLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/nft-mint", label: "NFT Mint", icon: "🎨" },
    { href: "/gallery", label: "Gallery", icon: "🖼️" },
    { href: "/donate", label: "Donate", icon: "❤️" },
    { href: "/admin", label: "Admin", icon: "👑" },
    { href: "/donor", label: "Donor", icon: "🤝" },
    { href: "/shelter", label: "Shelter", icon: "🐾" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#FFD208] via-[#FFE883] to-[#FFF9D1] border-b-2 border-[#F6D75A] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-[#2D2D2D] p-2 rounded-lg group-hover:bg-black transition-colors shadow-md">
                <PawIconSvg className="w-6 h-6 text-[#FFD208]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-[#2D2D2D] leading-tight tracking-tight">RescueDAO</span>
                <span className="text-[10px] text-[#3F3F3F] uppercase tracking-wider font-semibold">
                  Pet NFT Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                  pathname === link.href
                    ? "bg-[#2D2D2D] text-[#FFD208] shadow-md"
                    : "text-[#2D2D2D] hover:bg-white/50 hover:shadow-sm"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Wallet Connect */}
          <div className="hidden lg:block">
            <RainbowKitCustomConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-3">
            <RainbowKitCustomConnectButton />
            <details ref={burgerMenuRef} className="dropdown dropdown-end">
              <summary className="btn btn-sm bg-[#2D2D2D] text-[#FFD208] border-none hover:bg-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-2xl border border-gray-200 w-52">
                {navLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`rounded-lg font-semibold ${pathname === link.href ? "bg-[#FFD208] text-[#2D2D2D]" : "text-gray-700 hover:bg-[#FFF9E6]"}`}
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
};
