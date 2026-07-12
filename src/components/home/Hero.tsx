"use client";

import { useEffect, useState } from "react";
import { DesktopHero } from "@/components/home/DesktopHero";
import { MobileHero } from "@/components/home/MobileHero";

const MOBILE_QUERY = "(max-width: 767px)";

export function Hero({ featuredImage }: { featuredImage: string | null }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isMobile === null) {
    return <div className="h-[100dvh] w-full bg-english-900" />;
  }

  return isMobile ? (
    <MobileHero featuredImage={featuredImage} />
  ) : (
    <DesktopHero featuredImage={featuredImage} />
  );
}
