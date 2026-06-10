import { useState } from 'react'
import { login } from '../lib/auth.js'

export default function LoginScreen({ onAuthenticated }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password) return
    setLoading(true)
    setError(null)
    try {
      await login(password)
      onAuthenticated()
    } catch (err) {
      setError(err.message || 'Mot de passe incorrect')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy text-cream flex flex-col">
      {/* Top bar */}
      <header className="border-b border-cream/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex items-center gap-4">
          <div className="w-10 h-10 border border-gold flex items-center justify-center">
            <span className="font-display text-gold text-xl leading-none">C</span>
          </div>
          <div>
            <div className="font-display text-xl leading-none text-cream">CAP 2030</div>
            <div className="text-[10px] uppercase tracking-wider2 text-cream/50 mt-1">
              Accès réservé · Outil interne RH
            </div>
          </div>
        </div>
      </header>

      {/* Centered login */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-xl py-16">
          <div className="label-eyebrow-gold mb-6">Authentification</div>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-cream font-medium mb-8">
            CAP 2030<br/>
            <span className="text-gold">Analyseur de Profil RH</span>
          </h1>
          <div className="h-px w-12 bg-gold mb-10" />

          <p className="font-serif text-cream/75 text-lg leading-relaxed mb-12 max-w-md">
            Cette plateforme est réservée aux équipes RH habilitées.
            Renseignez le mot de passe pour accéder à l'analyseur.
          </p>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-wider2 text-cream/60 font-medium mb-3"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full bg-transparent border-0 border-b border-cream/30
                           px-0 py-3 text-cream placeholder:text-cream/25 text-lg
                           focus:outline-none focus:border-gold focus:ring-0
                           transition-colors duration-200 font-sans tracking-wider"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="border-l-2 border-gold pl-5 py-2">
                <div className="text-[10px] uppercase tracking-wider2 text-gold font-semibold mb-1">
                  Erreur
                </div>
                <p className="font-serif text-cream text-base">{error}</p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={!password || loading}
                className="inline-flex items-center justify-center px-10 py-4
                           bg-gold text-navy uppercase tracking-wider2 text-xs font-semibold
                           hover:bg-gold-light transition-colors duration-200
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Vérification…' : 'Accéder à l\'application'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cream/10 py-6">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between gap-3 text-[10px] uppercase tracking-wider2 text-cream/40">
          <div>CAP 2030 · Profession comptable</div>
          <div>Référentiel : cap.professioncomptable2030.fr</div>
        </div>
      </footer>
    </div>
  )
}
