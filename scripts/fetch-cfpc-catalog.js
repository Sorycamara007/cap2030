// Regenerate lib/cfpcCatalog.js from the CFPC catalogue API.
// Run with: node scripts/fetch-cfpc-catalog.js
//
// Source endpoints (return all courses tagged "Profession comptable 2030" +
// all "Cursus" type courses):
//   https://api-jinius.cfpc.net/catalogue/recherche?tagsIds=638
//   https://api-jinius.cfpc.net/catalogue/recherche?typesIds=8

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'lib', 'cfpcCatalog.js');

const URLS = [
  'https://api-jinius.cfpc.net/catalogue/recherche?tagsIds=638',
  'https://api-jinius.cfpc.net/catalogue/recherche?typesIds=8',
];

const THEME_TO_AXE = {
  "Système d'information et Numérique": 'numérique',
  'Management/Marketing/Communication': 'management',
  'Gestion et Finances': 'conseil',
  'Nouvelles missions': 'conseil',
  'Comptabilité/Révision': 'conseil',
  'Social/Paie': 'conseil',
  'Performance du cabinet': 'management',
  'Gestion de patrimoine': 'conseil',
  Durabilité: 'durabilité',
  Actualité: 'conseil',
  'Déontologie/Doctrine/Normes': 'conseil',
  Juridique: 'conseil',
  Fiscalité: 'conseil',
};

function deriveAxe(c) {
  const title = (c.titre || '').toLowerCase();
  if (/(\bia\b|intelligence artificielle|chatgpt|copilot|prompt|llm|gen[ée]rativ)/.test(title)) return 'IA';
  if (/(facture[s]?\s*[ée]lectroniqu|facturation [ée]lectronique|e-?invoic)/.test(title)) return 'facturation électronique';
  if (/(durabilit[ée]|esg|rse|extra[- ]?financ|csrd)/.test(title)) return 'durabilité';
  const themes = (c.themesComplementaires || []).map((t) => t.label);
  for (const t of themes) if (THEME_TO_AXE[t]) return THEME_TO_AXE[t];
  return 'numérique';
}

function fmtDuree(c) {
  const j = c.dureeJours;
  const m = c.dureeMinutes;
  if (!j && !m) return '';
  if (m && m % 60 === 0 && m <= 420) return `${m / 60}h`;
  if (j && Number.isInteger(j) && j > 0) return j === 1 ? '1 jour (7h)' : `${j} jours (${j * 7}h)`;
  if (j) return `${j} j`;
  return `${m} min`;
}

async function main() {
  const merged = new Map();
  for (const url of URLS) {
    process.stdout.write(`Fetching ${url}… `);
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const count = data.catalogues?.length || 0;
    console.log(`${count} entrées`);
    for (const c of data.catalogues || []) merged.set(c.ficheId, c);
  }

  const items = [];
  for (const c of merged.values()) {
    if (!c.titre) continue;
    items.push({
      id: c.ficheId,
      ref: c.produitReference || '',
      type: c.ficheType?.label || c.type?.label || '',
      niveau: c.niveau?.label || '',
      titre: c.titre.replace(/\s+/g, ' ').trim(),
      duree: fmtDuree(c),
      axe: deriveAxe(c),
      url: `https://catalogue.cfpc.net/fiche/${c.ficheId}`,
    });
  }

  items.sort((x, y) => {
    if (x.type !== y.type) return x.type === 'Cursus' ? -1 : 1;
    if (x.axe !== y.axe) return x.axe.localeCompare(y.axe);
    return x.titre.localeCompare(y.titre);
  });

  const compact = items
    .map(
      (i) =>
        `{"id":${i.id},"ref":"${i.ref}","type":"${i.type}","niveau":"${i.niveau}","titre":${JSON.stringify(i.titre)},"duree":"${i.duree}","axe":"${i.axe}","url":"${i.url}"}`,
    )
    .join(',\n  ');

  const out = `// Auto-generated from https://catalogue.cfpc.net (tagsIds=638 + typesIds=8) on ${new Date().toISOString().slice(0, 10)}
// Source: https://api-jinius.cfpc.net/catalogue/recherche
// Do not edit by hand — run scripts/fetch-cfpc-catalog.js to refresh.

export const CFPC_CATALOG = [
  ${compact}
];
`;
  fs.writeFileSync(OUT, out);
  console.log(`\n✓ ${items.length} formations écrites dans ${path.relative(process.cwd(), OUT)}`);

  // Distribution summary
  const byAxe = {};
  const byType = {};
  for (const it of items) {
    byAxe[it.axe] = (byAxe[it.axe] || 0) + 1;
    byType[it.type] = (byType[it.type] || 0) + 1;
  }
  console.log('Par axe :', byAxe);
  console.log('Par type :', byType);
}

main().catch((e) => {
  console.error('Échec :', e.message);
  process.exit(1);
});
