import { analyzeProfileWithClaude, validateProfile } from '../lib/cap-analyzer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const expectedPassword = process.env.APP_PASSWORD;
    const auth = req.headers.authorization || '';
    const token = auth.replace(/^Bearer\s+/i, '').trim();
    if (!expectedPassword || token !== expectedPassword) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Clé ANTHROPIC_API_KEY non configurée sur le serveur.",
      });
    }

    const profile = req.body || {};
    const validationError = validateProfile(profile);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await analyzeProfileWithClaude(profile, apiKey);

    if (result.parseError) {
      console.error('Échec parsing JSON modèle :', result.parseError);
      return res.status(502).json({
        error: "Le modèle a renvoyé une réponse non parseable. Réessayez.",
        raw: result.raw,
      });
    }

    return res.json({ report: result.report });
  } catch (err) {
    console.error('Erreur /api/analyze :', err);
    return res.status(500).json({
      error: err.message || "Erreur interne lors de l'appel au modèle.",
    });
  }
}
