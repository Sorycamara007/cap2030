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
import { sendReportEmail } from '../lib/email-report.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3001;

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.ANTHROPIC_API_KEY),
    hasPassword: Boolean(process.env.APP_PASSWORD),
    hasResend: Boolean(process.env.RESEND_API_KEY),
    emailTo: process.env.REPORT_EMAIL_TO || null,
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

app.post('/api/send-report', async (req, res) => {
  const expectedPassword = process.env.APP_PASSWORD;
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!expectedPassword || token !== expectedPassword) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.REPORT_EMAIL_TO;
  const from = process.env.REPORT_EMAIL_FROM || 'CAP 2030 <onboarding@resend.dev>';

  if (!apiKey) return res.status(500).json({ error: 'RESEND_API_KEY non configurée sur le serveur.' });
  if (!to) return res.status(500).json({ error: 'REPORT_EMAIL_TO non configurée sur le serveur.' });

  const { profile, report } = req.body || {};
  if (!profile || !report) {
    return res.status(400).json({ error: 'Profil ou rapport manquant.' });
  }

  try {
    const data = await sendReportEmail({ profile, report, apiKey, to, from });
    res.json({ ok: true, id: data?.id || null });
  } catch (err) {
    console.error('Erreur /api/send-report :', err);
    res.status(500).json({ error: err.message || "Erreur lors de l'envoi de l'email." });
  }
});

app.listen(PORT, () => {
  console.log(`\n  ▸ Serveur CAP 2030 démarré sur http://localhost:${PORT}`);
  console.log(`  ▸ Clé Anthropic : ${process.env.ANTHROPIC_API_KEY ? 'configurée ✓' : 'manquante ✗ (voir .env)'}`);
  console.log(`  ▸ Resend        : ${process.env.RESEND_API_KEY ? `configurée ✓ → ${process.env.REPORT_EMAIL_TO || '(REPORT_EMAIL_TO manquant)'}` : 'manquante ✗ (voir .env)'}\n`);
});
