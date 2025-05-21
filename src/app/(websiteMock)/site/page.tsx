"use client";

import Image from "next/image";
import Link from "next/link";
import { type JSX, useEffect, useState } from "react";
import { getSettings } from "sovendus-integration-settings-ui/demo-style-less";
import { Button } from "sovendus-integration-settings-ui/ui";
import type { SovendusAppSettings } from "sovendus-integration-types";

import { SovendusLandingPageReact } from "../../../scripts/react";
import { loggerInfo } from "../../../scripts/vanilla";
import { AdminBar } from "./components/admin-bar";
import Footer from "./components/footer";
import Header from "./components/header";
import HomeTour from "./components/home-tour";
import ProductCard from "./components/product-card";
import { useTour } from "./components/tour-context";
import SovendusLandingPageDemoForm from "./landing-page/demo-form";

export default function SovendusLandingPageDemo(): JSX.Element {
  const { runTour, isStepCompleted } = useTour();
  const [settings, setSettings] = useState<SovendusAppSettings>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setSettings(getSettings());
  }, []);

  // Start the home tour automatically if not completed
  useEffect(() => {
    if (!isStepCompleted("home")) {
      runTour("home");
    }
  }, [isStepCompleted, runTour]);

  return settings ? (
    <div className="flex flex-col min-h-screen">
      <HomeTour />
      <AdminBar
        pageName="Landing Page"
        configContent={(setConfigOpen) => (
          <SovendusLandingPageDemoForm setConfigOpen={setConfigOpen} />
        )}
      />
      <Header />
      <SovendusLandingPageReact
        country={undefined} // TODO add country selector in form
        integrationType="sovendus-integration-scripts-preview"
        settings={settings}
        onDone={(sovPageStatus, sovPageConfig) => {
          loggerInfo(
            "Sovendus Page done",
            "LandingPage",
            "sovPageStatus",
            sovPageStatus,
            "sovPageConfig",
            sovPageConfig,
          );
        }}
      />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 m-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover Our Latest Collection
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Shop the newest trends and find your perfect style. Free
                  shipping on orders over $50.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/site/thank-you">
                    <Button
                      size="lg"
                      className="inline-flex items-center justify-center shop-now-button"
                    >
                      Shop Now
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    View Collections
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-square relative">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="Featured product"
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="w-full py-12 md:py-24">
          <div className="container m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Featured Products
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Check out our most popular items handpicked for you
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Join Our Newsletter
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Subscribe to get special offers, free giveaways, and
                  once-in-a-lifetime deals.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                  />
                  <Button>Subscribe</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  ) : (
    <></>
  );
}

const featuredProducts = [
  {
    id: 1,
    name: "Premium T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Soft cotton t-shirt with a modern fit",
  },
  {
    id: 2,
    name: "Classic Jeans",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Durable denim jeans for everyday wear",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Lightweight shoes perfect for running",
  },
  {
    id: 4,
    name: "Casual Hoodie",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Warm and comfortable hoodie for casual days",
  },
  {
    id: 5,
    name: "Wireless Earbuds",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "High-quality sound with noise cancellation",
  },
  {
    id: 6,
    name: "Smart Watch",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Track your fitness and stay connected",
  },
];
