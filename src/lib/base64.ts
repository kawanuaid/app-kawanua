export type EncodingMode = "standard" | "url-safe" | "mime";

export interface Base64Result {
  output: string;
  error: string | null;
  byteSize: number;
  charCount: number;
}

/**
 * Encode plain text to Base64
 */
export function encodeBase64(
  input: string,
  mode: EncodingMode = "standard",
): Base64Result {
  try {
    if (!input) return { output: "", error: null, byteSize: 0, charCount: 0 };

    // Convert string to UTF-8 bytes, then encode
    const bytes = new TextEncoder().encode(input);
    let base64 = btoa(String.fromCharCode(...bytes));

    if (mode === "url-safe") {
      base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    } else if (mode === "mime") {
      // MIME: 76-char line breaks with CRLF
      base64 = base64.replace(/(.{76})/g, "$1\r\n").replace(/\r\n$/, "");
    }

    return {
      output: base64,
      error: null,
      byteSize: bytes.length,
      charCount: base64.length,
    };
  } catch (err) {
    return {
      output: "",
      error: err instanceof Error ? err.message : "Encoding failed",
      byteSize: 0,
      charCount: 0,
    };
  }
}

/**
 * Decode Base64 to plain text
 */
export function decodeBase64(
  input: string,
  mode: EncodingMode = "standard",
): Base64Result {
  try {
    if (!input) return { output: "", error: null, byteSize: 0, charCount: 0 };

    let normalized = input.trim();

    if (mode === "url-safe") {
      // Restore standard Base64 from URL-safe variant
      normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");
      // Re-add padding
      while (normalized.length % 4 !== 0) normalized += "=";
    } else if (mode === "mime") {
      // Strip line breaks
      normalized = normalized.replace(/[\r\n]/g, "");
    }

    const binaryStr = atob(normalized);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const decoded = new TextDecoder("utf-8").decode(bytes);

    return {
      output: decoded,
      error: null,
      byteSize: bytes.length,
      charCount: decoded.length,
    };
  } catch {
    return {
      output: "",
      error: "Invalid Base64 string. Please check the input and try again.",
      byteSize: 0,
      charCount: 0,
    };
  }
}

/**
 * Encode a file (ArrayBuffer) to Base64
 */
export function encodeFileToBase64(
  buffer: ArrayBuffer,
  mode: EncodingMode = "standard",
): string {
  const bytes = new Uint8Array(buffer);
  let base64 = btoa(String.fromCharCode(...bytes));
  if (mode === "url-safe") {
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } else if (mode === "mime") {
    base64 = base64.replace(/(.{76})/g, "$1\r\n").replace(/\r\n$/, "");
  }
  return base64;
}

/**
 * Validate whether a string is valid Base64
 */
export function isValidBase64(
  input: string,
  mode: EncodingMode = "standard",
): boolean {
  try {
    if (!input) return false;
    let normalized = input.trim();
    if (mode === "url-safe") {
      normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");
      while (normalized.length % 4 !== 0) normalized += "=";
    } else if (mode === "mime") {
      normalized = normalized.replace(/[\r\n]/g, "");
    }
    atob(normalized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Calculate encoding efficiency (original vs encoded)
 */
export function calcEfficiency(
  originalSize: number,
  encodedSize: number,
): string {
  if (originalSize === 0) return "0%";
  const overhead = ((encodedSize - originalSize) / originalSize) * 100;
  return `+${overhead.toFixed(1)}%`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
