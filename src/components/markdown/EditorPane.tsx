export default function EditorPane({
  markdown,
  setMarkdown,
}: {
  markdown: string;
  setMarkdown: (val: string) => void;
}) {
  return (
    <textarea
      className="w-full h-full p-4 font-mono text-sm bg-zinc-50 dark:bg-zinc-900 border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
      value={markdown}
      onChange={(e) => setMarkdown(e.target.value)}
      placeholder="Ketik markdown di sini..."
      spellCheck={false}
    />
  );
}
