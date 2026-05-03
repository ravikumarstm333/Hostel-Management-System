// utils/pdfGenerator.js

/**
 * Generates a PDF document from form data and triggers download
 * @param {string} title - The title of the PDF form
 * @param {string[]} fields - Array of form field strings
 */

export const generatePDF = async (title, fields) => {
  try {
    // Dynamic import for pdfmake (reduces initial bundle size)
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
    
    // Set up fonts
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    
    // Define document content
    const documentDefinition = {
      content: [
        // Header
        {
          text: 'HOSTELC MANAGEMENT SYSTEM',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          text: title,
          style: 'title',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }],
          margin: [0, 0, 0, 20]
        },
        
        // Form Fields
        ...fields.map((field, index) => {
          // Check if field is a paragraph/instruction
          if (field.includes('I confirm') || field.includes('I request')) {
            return {
              text: field,
              style: 'paragraph',
              margin: [0, 10, 0, 10]
            };
          }
          // Regular form fields
          return {
            text: field,
            style: 'field',
            margin: [0, 8, 0, 8]
          };
        }),
        
        // Footer with timestamp
        {
          text: `Generated on: ${new Date().toLocaleString()}`,
          style: 'footer',
          alignment: 'center',
          margin: [0, 40, 0, 10]
        },
        {
          text: 'This is a system-generated document. Please sign where indicated.',
          style: 'note',
          alignment: 'center',
          fontSize: 8,
          color: 'gray'
        }
      ],
      
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: '#1e40af'
        },
        title: {
          fontSize: 18,
          bold: true,
          color: '#dc2626'
        },
        field: {
          fontSize: 12,
          margin: [20, 5, 0, 5]
        },
        paragraph: {
          fontSize: 11,
          italics: true,
          margin: [20, 10, 20, 10],
          color: '#4b5563'
        },
        footer: {
          fontSize: 9,
          color: '#6b7280'
        },
        note: {
          fontSize: 8,
          color: '#9ca3af'
        }
      },
      
      defaultStyle: {
        font: 'Roboto'
      },
      
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60]
    };
    
    // Generate and download PDF
    pdfMake.createPdf(documentDefinition).download(`${title.replace(/\s+/g, '_')}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Alternative version using jsPDF (if you prefer)
export const generatePDFWithJsPDF = (title, fields) => {
  // Dynamic import for jsPDF
  import('jspdf').then(({ default: jsPDF }) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38);
    doc.text(title, 105, 20, { align: 'center' });
    
    // Add hostel name
    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text('HOSTELC MANAGEMENT SYSTEM', 105, 30, { align: 'center' });
    
    // Add line
    doc.line(20, 35, 190, 35);
    
    // Add fields
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    let yPosition = 50;
    
    fields.forEach((field, index) => {
      // Word wrap for long fields
      const lines = doc.splitTextToSize(field, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 7 + 5;
      
      // Add new page if needed
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 280, { align: 'center' });
    
    // Save PDF
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  }).catch(error => {
    console.error('Error loading jsPDF:', error);
  });
};

// Simple browser print version (no external libraries)
export const generatePDFViaPrint = (title, fields) => {
  const printWindow = window.open('', '_blank');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .hostel-name {
          color: #1e40af;
          font-size: 16px;
          font-weight: bold;
        }
        .title {
          color: #dc2626;
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        hr {
          border: 1px solid #ddd;
          margin: 20px 0;
        }
        .field {
          margin: 15px 0;
          font-size: 14px;
          padding: 5px;
          border-bottom: 1px dotted #ccc;
        }
        .paragraph {
          margin: 15px 0;
          font-style: italic;
          color: #555;
          padding: 10px;
          background-color: #f9f9f9;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          font-size: 10px;
          color: #999;
        }
        .note {
          text-align: center;
          font-size: 9px;
          color: #bbb;
          margin-top: 10px;
        }
        @media print {
          body {
            margin: 0;
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="hostel-name">HOSTELC MANAGEMENT SYSTEM</div>
        <div class="title">${title}</div>
        <hr />
      </div>
      
      <div class="form-content">
        ${fields.map(field => {
          if (field.includes('I confirm') || field.includes('I request')) {
            return `<div class="paragraph">${field}</div>`;
          }
          return `<div class="field">${field}</div>`;
        }).join('')}
      </div>
      
      <div class="footer">
        Generated on: ${new Date().toLocaleString()}
      </div>
      <div class="note">
        This is a system-generated document. Please sign where indicated.
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print();" style="padding: 10px 20px; font-size: 14px;">
          🖨️ Print / Save as PDF
        </button>
        <button onclick="window.close();" style="padding: 10px 20px; font-size: 14px; margin-left: 10px;">
          ❌ Close
        </button>
      </div>
      
      <script>
        // Auto-trigger print dialog (optional - uncomment if needed)
        // window.onload = function() { setTimeout(() => window.print(), 500); }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// Export all methods
export default {
  generatePDF,
  generatePDFWithJsPDF,
  generatePDFViaPrint
};