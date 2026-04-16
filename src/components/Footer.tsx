export default function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      <p>© {new Date().getFullYear()} Kawanua Indo Digital.</p>
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
