import QRCode from "qrcode";
import { PUBLIC_DOMAIN } from "@/config/app.config";

// Resolve the base origin used inside QR codes.
// Prefer the live runtime origin so the QR always points to the
// domain where the app is actually deployed. Fall back to the
// configured PUBLIC_DOMAIN only when running outside a browser
// (e.g. server-side PDF generation).
function resolveOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return PUBLIC_DOMAIN.replace(/\/$/, "");
}

// Build the public lookup URL that is encoded into the QR.
// The app uses hash routing, so the URL includes the "#" fragment.
export function buildVisitorUrl(visitorId: string): string {
  return `${resolveOrigin()}/#/visitor/${visitorId}`;
}

// Generate a QR code as a data URL (PNG) for a given visitor ID.
export async function generateQrDataUrl(visitorId: string): Promise<string> {
  const url = buildVisitorUrl(visitorId);
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
    color: { dark: "#0f4c81", light: "#ffffff" },
  });
}
