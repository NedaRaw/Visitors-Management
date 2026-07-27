import QRCode from "qrcode";
import { PUBLIC_DOMAIN } from "@/config/app.config";

// Build the public lookup URL that is encoded into the QR.
// The QR contains ONLY this URL.
export function buildVisitorUrl(visitorId: string): string {
  return `${PUBLIC_DOMAIN.replace(/\/$/, "")}/visitor/${visitorId}`;
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
