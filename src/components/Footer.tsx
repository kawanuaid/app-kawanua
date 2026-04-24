// Copyright (C) 2026 Kawanua Indo Digital

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

export default function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      <p>
        © {new Date().getFullYear()}{" "}
        <a
          href="http://kawanua.id"
          className="text-primary hover:text-slate-500"
          target="_blank"
          rel="noopener"
        >
          Kawanua Indo Digital
        </a>
        . Dirilis di bawah lisensi{" "}
        <a
          href="https://github.com/KawanuaDev/app-kawanua#-lisensi"
          className="text-primary hover:text-slate-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          GNU Affero General Public License v3.0 (AGPL-3.0)
        </a>
        .
      </p>
    </footer>
  );
}

export function Disclaimer() {
  return (
    <p>
      Semua perhitungan pada halaman ini dilakukan secara lokal di browser Anda.
      File atau data Anda tidak pernah diunggah ke server mana pun.
    </p>
  );
}

export function SubFooter({ children }: { children: React.ReactNode }) {
  return (
    <aside className="border-t bg-slate-100/50 backdrop-blur-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="text-xs text-slate-400">{children}</div>
      </div>
    </aside>
  );
}
