import { useEffect, useState } from 'react'

const STEPS = [
  'Lecture du profil collaborateur',
  'Comparaison au référentiel CAP 2030',
  'Identification des compétences clés',
  'Construction du plan de formation',
  'Projection de la trajectoire 2030',
  'Rédaction du rapport',
]

export default function Loading() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20">
      <div className="label-eyebrow-gold mb-6">Analyse en cours</div>
      <h2 className="display-2 mb-10 max-w-3xl">
        Élaboration du rapport au regard du référentiel CAP 2030
      </h2>
      <div className="rule-gold mb-12" />

      <ol className="space-y-5 max-w-xl">
        {STEPS.map((s, i) => {
          const isActive = i === step
          const isDone = i < step
          return (
            <li
              key={s}
              className="flex items-baseline gap-5 transition-opacity duration-500"
              style={{ opacity: isActive || isDone ? 1 : 0.35 }}
            >
              <span className="font-display text-gold text-xl w-8 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-navy font-serif text-lg leading-tight">
                {s}
                {isActive && <span className="inline-block ml-2 w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />}
              </span>
            </li>
          )
        })}
      </ol>

      <p className="mt-14 text-xs uppercase tracking-wider2 text-navy/50">
        Cette opération peut prendre une vingtaine de secondes
      </p>
    </section>
  )
}
