import { jsPDF } from 'jspdf';

export const generatePDF = (title, lines) => {
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(16);
  doc.text(title, 20, 20);
  doc.setFontSize(11);
  let y = 35;
  lines.forEach((line) => {
    doc.text(line, 20, y);
    y += 8;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });
  doc.save(`${title.replace(/\s/g, '_')}.pdf`);
};