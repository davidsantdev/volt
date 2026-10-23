"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { Drawer } from "@/components/ui/drawer";
import type { NavItem } from "@/config/site";

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="grid size-11 place-items-center rounded-full border border-line text-ink md:hidden"
      >
        <MenuIcon className="size-[22px]" />
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} label="Menu" side="left">
        <div className="flex h-full flex-col">
          <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-5">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="grid size-10 place-items-center rounded-full border border-line"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
          <nav aria-label="Menu principal" className="flex-1 overflow-y-auto px-5 py-4">
            <ul>
              {items.map((item) => (
                <li key={item.href + item.title} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-5 text-xl font-extrabold uppercase tracking-[-0.02em]"
                  >
                    {item.title}
                    <ArrowRightIcon className="size-5 text-volt-deep" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Drawer>
    </>
  );
}
