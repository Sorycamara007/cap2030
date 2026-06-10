import html2pdf from 'html2pdf.js'

export function exportReportToPdf(element, filename, meta = {}) {
  if (!element) return

  const headerLeft = meta.headerLeft || 'CAP 2030 · Profession Comptable'
  const headerRight =
    meta.headerRight ||
    new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

  const opt = {
    margin: [22, 14, 22, 14],
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

  return html2pdf()
    .set(opt)
    .from(element)
    .toPdf()
    .get('pdf')
    .then((pdf) => {
      const total = pdf.internal.getNumberOfPages()
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const sideMargin = 14

      for (let i = 1; i <= total; i += 1) {
        pdf.setPage(i)

        // Header
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.setTextColor(140, 140, 140)
        pdf.text(headerLeft, sideMargin, 10)
        pdf.text(headerRight, pageW - sideMargin, 10, { align: 'right' })
        pdf.setDrawColor(220, 215, 200)
        pdf.setLineWidth(0.2)
        pdf.line(sideMargin, 12, pageW - sideMargin, 12)

        // Footer page numbers
        pdf.setDrawColor(220, 215, 200)
        pdf.line(sideMargin, pageH - 12, pageW - sideMargin, pageH - 12)
        pdf.setFontSize(8)
        pdf.setTextColor(140, 140, 140)
        pdf.text(`Page ${i} / ${total}`, pageW / 2, pageH - 7, {
          align: 'center',
        })
      }
    })
    .save()
}
