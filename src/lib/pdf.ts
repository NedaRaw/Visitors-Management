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

// ============================================================
// PDF data export (table of visitors)
// ------------------------------------------------------------
// Produces a multi-page PDF table listing the given visitors.
// ============================================================

const PDF_COLUMNS = [
  { header: "Visitor ID", field: "visitorId", width: 28 },
  { header: "Name", field: "name", width: 38 },
  { header: "Department", field: "department", width: 30 },
  { header: "Purpose", field: "purpose", width: 32 },
  { header: "Date", field: "visitDate", width: 22 },
  { header: "Arrival", field: "arrivalTime", width: 18 },
  { header: "Status", field: "status", width: 22 },
] as const;

export function downloadVisitorsPdf(visitors: Visitor[]): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const tableWidth = pageWidth - margin * 2;
  const rowH = 8;
  const headerH = 10;

  let y = margin;

  const drawHeader = () => {
    doc.setFillColor(15, 76, 129);
    doc.rect(margin, y, tableWidth, headerH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    let x = margin + 2;
    for (const col of PDF_COLUMNS) {
      doc.text(col.header, x, y + 6.5);
      x += col.width;
    }
    y += headerH;
  };

  const drawTitle = () => {
    doc.setTextColor(15, 76, 129);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(LAB_INFO.name, margin, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 130, 140);
    doc.text(
      `Visitor Report — ${new Date().toLocaleString()}`,
      pageWidth - margin,
      y + 4,
      { align: "right" },
    );
    y += 10;
  };

  drawTitle();
  drawHeader();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  for (let i = 0; i < visitors.length; i++) {
    const v = visitors[i];
    const rowData: Record<string, string> = {
      visitorId: v.visitorId,
      name: `${v.firstName} ${v.lastName}`,
      department: v.department,
      purpose: v.purpose,
      visitDate: v.visitDate,
      arrivalTime: v.arrivalTime,
      status: v.status,
    };

    // Zebra striping
    if (i % 2 === 1) {
      doc.setFillColor(244, 247, 250);
      doc.rect(margin, y, tableWidth, rowH, "F");
    }

    doc.setTextColor(30, 40, 50);
    let x = margin + 2;
    for (const col of PDF_COLUMNS) {
      let text = rowData[col.field] || "";
      // Truncate to fit column width
      const maxChars = Math.floor(col.width / 1.7);
      if (text.length > maxChars) text = text.slice(0, maxChars - 1) + "…";
      doc.text(text, x, y + 5.5);
      x += col.width;
    }

    y += rowH;

    // Page break
    if (y + rowH > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeader();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
    }
  }

  // Footer page numbers
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 160, 170);
    doc.text(
      `Page ${p} of ${pageCount}`,
      pageWidth - margin,
      pageHeight - 5,
      { align: "right" },
    );
  }

  doc.save(`visitors-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
