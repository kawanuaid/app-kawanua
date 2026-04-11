export default function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      <p>© {new Date().getFullYear()} Kawanua Indo Digital.</p>
    </footer>
  );
}

export function Disclaimer() {
  return (
    <aside className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      <p>
        Semua perhitungan pada halaman ini dilakukan secara lokal di browser
        Anda. File atau data Anda tidak pernah diunggah ke server mana pun.
      </p>
    </aside>
  );
}
