"use client";

import { Menu, ShoppingBag, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "sovendus-integration-settings-ui/ui";

export default function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container m-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <SheetClose asChild>
                  <Link href="/" className="text-lg font-medium">
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/" className="text-lg font-medium">
                    Shop
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/" className="text-lg font-medium">
                    Categories
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/" className="text-lg font-medium">
                    New Arrivals
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/subscriptions" className="text-lg font-medium">
                    My Subscriptions
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl font-bold">Test Shop</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/" className="text-sm font-medium">
            Shop
          </Link>
          <Link href="/" className="text-sm font-medium">
            Categories
          </Link>
          <Link href="/" className="text-sm font-medium">
            New Arrivals
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/subscriptions">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          <Link href="/thank-you">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
