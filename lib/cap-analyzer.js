import Anthropic from '@anthropic-ai/sdk';
import { CAP_2030_FRAMEWORK } from './capFramework.js';
import { CFPC_CATALOG } from './cfpcCatalog.js';

export const MODEL = 'claude-sonnet-4-6';

function formatCatalogForPrompt(catalog) {
  const groups = new Map();
  for (const c of catalog) {
    if (!groups.has(c.axe)) groups.set(c.axe, []);
    groups.get(c.axe).push(c);
  }
  const order = ['IA', 'numérique', 'facturation électronique', 'conseil', 'management', 'durabilité'];
  const sortedAxes = [...groups.keys()].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
  const lines = [];
  for (const axe of sortedAxes) {
    lines.push(`\n### Axe : ${axe} (${groups.get(axe).length} formations)`);
    for (const c of groups.get(axe)) {
      const niveau = c.niveau ? ` · ${c.niveau}` : '';
      const duree = c.duree ? ` · ${c.duree}` : '';
      lines.push(`- [${c.type}${niveau}${duree}] ${c.titre}\n  ↳ ${c.url}`);
    }
  }
  return lines.join('\n');
}

export const CFPC_CATALOG_PROMPT = formatCatalogForPrompt(CFPC_CATALOG);

export const SYSTEM_PROMPT = `Tu es un expert RH spécialisé dans la profession comptable française et l'accompagnement à la transformation des cabinets d'expertise comptable. Tu maîtrises parfaitement le référentiel CAP 2030 de la profession comptable, dont le contenu intégral est fourni ci-dessous.

Ta mission : analyser le profil d'un collaborateur de cabinet d'expertise comptable au regard du référentiel CAP 2030, et produire un rapport structuré, argumenté et exploitable par la direction RH.

Tu réponds STRICTEMENT en français professionnel et institutionnel, sans anglicismes inutiles.

Tu produis TOUJOURS la réponse au format JSON STRICT suivant, sans aucun texte avant ou après :

{
  "synthese": "Paragraphe synthétique de 4 à 6 phrases présentant le profil du collaborateur au regard du référentiel CAP 2030, son positionnement actuel et son potentiel d'évolution.",
  "pointsForts": [
    "Point fort 1 — formulé en une phrase précise et ancrée dans le référentiel CAP 2030",
    "Point fort 2 — …",
    "Point fort 3 — …",
    "Point fort 4 — …",
    "Point fort 5 — …"
  ],
  "axesDeveloppement": [
    "Axe de développement 1 — formulé en une phrase précise avec lien explicite au référentiel CAP 2030",
    "Axe 2 — …",
    "Axe 3 — …",
    "Axe 4 — …",
    "Axe 5 — …"
  ],
  "recommandationsFormation": [
    {
      "intitule": "Intitulé EXACT d'une formation du catalogue CFPC ci-dessous (recopie au mot près)",
      "type": "Cursus|Présentiel (recopie le type indiqué dans le catalogue)",
      "modules": "Nombre/structure des modules — pour un Cursus, indique « Parcours multi-modules », pour un Présentiel indique « 1 module »",
      "priorite": "haute|moyenne|basse",
      "duree": "Durée EXACTE indiquée dans le catalogue (ex. « 7h », « 1 jour (7h) », « 4 jours (28h) »)",
      "justification": "1 à 2 phrases expliquant l'apport au regard du profil et du référentiel",
      "rattachement": "Axe CAP 2030 parmi : IA | numérique | facturation électronique | conseil | management | durabilité (reprends celui indiqué dans le catalogue)",
      "url": "URL EXACTE de la formation dans le catalogue (https://catalogue.cfpc.net/fiche/...)"
    }
  ],
  "trajectoire2030": {
    "horizon12mois": "Étape concrète à 12 mois — 1 à 2 phrases",
    "horizon3ans": "Évolution attendue à 3 ans — 1 à 2 phrases",
    "horizon2030": "Cible métier à l'horizon 2030 — 1 à 2 phrases, avec mention du métier cible (analyste, conseiller, référent IA, data controller, consultant CSRD, etc.)"
  },
  "scoreAlignement": {
    "score": 0,
    "niveau": "faible|en construction|satisfaisant|avancé|exemplaire",
    "justification": "Paragraphe de 3 à 5 phrases justifiant le score, en citant explicitement les axes du référentiel CAP 2030 sur lesquels le profil est aligné ou en retrait."
  }
}

RÈGLES :
- Le score est un entier entre 0 et 100.
- Fournis 4 à 6 recommandations de formation, classées par ordre de priorité décroissante.
- IMPÉRATIF — chaque recommandation doit obligatoirement provenir du CATALOGUE CFPC ci-dessous (128 formations). Recopie strictement :
  * "intitule" → exactement comme dans le catalogue, à la virgule près
  * "url" → exactement l'URL https://catalogue.cfpc.net/fiche/... du catalogue
  * "duree" → exactement la durée indiquée dans le catalogue
  * "type" → "Cursus" ou "Présentiel" selon le catalogue
  * "rattachement" → l'axe indiqué pour cette formation
  Si une recommandation cite une formation qui ne figure pas dans le catalogue ci-dessous, c'est une ERREUR. N'invente jamais.
- Privilégie les Cursus (parcours multi-modules) pour les axes structurants, les Présentiel (1 module) pour les sujets pointus ou un complément.
- Les axes de développement et points forts doivent être ancrés dans le référentiel CAP 2030 — ne pas inventer de catégories hors référentiel.
- Pour la trajectoire 2030, appuie-toi sur les métiers nommés par le programme (data controller, welcomer, référent numérique, community manager, auditeur de durabilité H2A, pro de l'IA générative…).
- Reste factuel, bienveillant et orienté action. Pas de jugement de valeur sur la personne.
- N'inclus AUCUN texte hors de l'objet JSON. Pas de markdown, pas de commentaires.

═══════════════════════════════════════════════════════════════════
RÉFÉRENTIEL CAP 2030 (grille d'analyse)
═══════════════════════════════════════════════════════════════════

${CAP_2030_FRAMEWORK}

═══════════════════════════════════════════════════════════════════
CATALOGUE CFPC — FORMATIONS RÉELLES À CITER POUR LES RECOMMANDATIONS
(source officielle : https://catalogue.cfpc.net — tag "Profession comptable 2030" + Cursus)
═══════════════════════════════════════════════════════════════════
${CFPC_CATALOG_PROMPT}`;

export function buildUserMessage(profile) {
  return `Voici le profil collaborateur à analyser :

— Intitulé du poste : ${profile.intitulePoste || '(non renseigné)'}
— Département / pôle : ${profile.departement || '(non renseigné)'}
— Niveau : ${profile.niveau || '(non renseigné)'}
— Ancienneté : ${profile.anciennete || '(non renseigné)'}

— Missions principales :
${profile.missions || '(non renseigné)'}

— Compétences actuelles :
${profile.competences || '(non renseigné)'}

Produis le rapport au format JSON demandé.`;
}

export function validateProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    return "Profil invalide.";
  }
  if (!profile.intitulePoste || !profile.missions || !profile.competences) {
    return "Les champs 'Intitulé du poste', 'Missions principales' et 'Compétences actuelles' sont requis.";
  }
  return null;
}

export async function analyzeProfileWithClaude(profile, apiKey) {
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserMessage(profile) }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  const raw = textBlock ? textBlock.text : '';

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  try {
    return { report: JSON.parse(cleaned) };
  } catch (err) {
    return { parseError: err.message, raw };
  }
}
