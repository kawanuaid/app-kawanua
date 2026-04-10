export default function highlightCode(code: string): React.ReactNode[] {
  return code.split("\n").map((line, i) => {
    const parts: React.ReactNode[] = [];
    let key = 0;

    // Comment line
    if (line.trim().startsWith("<!--")) {
      parts.push(
        <span key={key++} className="comment">
          {line}
        </span>,
      );
      return (
        <div key={i}>
          {parts}
          {"\n"}
        </div>
      );
    }

    // Parse HTML tags
    const regex = /(<\/?)([\w-]+)([^>]*)(\/?>)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      // Text before tag
      if (match.index > lastIndex) {
        parts.push(
          <span key={key++} className="tag-content">
            {line.slice(lastIndex, match.index)}
          </span>,
        );
      }

      // Opening bracket
      parts.push(
        <span key={key++} className="tag-bracket">
          {match[1]}
        </span>,
      );
      // Tag name
      parts.push(
        <span key={key++} className="tag-name">
          {match[2]}
        </span>,
      );

      // Attributes
      const attrStr = match[3];
      const attrRegex = /([\w-]+)(=)("[^"]*")/g;
      let attrLastIndex = 0;
      let attrMatch;

      while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
        if (attrMatch.index > attrLastIndex) {
          parts.push(
            <span key={key++} className="tag-content">
              {attrStr.slice(attrLastIndex, attrMatch.index)}
            </span>,
          );
        }
        parts.push(
          <span key={key++} className="attr-name">
            {attrMatch[1]}
          </span>,
        );
        parts.push(
          <span key={key++} className="tag-content">
            {attrMatch[2]}
          </span>,
        );
        parts.push(
          <span key={key++} className="attr-value">
            {attrMatch[3]}
          </span>,
        );
        attrLastIndex = attrRegex.lastIndex;
      }
      if (attrLastIndex < attrStr.length) {
        parts.push(
          <span key={key++} className="tag-content">
            {attrStr.slice(attrLastIndex)}
          </span>,
        );
      }

      // Closing bracket
      parts.push(
        <span key={key++} className="tag-bracket">
          {match[4]}
        </span>,
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(
        <span key={key++} className="tag-content">
          {line.slice(lastIndex)}
        </span>,
      );
    }

    return (
      <div key={i}>
        {parts}
        {"\n"}
      </div>
    );
  });
}
