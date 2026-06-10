import { useState } from 'react'
import Header from './components/Header.jsx'
import ProfileForm from './components/ProfileForm.jsx'
import Report from './components/Report.jsx'
import Loading from './components/Loading.jsx'
import Template from './pages/Template.jsx'
import { analyzeProfile } from './lib/api.js'

export default function App() {
  const [view, setView] = useState('analyzer') // 'analyzer' | 'template'
  const [profile, setProfile] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(formData) {
    setLoading(true)
    setError(null)
    setReport(null)
    setProfile(formData)
    try {
      const data = await analyzeProfile(formData)
      setReport(data.report)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'analyse.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setReport(null)
    setProfile(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (view === 'template') {
    return <Template onBack={() => setView('analyzer')} />
  }

  return (
    <div className="min-h-screen bg-cream text-navy">
      <Header onShowTemplate={() => setView('template')} />

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-20">
        {!report && !loading && (
          <>
            <section className="mb-16 md:mb-20">
              <div className="label-eyebrow-gold mb-6">Référentiel CAP 2030 · Profession Comptable</div>
              <h1 className="display-1 mb-8 max-w-4xl">
                Analyseur de profil collaborateur
              </h1>
              <div className="rule-gold mb-8" />
              <p className="max-w-2xl text-lg leading-relaxed text-navy/80 font-serif">
                Renseignez le profil d'un collaborateur de votre cabinet. L'analyseur
                compare ses missions et compétences au référentiel CAP 2030 et produit
                un rapport structuré : points forts, axes de développement, plan de
                formation et trajectoire 2030.
              </p>
            </section>

            <ProfileForm onSubmit={handleSubmit} error={error} />
          </>
        )}

        {loading && <Loading />}

        {report && profile && (
          <Report
            report={report}
            profile={profile}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="border-t border-rule mt-20 py-10 no-print">
        <div className="max-w-5xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between gap-6 text-xs uppercase tracking-wider2 text-navy/50">
          <div>CAP 2030 · Outil interne RH</div>
          <div>Référentiel : cap.professioncomptable2030.fr</div>
        </div>
      </footer>
    </div>
  )
}
