// Lazy-loaded so the heavy @react-pdf/renderer bundle is only fetched
// when the user clicks "Exporter en PDF" — initial page load stays light.
export async function exportReportToPdf({ report, profile, filename }) {
  const [{ pdf }, { default: ReportPdf }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('../components/ReportPdf.jsx'),
  ])

  const doc = <ReportPdf report={report} profile={profile} />
  const blob = await pdf(doc).toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'rapport-cap2030.pdf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
