"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "@/components/wallet/custom-wallet";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Swap", href: "/swap" },
  { label: "History", href: "/history" },
  { label: "Faucet", href: "/faucet" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__left">
          <div className="navbar__brand">
            <Image
              src="/seturan.png"
              alt="Seturan"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>

          <nav className="navbar__nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navbar__link${
                    isActive ? " navbar__link--active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="navbar__right">
          <WalletButton />
        </div>
      </div>
    </header>
  );
};
