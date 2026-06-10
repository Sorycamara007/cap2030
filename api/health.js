export default function handler(_req, res) {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.ANTHROPIC_API_KEY),
    hasPassword: Boolean(process.env.APP_PASSWORD),
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
  });
}
