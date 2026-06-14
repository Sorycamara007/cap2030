import { useState } from 'react'

const NIVEAUX = [
  { value: '', label: 'Sélectionner un niveau' },
  { value: 'junior', label: 'Junior' },
  { value: 'confirmé', label: 'Confirmé' },
  { value: 'senior', label: 'Senior' },
  { value: 'manager', label: 'Manager' },
  { value: 'associé', label: 'Associé' },
]

const ANCIENNETES = [
  { value: '', label: 'Sélectionner une ancienneté' },
  { value: "moins d'1 an", label: "Moins d'1 an" },
  { value: '1-3 ans', label: '1 à 3 ans' },
  { value: '3-5 ans', label: '3 à 5 ans' },
  { value: '5-10 ans', label: '5 à 10 ans' },
  { value: 'plus de 10 ans', label: 'Plus de 10 ans' },
]

const EMPTY = {
  intitulePoste: '',
  missions: '',
  competences: '',
  anciennete: '',
  departement: '',
  niveau: '',
  objectifProfessionnel3ans: '',
  formationsDejaSuivies: '',
}

export default function ProfileForm({ onSubmit, error }) {
  const [data, setData] = useState(EMPTY)

  function update(field, value) {
    setData((d) => ({ ...d, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(data)
  }

  const required = data.intitulePoste && data.missions && data.competences

  return (
    <form onSubmit={handleSubmit} className="space-y-14">
      <section>
        <div className="label-eyebrow mb-3">Section 01 · Poste</div>
        <div className="rule-h mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <label className="block label-eyebrow mb-3">
              Intitulé du poste *
            </label>
            <input
              type="text"
              value={data.intitulePoste}
              onChange={(e) => update('intitulePoste', e.target.value)}
              placeholder="Ex. Collaborateur comptable senior"
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="block label-eyebrow mb-3">
              Département / pôle
            </label>
            <input
              type="text"
              value={data.departement}
              onChange={(e) => update('departement', e.target.value)}
              placeholder="Ex. Pôle expertise comptable TPE"
              className="input-base"
            />
          </div>

          <div>
            <label className="block label-eyebrow mb-3">
              Niveau
            </label>
            <select
              value={data.niveau}
              onChange={(e) => update('niveau', e.target.value)}
              className="select-base"
            >
              {NIVEAUX.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block label-eyebrow mb-3">
              Ancienneté
            </label>
            <select
              value={data.anciennete}
              onChange={(e) => update('anciennete', e.target.value)}
              className="select-base"
            >
              {ANCIENNETES.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section>
        <div className="label-eyebrow mb-3">Section 02 · Missions</div>
        <div className="rule-h mb-10" />

        <label className="block label-eyebrow mb-3">
          Missions principales *
        </label>
        <p className="text-sm text-navy/60 font-serif mb-4 max-w-2xl">
          Décrivez les missions effectivement exercées : production comptable,
          révision, conseil, accompagnement client, encadrement…
        </p>
        <textarea
          value={data.missions}
          onChange={(e) => update('missions', e.target.value)}
          placeholder="Ex. Tenue et révision d'un portefeuille de 30 TPE, production de bilans annuels, accompagnement à la déclaration de TVA, premier conseil client, encadrement d'un assistant comptable…"
          className="textarea-base"
          rows={6}
          required
        />
      </section>

      <section>
        <div className="label-eyebrow mb-3">Section 03 · Compétences</div>
        <div className="rule-h mb-10" />

        <label className="block label-eyebrow mb-3">
          Compétences actuelles *
        </label>
        <p className="text-sm text-navy/60 font-serif mb-4 max-w-2xl">
          Listez les compétences techniques, métier et relationnelles maîtrisées,
          ainsi que les outils utilisés (logiciels, IA, BI…).
        </p>
        <textarea
          value={data.competences}
          onChange={(e) => update('competences', e.target.value)}
          placeholder="Ex. Maîtrise de Sage et Cegid, lecture de bilans, premières utilisations de ChatGPT pour rédaction, bonnes bases Excel, capacité à dialoguer avec un dirigeant TPE, vigilance fiscale…"
          className="textarea-base"
          rows={6}
          required
        />
      </section>

      <section>
        <div className="label-eyebrow mb-3">Section 04 · Aspirations & parcours</div>
        <div className="rule-h mb-10" />

        <div className="space-y-10">
          <div>
            <label className="block label-eyebrow mb-3">
              Objectif professionnel à 3 ans
            </label>
            <p className="text-sm text-navy/60 font-serif mb-4 max-w-2xl">
              Optionnel — la cible métier ou la prise de responsabilité visée
              par le collaborateur d'ici 3 ans. Sert à ancrer la trajectoire 2030
              du rapport.
            </p>
            <input
              type="text"
              value={data.objectifProfessionnel3ans}
              onChange={(e) => update('objectifProfessionnel3ans', e.target.value)}
              placeholder="Ex. Évoluer vers un poste de manager d'équipe avec dimension conseil renforcée"
              className="input-base"
            />
          </div>

          <div>
            <label className="block label-eyebrow mb-3">
              Formations déjà suivies
            </label>
            <p className="text-sm text-navy/60 font-serif mb-4 max-w-2xl">
              Optionnel — les formations CFPC ou équivalentes déjà suivies.
              Permet d'éviter de recommander à nouveau ces parcours et
              de calibrer les axes de développement.
            </p>
            <textarea
              value={data.formationsDejaSuivies}
              onChange={(e) => update('formationsDejaSuivies', e.target.value)}
              placeholder="Ex. Initiation à la facturation électronique (CFPC, 2024), DEC obtenu en 2022, formation interne Cegid en 2023…"
              className="textarea-base"
              rows={5}
            />
          </div>
        </div>
      </section>

      {error && (
        <div className="border-l-2 border-gold pl-5 py-2 bg-cream">
          <div className="label-eyebrow-gold mb-2">Erreur</div>
          <p className="text-navy font-serif text-base">{error}</p>
        </div>
      )}

      <div className="pt-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        <button
          type="submit"
          disabled={!required}
          className="btn-primary"
        >
          Lancer l'analyse CAP 2030
        </button>
        <p className="text-xs text-navy/50 font-serif italic">
          Les champs marqués d'un astérisque sont obligatoires.
        </p>
      </div>
    </form>
  )
}
