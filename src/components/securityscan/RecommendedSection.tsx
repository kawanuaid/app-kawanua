import { HttpSecurityHeaders, RecommendationItem, ScanResults } from "@/types/securityscan";
import { motion } from "framer-motion";
import { Zap, CheckCircle2 } from "lucide-react";

const OWASP_HEADER_RECOMMENDATIONS: Record<
  keyof HttpSecurityHeaders,
  RecommendationItem
> = {
  contentSecurityPolicy: {
    title: "Implement Content-Security-Policy (CSP)",
    description:
      "Prevents cross-site scripting (XSS), clickjacking, and other code injection attacks. Ensure you define a strict policy, starting with default-src 'self'.",
    impact: "Critical",
    effort: "High",
    reference: "OWASP HTTP Headers Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#content-security-policy-csp",
  },
  strictTransportSecurity: {
    title: "Enable HTTP Strict-Transport-Security (HSTS)",
    description:
      "Forces browsers to use HTTPS, preventing man-in-the-middle downgrade attacks. Recommended value: max-age=31536000; includeSubDomains.",
    impact: "High",
    effort: "Low",
    reference: "OWASP HTTP Headers Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#strict-transport-security-hsts",
  },
  xFrameOptions: {
    title: "Add X-Frame-Options Header",
    description:
      "Defines whether the site can be rendered in a <frame>, <iframe>, <embed> or <object>. Recommended value: DENY or SAMEORIGIN.",
    impact: "Medium",
    effort: "Low",
    reference: "OWASP HTTP Headers Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-frame-options",
  },
  xContentTypeOptions: {
    title: "Set X-Content-Type-Options",
    description:
      "Prevents the browser from interpreting files as a different MIME type to what is specified. Recommended value: nosniff.",
    impact: "Medium",
    effort: "Low",
    reference: "OWASP HTTP Headers Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-content-type-options",
  },
  permissionsPolicy: {
    title: "Configure Permissions-Policy",
    description:
      "Allows you to control which browser features and APIs (e.g., camera, microphone, geolocation) can be used. Define explicit rules to minimize risk.",
    impact: "Medium",
    effort: "Medium",
    reference: "OWASP HTTP Headers Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#permissions-policy-formerly-feature-policy",
  },
  referrerPolicy: {
    title: "Define Referrer-Policy",
    description:
      "Controls how much referrer information is sent with requests. Recommended value: strict-origin-when-cross-origin.",
    impact: "Low",
    effort: "Low",
    reference: "OWASP HTTP Headers Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#referrer-policy",
  },
  xXssProtection: {
    title: "Configure X-XSS-Protection",
    description:
      "Deprecated in modern browsers, but if supporting legacy browsers, it should be set to '0' to avoid XSS filter vulnerabilities.",
    impact: "Low",
    effort: "Low",
    reference: "OWASP HTTP Headers Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-xss-protection",
  },
  crossOriginOpenerPolicy: {
    title: "Set Cross-Origin-Opener-Policy (COOP)",
    description:
      "Allows you to ensure a top-level document does not share a browsing context group with cross-origin documents. Recommended: same-origin.",
    impact: "Medium",
    effort: "Medium",
    reference: "OWASP HTTP Headers Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#cross-origin-opener-policy-coop",
  },
};

const SSL_RECOMMENDATIONS: Record<string, RecommendationItem> = {
  hsts: {
    title: "Enable HTTP Strict-Transport-Security (HSTS)",
    description:
      "Forces browsers to use HTTPS, preventing man-in-the-middle downgrade attacks.",
    impact: "High",
    effort: "Low",
    reference: "OWASP HSTS Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html",
  },
  tlsVersion: {
    title: "Support Strong TLS Protocols Only",
    description:
      "Ensure that only strong TLS protocols (TLS 1.2 and TLS 1.3) are supported.",
    impact: "High",
    effort: "Medium",
    reference: "OWASP TLS Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html#only-support-strong-protocols",
  },
  certificateAuthority: {
    title: "Use an Appropriate Certification Authority",
    description:
      "Ensure the certificate is issued by a recognized and trusted certificate authority.",
    impact: "High",
    effort: "Medium",
    reference: "OWASP TLS Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html#use-an-appropriate-certification-authority-for-the-applications-user-base",
  },
  certificateValidity: {
    title: "Consider the Certificate's Validation Type",
    description:
      "Ensure your certificate is valid, not expired, and appropriate for your user base.",
    impact: "Critical",
    effort: "Low",
    reference: "OWASP TLS Cheat Sheet",
    source:
      "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html#consider-the-certificates-validation-type",
  },
  perfectForwardSecrecy: {
    title: "Enable Perfect Forward Secrecy (PFS)",
    description:
      "Ensures session keys are ephemeral and cannot be retroactively decrypted if the private key is compromised.",
    impact: "High",
    effort: "Medium",
    reference: "DigiCert PFS Tutorial",
    source:
      "https://knowledge.digicert.com/tutorials/enabling-perfect-forward-secrecy",
  },
  certificateTransparency: {
    title: "Implement Certificate Transparency (CT)",
    description:
      "Ensure your certificates are logged in public CT logs to improve auditability and trust.",
    impact: "Medium",
    effort: "Low",
    reference: "Certificate Transparency Logs",
    source: "https://certificate.transparency.dev/howctworks/",
  },
  otherSsl: {
    title: "Review Server SSL/TLS Configuration",
    description:
      "Use Mozilla SSL Configuration Generator to ensure your server configuration meets modern security standards.",
    impact: "High",
    effort: "Medium",
    reference: "Mozilla SSL Config Generator",
    source: "https://ssl-config.mozilla.org",
  },
};

const EASE = [0.25, 0.1, 0.25, 1] as const;

const IMPACT_TEXT_CLASSES: Record<RecommendationItem["impact"], string> = {
  Critical: "text-destructive",
  High: "text-orange-600",
  Medium: "text-warning",
  Low: "text-primary",
};

const IMPACT_DOT_CLASSES: Record<RecommendationItem["impact"], string> = {
  Critical: "bg-destructive",
  High: "bg-orange-500",
  Medium: "bg-warning",
  Low: "bg-primary",
};

const EFFORT_CLASSES: Record<RecommendationItem["effort"], string> = {
  High: "text-destructive",
  Medium: "text-warning",
  Low: "text-success",
};

interface Props {
  headers?: HttpSecurityHeaders | null;
  sslResults?: ScanResults | null;
}

export default function RecommendationsSection({ headers, sslResults }: Props) {
  const dynamicRecommendations: RecommendationItem[] = [];

  if (headers) {
    (
      Object.keys(OWASP_HEADER_RECOMMENDATIONS) as (keyof HttpSecurityHeaders)[]
    ).forEach((key) => {
      if (headers[key] === null) {
        dynamicRecommendations.push(OWASP_HEADER_RECOMMENDATIONS[key]);
      }
    });
  }

  if (sslResults) {
    if (!sslResults.hstsEnabled) {
      // Avoid duplicate HSTS from header if already added
      if (!dynamicRecommendations.some(r => r.title.includes("HSTS"))) {
        dynamicRecommendations.push(SSL_RECOMMENDATIONS.hsts);
      }
    }
    
    if (
      sslResults.tlsVersion !== "TLSv1.3" &&
      sslResults.tlsVersion !== "TLSv1.2"
    ) {
      dynamicRecommendations.push(SSL_RECOMMENDATIONS.tlsVersion);
    }
    
    if (!sslResults.certificateAuthority || sslResults.certificateAuthority === "Unknown") {
      dynamicRecommendations.push(SSL_RECOMMENDATIONS.certificateAuthority);
    }
    
    if (
      !sslResults.certificateValidity ||
      sslResults.certificateValidity.daysRemaining <= 14
    ) {
      dynamicRecommendations.push(SSL_RECOMMENDATIONS.certificateValidity);
    }
    
    if (!sslResults.perfectForwardSecrecy) {
      dynamicRecommendations.push(SSL_RECOMMENDATIONS.perfectForwardSecrecy);
    }
    
    if (
      !sslResults.certificateTransparency &&
      !sslResults.advancedCertDetails?.hasSCT
    ) {
      dynamicRecommendations.push(SSL_RECOMMENDATIONS.certificateTransparency);
    }
    
    if (
      !sslResults.ocspStapling ||
      (!sslResults.cipherSuite?.includes("AES_128_GCM") &&
        !sslResults.cipherSuite?.includes("AES_256_GCM") &&
        !sslResults.cipherSuite?.includes("CHACHA20"))
    ) {
      dynamicRecommendations.push(SSL_RECOMMENDATIONS.otherSsl);
    }
  }

  if (dynamicRecommendations.length === 0) {
    return null;
  }

  return (
    <section id="recommendations" className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-warning" />
        <h2 className="font-semibold text-sm text-foreground">
          Priority Recommendations
        </h2>
        {dynamicRecommendations.length > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded uppercase">
            {dynamicRecommendations.length} Actions
          </span>
        )}
      </div>

      {dynamicRecommendations.length === 0 ? (
        <div className="bg-card p-5 rounded-xl border border-border/50 shadow-card-sm flex items-center gap-3">
          <CheckCircle2 className="text-success shrink-0" size={20} />
          <p className="text-sm text-muted-foreground">
            Semua HTTP Security Headers yang direkomendasikan telah
            diimplementasikan dengan baik!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {dynamicRecommendations.map((rec, i) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i, ease: EASE }}
              // whileHover={{ y: -2 }}
              className="bg-card p-5 rounded-xl border border-border/50 shadow-card-sm flex flex-col md:flex-row gap-4 group cursor-default"
            >
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-start gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${IMPACT_DOT_CLASSES[rec.impact]}`}
                  />
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-150">
                    {rec.title}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-3.5">
                  {rec.description}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground/50 pl-3.5">
                  Ref:{" "}
                  <a
                    href={rec.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {rec.reference}
                  </a>
                </p>
              </div>
              <div className="flex md:flex-col justify-start md:justify-center gap-4 md:gap-3 md:pl-5 md:border-l border-border/50 min-w-[110px] shrink-0">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold mb-0.5">
                    Impact
                  </p>
                  <p
                    className={`text-xs font-bold ${IMPACT_TEXT_CLASSES[rec.impact]}`}
                  >
                    {rec.impact}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold mb-0.5">
                    Effort
                  </p>
                  <p
                    className={`text-xs font-semibold ${EFFORT_CLASSES[rec.effort]}`}
                  >
                    {rec.effort}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
