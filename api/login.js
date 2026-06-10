export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  return res.json({ ok: true, token: expected });
}
