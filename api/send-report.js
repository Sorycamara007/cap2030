import { sendReportEmail } from '../lib/email-report.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    return res.json({ ok: true, id: data?.id || null });
  } catch (err) {
    console.error('Erreur /api/send-report :', err);
    return res.status(500).json({ error: err.message || "Erreur lors de l'envoi de l'email." });
  }
}
