// Serveur Express pour le développement local uniquement.
// En production sur Vercel, ce sont les fonctions /api/*.js qui sont utilisées.
import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import cors from 'cors';
import {
  analyzeProfileWithClaude,
  validateProfile,
} from '../lib/cap-analyzer.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3001;

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.ANTHROPIC_API_KEY),
    hasPassword: Boolean(process.env.APP_PASSWORD),
  });
});

app.post('/api/login', (req, res) => {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    return res.status(500).json({
      error: "Mot de passe non configuré côté serveur (APP_PASSWORD manquant).",
    });
  }
  const { password } = req.body || {};
  if (typeof password !== 'string' || password !== expected) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  res.json({ ok: true, token: expected });
});

app.post('/api/analyze', async (req, res) => {
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
        error: "Clé ANTHROPIC_API_KEY non configurée sur le serveur. Renseignez-la dans le fichier .env puis relancez le serveur.",
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

    res.json({ report: result.report });
  } catch (err) {
    console.error('Erreur /api/analyze :', err);
    res.status(500).json({
      error: err.message || "Erreur interne lors de l'appel au modèle.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n  ▸ Serveur CAP 2030 démarré sur http://localhost:${PORT}`);
  console.log(`  ▸ Clé Anthropic : ${process.env.ANTHROPIC_API_KEY ? 'configurée ✓' : 'manquante ✗ (voir .env)'}\n`);
});
