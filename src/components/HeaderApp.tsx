// Copyright (C) 2026 Kawanua Indo Digital

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";

export default function HeaderApp({
  title,
  description,
  icon,
  customCss,
  clientSide,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  customCss: string;
  clientSide?: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-9 transition-all duration-300">
      <div
        className={`mx-auto px-4 sm:px-6 transition-all duration-300 flex items-center justify-center ${
          isScrolled ? "py-2" : "py-4"
        } ${customCss}`}
      >
        <div
          id="header-app"
          className={`flex items-center transition-all duration-300 ${
            isScrolled ? "flex-row gap-4" : "flex-col text-center space-y-2"
          }`}
        >
          <div
            className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200 transition-all duration-300 ${
              isScrolled ? "h-10 w-10 mb-0 shrink-0" : "h-16 w-16 mb-4"
            }`}
          >
            <div
              className={`flex items-center justify-center transition-all duration-300 ${isScrolled ? "scale-[0.65]" : "scale-100"}`}
            >
              {icon}
            </div>
          </div>
          <div
            className={`flex flex-col transition-all duration-300 ${
              isScrolled
                ? "items-start text-left space-y-0"
                : "items-center text-center space-y-2"
            }`}
          >
            <div className="flex items-center gap-3">
              <h1
                className={`font-bold tracking-tight text-slate-900 transition-all duration-300 ${
                  isScrolled ? "text-xl" : "text-3xl"
                }`}
              >
                {title}
              </h1>
              {clientSide && isScrolled && (
                <Badge
                  variant="secondary"
                  className="hidden sm:inline-flex gap-2 shrink-0 text-gray-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Client-side only
                </Badge>
              )}
            </div>

            <p
              className={`text-slate-500 transition-all duration-300 ${
                isScrolled ? "hidden" : "block"
              }`}
            >
              {description}
            </p>
            {clientSide && !isScrolled && (
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex gap-2 text-gray-500"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Client-side only — no data sent
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function HeaderHorizontal({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <header className="border-b border-border/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center shadow-lg shadow-primary/25">
              {icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {title}
              </h1>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">{children}</div>
        </div>
      </div>
    </header>
  );
}
