import jsPDF from "jspdf";
import { LAB_INFO } from "@/config/app.config";
import type { Visitor } from "@/types/visitor";

// ============================================================
// PDF badge export
// ------------------------------------------------------------
// Produces a single-page PDF visitor badge (landscape card)
// matching the on-screen badge design.
// ============================================================

export async function downloadBadgePdf(
  visitor: Visitor,
  qrDataUrl: string,
): Promise<void> {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a6" });
  const pageWidth = doc.internal.pageSize.getWidth(); // 148mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 105mm

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Blue header band
  const headerH = 22;
  doc.setFillColor(15, 76, 129); // NWC blue
  doc.rect(0, 0, pageWidth, headerH, "F");

  // Header text — lab name
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(LAB_INFO.name, pageWidth / 2, 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(LAB_INFO.tagline, pageWidth / 2, 16, { align: "center" });

  // "VISITOR" label
  doc.setTextColor(15, 76, 129);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("VISITOR", pageWidth / 2, 32, { align: "center" });

  // Name
  const fullName = `${visitor.firstName} ${visitor.lastName}`;
  doc.setFontSize(14);
  doc.text(fullName, pageWidth / 2, 42, { align: "center" });

  // Divider
  doc.setDrawColor(200, 210, 220);
  doc.setLineWidth(0.3);
  doc.line(10, 46, pageWidth - 10, 46);

  // Details (left column)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(60, 70, 80);
  doc.text("VISITOR ID", 10, 54);
  doc.text("DEPARTMENT", 10, 64);
  doc.text("VISIT DATE", 10, 74);
  doc.text("ARRIVAL", 10, 84);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(20, 30, 40);
  doc.text(visitor.visitorId, 10, 58);
  doc.text(visitor.department, 10, 68);
  doc.text(visitor.visitDate, 10, 78);
  doc.text(visitor.arrivalTime, 10, 88);

  // QR code (right column)
  const qrSize = 34;
  const qrX = pageWidth - qrSize - 8;
  const qrY = 50;
  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(120, 130, 140);
  doc.text(
    "This badge must be worn at all times while on laboratory premises.",
    pageWidth / 2,
    pageHeight - 4,
    { align: "center" },
  );

  doc.save(`badge-${visitor.visitorId}.pdf`);
}
