import html2pdf from 'html2pdf.js'

export function exportReportToPdf(element, filename) {
  if (!element) return
  const opt = {
    margin: [12, 12, 14, 12],
    filename: filename || 'rapport-cap2030.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FBF9F4',
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] },
  }
  return html2pdf().set(opt).from(element).save()
}
