import { useRef, useState } from 'react'
import ScoreVisual from './ScoreVisual.jsx'
import { exportReportToPdf } from '../lib/pdf.js'

const PRIORITE_LABEL = {
  haute: 'Priorité haute',
  moyenne: 'Priorité moyenne',
  basse: 'Priorité basse',
}

const PRIORITE_SHORT = {
  haute: 'Haute',
  moyenne: 'Moyenne',
  basse: 'Basse',
}

const ECHEANCE_BY_PRIORITE = {
  haute: '0 à 3 mois',
  moyenne: '3 à 9 mois',
  basse: '9 à 18 mois',
}

const SCORE_RANGES = [
  { min: 0, max: 40, label: 'Insuffisant' },
  { min: 41, max: 70, label: 'Satisfaisant' },
  { min: 71, max: 100, label: 'Aligné' },
]

function Section({ eyebrow, number, title, children }) {
  return (
    <section className="py-12 md:py-16 border-t border-rule first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-6 mb-6">
        <span className="font-display text-gold text-2xl leading-none">
          {String(number).padStart(2, '0')}
        </span>
        <div className="label-eyebrow">{eyebrow}</div>
      </div>
      <h2 className="display-2 mb-4 max-w-3xl">{title}</h2>
      <div className="rule-gold mb-10" />
      {children}
    </section>
  )
}

export default function Report({ report, profile, onReset }) {
  const reportRef = useRef(null)
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    if (!reportRef.current) return
    setExporting(true)
    try {
      const filename = `cap2030-${(profile.intitulePoste || 'profil').toLowerCase().replace(/\s+/g, '-')}.pdf`
      const dateStr = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
      await exportReportToPdf(reportRef.current, filename, {
        headerLeft: 'CAP 2030 · Exco Nexiom',
        headerRight: dateStr,
      })
    } finally {
      setExporting(false)
    }
  }

  const {
    synthese = '',
    pointsForts = [],
    axesDeveloppement = [],
    recommandationsFormation = [],
    trajectoire2030 = {},
    scoreAlignement = {},
  } = report

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 no-print">
        <div>
          <div className="label-eyebrow-gold mb-3">Rapport finalisé</div>
          <h1 className="display-2 max-w-2xl">
            Analyse CAP 2030 — {profile.intitulePoste}
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={onReset} type="button" className="btn-ghost">
            Nouveau profil
          </button>
          <button
            onClick={handleExport}
            type="button"
            disabled={exporting}
            className="btn-gold"
          >
            {exporting ? 'Export en cours…' : 'Exporter en PDF'}
          </button>
        </div>
      </div>

      <article ref={reportRef} className="bg-cream px-1 md:px-2">
        {/* PDF cover */}
        <header className="mb-12 pb-12 border-b border-rule">
          <div className="label-eyebrow-gold mb-4">CAP 2030 · Profession comptable</div>
          <h1 className="display-1 mb-6 max-w-3xl">
            Rapport d'analyse de profil
          </h1>
          <div className="rule-gold mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 max-w-3xl text-sm font-serif text-navy/80">
            <div><span className="text-navy/50">Poste : </span>{profile.intitulePoste || '—'}</div>
            <div><span className="text-navy/50">Département : </span>{profile.departement || '—'}</div>
            <div><span className="text-navy/50">Niveau : </span><span className="capitalize">{profile.niveau || '—'}</span></div>
            <div><span className="text-navy/50">Ancienneté : </span>{profile.anciennete || '—'}</div>
          </div>
          <div className="mt-6 text-xs uppercase tracking-wider2 text-navy/50">
            Édité le {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </header>

        <Section number={1} eyebrow="Synthèse" title="Synthèse du profil">
          <p className="font-serif text-navy/90 text-lg leading-relaxed max-w-prose2">
            {synthese}
          </p>
        </Section>

        <Section number={2} eyebrow="Points forts" title="Points forts identifiés">
          <ul className="space-y-5 max-w-3xl">
            {pointsForts.map((p, i) => (
              <li key={i} className="flex items-baseline gap-5">
                <span className="font-display text-gold text-xl leading-none w-6 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-navy/90 text-base leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section number={3} eyebrow="Développement" title="Axes de développement">
          <ul className="space-y-5 max-w-3xl">
            {axesDeveloppement.map((a, i) => (
              <li key={i} className="flex items-baseline gap-5">
                <span className="font-display text-gold text-xl leading-none w-6 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-navy/90 text-base leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section number={4} eyebrow="Formation" title="Recommandations formation">
          <div className="space-y-10 max-w-3xl">
            {recommandationsFormation.map((r, i) => (
              <div key={i} className="grid grid-cols-[auto,1fr] gap-6">
                <div className="font-display text-gold text-xl leading-none pt-1">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="flex items-baseline gap-4 flex-wrap mb-1">
                    <h3 className="font-display text-navy text-xl md:text-2xl leading-tight">
                      {r.intitule}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider2 text-gold font-semibold">
                      {PRIORITE_LABEL[r.priorite] || r.priorite}
                    </span>
                  </div>
                  {(r.rattachement || r.duree) && (
                    <div className="text-xs uppercase tracking-wider2 text-navy/50 mb-3 flex flex-wrap gap-x-6 gap-y-1">
                      {r.rattachement && <span>Axe · {r.rattachement}</span>}
                      {r.duree && <span>Durée · {r.duree}</span>}
                    </div>
                  )}
                  <p className="font-serif text-navy/85 leading-relaxed">
                    {r.justification}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section number={5} eyebrow="Trajectoire" title="Trajectoire 2030">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl">
            {[
              { label: 'Horizon 12 mois', value: trajectoire2030.horizon12mois },
              { label: 'Horizon 3 ans', value: trajectoire2030.horizon3ans },
              { label: 'Horizon 2030', value: trajectoire2030.horizon2030 },
            ].map((h) => (
              <div key={h.label}>
                <div className="label-eyebrow-gold mb-3">{h.label}</div>
                <div className="rule-h mb-4" />
                <p className="font-serif text-navy/90 text-base leading-relaxed">
                  {h.value}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section number={6} eyebrow="Score" title="Score d'alignement CAP 2030">
          <ScoreVisual
            score={scoreAlignement.score}
            niveau={scoreAlignement.niveau}
            justification={scoreAlignement.justification}
          />

          <div
            className="mt-10 pt-8 border-t border-rule max-w-3xl"
            style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            <div className="label-eyebrow mb-4">Légende du score</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SCORE_RANGES.map((r) => {
                const score = Math.max(0, Math.min(100, Number(scoreAlignement.score) || 0))
                const active = score >= r.min && score <= r.max
                return (
                  <div
                    key={r.label}
                    className={`px-4 py-3 border-l-2 ${active ? 'border-gold bg-gold/10' : 'border-rule bg-cream'}`}
                  >
                    <div
                      className={`text-[10px] uppercase tracking-wider2 font-semibold mb-1 ${active ? 'text-gold' : 'text-navy/50'}`}
                    >
                      {r.min}–{r.max}
                    </div>
                    <div
                      className={`font-display text-lg leading-tight ${active ? 'text-navy' : 'text-navy/60'}`}
                    >
                      {r.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Section>

        <Section number={7} eyebrow="Plan d'action" title="Plan d'action de formation">
          <div className="max-w-3xl">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-navy/40">
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-wider2 text-navy/60 font-semibold align-bottom">
                    Formation
                  </th>
                  <th className="py-3 px-3 text-[10px] uppercase tracking-wider2 text-navy/60 font-semibold align-bottom whitespace-nowrap">
                    Priorité
                  </th>
                  <th className="py-3 px-3 text-[10px] uppercase tracking-wider2 text-navy/60 font-semibold align-bottom whitespace-nowrap">
                    Durée
                  </th>
                  <th className="py-3 pl-3 text-[10px] uppercase tracking-wider2 text-navy/60 font-semibold align-bottom whitespace-nowrap">
                    Échéance suggérée
                  </th>
                </tr>
              </thead>
              <tbody>
                {recommandationsFormation.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-rule"
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                  >
                    <td className="py-4 pr-4 align-top">
                      <div className="font-display text-navy text-base leading-snug">
                        {r.intitule}
                      </div>
                      {r.rattachement && (
                        <div className="text-[10px] uppercase tracking-wider2 text-navy/45 mt-1">
                          Axe · {r.rattachement}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-3 align-top whitespace-nowrap">
                      <span className="text-[10px] uppercase tracking-wider2 text-gold font-semibold">
                        {PRIORITE_SHORT[r.priorite] || r.priorite}
                      </span>
                    </td>
                    <td className="py-4 px-3 align-top whitespace-nowrap font-serif text-navy/85 text-sm">
                      {r.duree || '—'}
                    </td>
                    <td className="py-4 pl-3 align-top whitespace-nowrap font-serif text-navy/85 text-sm">
                      {ECHEANCE_BY_PRIORITE[r.priorite] || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <section
          className="mt-16 pt-12 border-t border-rule"
          style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
        >
          <div className="label-eyebrow-gold mb-8">Validation</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="text-xs uppercase tracking-wider2 text-navy/60 font-semibold mb-16">
                Signature RH
              </div>
              <div className="h-px bg-navy/40 mb-2" />
              <div className="text-[10px] uppercase tracking-wider2 text-navy/40">
                Date · Lieu
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider2 text-navy/60 font-semibold mb-16">
                Signature Collaborateur
              </div>
              <div className="h-px bg-navy/40 mb-2" />
              <div className="text-[10px] uppercase tracking-wider2 text-navy/40">
                Date · Lieu
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <span
              aria-hidden
              className="inline-block w-4 h-4 border border-navy shrink-0"
            />
            <span className="text-sm font-serif text-navy/85">
              Document remis au collaborateur le :
              <span className="inline-block ml-2 border-b border-navy/40 w-48 align-bottom">&nbsp;</span>
            </span>
          </div>
        </section>

        <footer className="mt-16 pt-10 border-t border-rule">
          <div className="flex flex-col md:flex-row justify-between gap-4 text-xs uppercase tracking-wider2 text-navy/50">
            <div>Rapport généré par CAP 2030 Analyzer</div>
            <div>Référentiel : cap.professioncomptable2030.fr</div>
          </div>
        </footer>
      </article>
    </div>
  )
}
