export default function Template({ onBack }) {
  function handlePrint() {
    window.print()
  }

  return (
    <div className="min-h-screen bg-cream text-navy">
      {/* Toolbar — hidden when printing */}
      <div className="border-b border-rule no-print">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-xs uppercase tracking-wider2 text-navy/70 hover:text-gold transition-colors"
          >
            ← Retour à l'analyseur
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-gold"
          >
            Imprimer / Enregistrer en PDF
          </button>
        </div>
      </div>

      {/* Printable A4 page */}
      <main className="max-w-4xl mx-auto px-8 md:px-16 py-12 md:py-16 print-page">
        {/* Header */}
        <header className="flex items-start justify-between gap-8 pb-8 border-b border-navy">
          <div className="flex items-center gap-5">
            {/* Cabinet logo placeholder */}
            <div className="w-20 h-20 border-2 border-dashed border-navy/30 flex items-center justify-center text-[10px] uppercase tracking-wider2 text-navy/40 text-center leading-tight px-2">
              Logo<br/>cabinet
            </div>
            <div>
              <div className="label-eyebrow-gold mb-2">CAP 2030 · Profession comptable</div>
              <h1 className="font-display text-3xl text-navy leading-tight">
                Fiche profil collaborateur
              </h1>
              <div className="text-xs text-navy/60 mt-1 font-serif italic">
                Document préparatoire à l'analyse CAP 2030
              </div>
            </div>
          </div>
          <div className="text-right text-xs uppercase tracking-wider2 text-navy/50 leading-relaxed">
            Réf. interne :<br/>
            <span className="inline-block border-b border-navy/30 w-24 mt-1">&nbsp;</span>
          </div>
        </header>

        {/* Instructions */}
        <section className="mt-8 mb-10">
          <div className="label-eyebrow-gold mb-3">À l'attention du collaborateur</div>
          <p className="font-serif text-navy/85 leading-relaxed text-[15px] max-w-3xl">
            Cette fiche sert à recueillir les éléments nécessaires à l'analyse de votre
            profil au regard du référentiel <strong>CAP 2030</strong>, démarche nationale
            d'accompagnement de la profession comptable face aux transformations
            numériques, à la facturation électronique et à l'élargissement des missions.
            Elle sera ensuite saisie par votre service RH dans l'outil d'analyse CAP 2030
            afin de produire un rapport individuel : points forts, axes de développement,
            recommandations de formation et trajectoire à l'horizon 2030. Merci de remplir
            chaque section avec précision et sincérité.
          </p>
        </section>

        {/* Section 01 — Poste */}
        <section className="mb-8">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-display text-gold text-xl">01</span>
            <div className="label-eyebrow">Identification du poste</div>
          </div>
          <div className="rule-h mb-6" />

          <div className="grid grid-cols-1 gap-y-7">
            <FormLine label="Intitulé du poste" />
            <FormLine label="Département / pôle de rattachement" />

            <div className="grid grid-cols-2 gap-x-10">
              <FormBlock label="Niveau">
                <CheckboxList items={['Junior', 'Confirmé', 'Senior', 'Manager', 'Associé']} />
              </FormBlock>
              <FormBlock label="Ancienneté dans la profession">
                <CheckboxList items={["Moins d'1 an", '1 à 3 ans', '3 à 5 ans', '5 à 10 ans', 'Plus de 10 ans']} />
              </FormBlock>
            </div>
          </div>
        </section>

        {/* Section 02 — Missions */}
        <section className="mb-8">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-display text-gold text-xl">02</span>
            <div className="label-eyebrow">Missions principales</div>
          </div>
          <div className="rule-h mb-3" />
          <p className="text-[13px] font-serif italic text-navy/60 mb-5 max-w-2xl">
            Décrivez les missions effectivement exercées au quotidien : tenue, révision,
            production, conseil, accompagnement client, encadrement, missions transverses…
          </p>
          <WriteLines count={9} />
        </section>

        {/* Section 03 — Compétences */}
        <section className="mb-8">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-display text-gold text-xl">03</span>
            <div className="label-eyebrow">Compétences actuelles</div>
          </div>
          <div className="rule-h mb-3" />
          <p className="text-[13px] font-serif italic text-navy/60 mb-5 max-w-2xl">
            Listez les compétences techniques, métier et relationnelles maîtrisées, ainsi
            que les outils utilisés (logiciels comptables, paie, IA, BI, Excel…).
          </p>
          <WriteLines count={9} />
        </section>

        {/* Signatures */}
        <section className="mt-12 pt-8 border-t border-rule grid grid-cols-2 gap-10">
          <div>
            <div className="label-eyebrow mb-3">Le collaborateur</div>
            <div className="text-xs font-serif text-navy/60 mb-10">Date et signature</div>
            <div className="h-16 border-b border-navy/40" />
          </div>
          <div>
            <div className="label-eyebrow mb-3">Le responsable RH</div>
            <div className="text-xs font-serif text-navy/60 mb-10">Date et signature</div>
            <div className="h-16 border-b border-navy/40" />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-4 border-t border-rule flex justify-between text-[10px] uppercase tracking-wider2 text-navy/50">
          <div>CAP 2030 · Fiche profil collaborateur</div>
          <div>Document interne — usage RH</div>
        </footer>
      </main>
    </div>
  )
}

function FormLine({ label }) {
  return (
    <div>
      <div className="label-eyebrow mb-2">{label}</div>
      <div className="h-8 border-b border-navy/40" />
    </div>
  )
}

function FormBlock({ label, children }) {
  return (
    <div>
      <div className="label-eyebrow mb-3">{label}</div>
      {children}
    </div>
  )
}

function CheckboxList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 border border-navy/60 shrink-0" />
          <span className="font-serif text-navy/85 text-[15px]">{it}</span>
        </li>
      ))}
    </ul>
  )
}

function WriteLines({ count = 8 }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-7 border-b border-navy/25" />
      ))}
    </div>
  )
}
