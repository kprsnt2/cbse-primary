// PDF Generation Module
// Uses html2pdf.js for PDF download and window.print() for printing

export async function downloadPDF(container, filename) {
    // Dynamically import html2pdf.js
    const html2pdf = (await import('html2pdf.js')).default;

    const options = {
        margin: [10, 10, 10, 10],
        filename: filename || 'worksheet.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    try {
        await html2pdf().set(options).from(container).save();
        return true;
    } catch (error) {
        console.error('PDF generation failed:', error);
        throw error;
    }
}

export function printWorksheet() {
    window.print();
}
