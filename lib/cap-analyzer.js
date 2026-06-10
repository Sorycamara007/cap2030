import Anthropic from '@anthropic-ai/sdk';
import { CAP_2030_FRAMEWORK } from './capFramework.js';

export const MODEL = 'claude-sonnet-4-6';

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
      "intitule": "Intitulé EXACT du parcours du catalogue officiel (ex. « Maîtriser l'intelligence artificielle dans son exercice professionnel »)",
      "priorite": "haute|moyenne|basse",
      "duree": "Durée officielle du parcours (ex. « 4 jours — 2 modules de 2 j »)",
      "justification": "1 à 2 phrases expliquant l'apport au regard du profil et du référentiel",
      "rattachement": "Axe officiel parmi : Intégrer un cabinet | Améliorer sa performance dans son cœur de métier | Contribuer au développement de nouvelles missions | Développer une nouvelle compétence"
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
- IMPÉRATIF : chaque recommandation doit citer un parcours EXISTANT du catalogue officiel Profession Comptable 2030 ci-dessous (52 parcours disponibles). N'invente JAMAIS un parcours qui ne figure pas dans le catalogue. Reprends l'intitulé verbatim et la durée officielle.
- Toutes les recommandations doivent être rattachées à l'un des 4 axes officiels.
- Les axes de développement et points forts doivent être ancrés dans le référentiel — ne pas inventer de catégories hors référentiel.
- Pour la trajectoire 2030, appuie-toi sur les métiers nommés par le programme (data controller, welcomer, référent numérique, community manager, auditeur de durabilité H2A, pro de l'IA générative…).
- Reste factuel, bienveillant et orienté action. Pas de jugement de valeur sur la personne.
- N'inclus AUCUN texte hors de l'objet JSON. Pas de markdown, pas de commentaires.

═══════════════════════════════════════════════════════════════════
RÉFÉRENTIEL CAP 2030 (à utiliser comme grille d'analyse exclusive)
═══════════════════════════════════════════════════════════════════

${CAP_2030_FRAMEWORK}`;

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
