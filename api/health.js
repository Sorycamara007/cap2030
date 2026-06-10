export default function handler(_req, res) {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.ANTHROPIC_API_KEY),
    hasPassword: Boolean(process.env.APP_PASSWORD),
    hasResend: Boolean(process.env.RESEND_API_KEY),
    emailTo: process.env.REPORT_EMAIL_TO || null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
  });
}
