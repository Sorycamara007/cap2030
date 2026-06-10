export default function handler(_req, res) {
  res.json({ ok: true, hasKey: Boolean(process.env.ANTHROPIC_API_KEY) });
}
