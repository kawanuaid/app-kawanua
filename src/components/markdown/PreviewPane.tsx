import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PreviewPane({ markdown }: { markdown: string }) {
  return (
    <div className="w-full h-full p-6 bg-card text-card-foreground border border-border rounded-lg shadow-sm overflow-y-auto prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling untuk elemen tertentu jika diperlukan
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mb-4 border-b pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold py-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold py-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-bold py-2" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-md font-bold py-2" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-sm font-bold py-2" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-600 hover:underline" {...props} />
          ),
          p: ({ node, ...props }) => <p className="text-sm pb-2" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="text-sm pb-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="text-sm pb-2" {...props} />
          ),
          li: ({ node, className, ...props }) => (
            <li className={`${className} text-sm pb-2`} {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-teal-500 pl-4 my-4 py-2"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <code
                className={`${className} text-sm block mb-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-md overflow-x-auto`}
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-red-500"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
