import { Resend } from 'resend';

const PRIORITE_LABEL = {
  haute: 'Priorité haute',
  moyenne: 'Priorité moyenne',
  basse: 'Priorité basse',
};

function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate() {
  return new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function buildReportEmailHtml({ profile = {}, report = {} }) {
  const {
    synthese = '',
    pointsForts = [],
    axesDeveloppement = [],
    recommandationsFormation = [],
    trajectoire2030 = {},
    scoreAlignement = {},
  } = report;

  const navy = '#0A1A2F';
  const gold = '#B8945F';
  const cream = '#FBF9F4';
  const rule = '#E5DFD3';
  const muted = '#5C6878';

  const sectionTitle = (n, eyebrow, title) => `
    <tr><td style="padding-top:32px;padding-bottom:8px;border-top:1px solid ${rule};">
      <div style="font-family:Georgia,'Times New Roman',serif;color:${gold};font-size:20px;font-weight:600;line-height:1;display:inline-block;margin-right:14px;">${String(n).padStart(2, '0')}</div>
      <div style="display:inline-block;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${muted};font-weight:600;">${esc(eyebrow)}</div>
      <h2 style="font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:22px;line-height:1.2;margin:14px 0 12px 0;font-weight:500;">${esc(title)}</h2>
      <div style="width:48px;height:2px;background:${gold};margin-bottom:18px;"></div>
    </td></tr>`;

  const bulletList = (items) => `
    <tr><td style="padding-bottom:24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${items
          .map(
            (item, i) => `
        <tr>
          <td valign="top" style="width:30px;padding:6px 0;font-family:Georgia,'Times New Roman',serif;color:${gold};font-size:16px;font-weight:600;">${String(i + 1).padStart(2, '0')}</td>
          <td valign="top" style="padding:6px 0;font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:15px;line-height:1.6;">${esc(item)}</td>
        </tr>`
          )
          .join('')}
      </table>
    </td></tr>`;

  const reco = (recommandationsFormation || [])
    .map(
      (r, i) => `
    <tr><td style="padding-bottom:22px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td valign="top" style="width:40px;font-family:Georgia,'Times New Roman',serif;color:${gold};font-size:18px;font-weight:600;padding-top:2px;">${String(i + 1).padStart(2, '0')}</td>
          <td valign="top">
            <div style="font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:17px;font-weight:500;margin-bottom:4px;">${esc(r.intitule || '')}</div>
            <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${gold};font-weight:700;margin-bottom:6px;">${esc(PRIORITE_LABEL[r.priorite] || r.priorite || '')}</div>
            ${
              r.rattachement || r.duree
                ? `<div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${muted};margin-bottom:8px;">
                ${r.rattachement ? `Axe · ${esc(r.rattachement)}` : ''}${r.rattachement && r.duree ? ' &nbsp;·&nbsp; ' : ''}${r.duree ? `Durée · ${esc(r.duree)}` : ''}
              </div>`
                : ''
            }
            <div style="font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:14px;line-height:1.6;">${esc(r.justification || '')}</div>
          </td>
        </tr>
      </table>
    </td></tr>`
    )
    .join('');

  const traj = `
    <tr><td style="padding-bottom:24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${[
          { label: 'Horizon 12 mois', value: trajectoire2030.horizon12mois },
          { label: 'Horizon 3 ans', value: trajectoire2030.horizon3ans },
          { label: 'Horizon 2030', value: trajectoire2030.horizon2030 },
        ]
          .map(
            (h) => `
        <tr><td style="padding:10px 0;">
          <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${gold};font-weight:700;margin-bottom:6px;">${esc(h.label)}</div>
          <div style="width:32px;height:1px;background:${rule};margin-bottom:8px;"></div>
          <div style="font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:14px;line-height:1.6;">${esc(h.value || '')}</div>
        </td></tr>`
          )
          .join('')}
      </table>
    </td></tr>`;

  const score = `
    <tr><td style="padding-bottom:24px;">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-family:Georgia,'Times New Roman',serif;color:${gold};font-size:56px;font-weight:600;line-height:1;padding-right:18px;">${esc(scoreAlignement.score ?? '—')}<span style="color:${muted};font-size:22px;">/100</span></td>
          <td valign="middle">
            <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${muted};font-weight:600;margin-bottom:4px;">Niveau</div>
            <div style="font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:18px;font-weight:500;">${esc(scoreAlignement.niveau || '—')}</div>
          </td>
        </tr>
      </table>
      <div style="margin-top:14px;font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:14px;line-height:1.6;">${esc(scoreAlignement.justification || '')}</div>
    </td></tr>`;

  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rapport CAP 2030</title></head>
<body style="margin:0;padding:0;background:${cream};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${cream};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:${cream};">

        <tr><td style="padding-bottom:24px;">
          <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${gold};font-weight:700;margin-bottom:10px;">CAP 2030 · Profession comptable</div>
          <h1 style="font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:32px;line-height:1.1;margin:0 0 14px 0;font-weight:500;">Rapport d'analyse de profil</h1>
          <div style="width:48px;height:2px;background:${gold};margin-bottom:18px;"></div>
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:4px 24px 4px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:${navy};">
                <span style="color:${muted};">Poste : </span>${esc(profile.intitulePoste || '—')}
              </td>
              <td style="padding:4px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:${navy};">
                <span style="color:${muted};">Département : </span>${esc(profile.departement || '—')}
              </td>
            </tr>
            <tr>
              <td style="padding:4px 24px 4px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:${navy};">
                <span style="color:${muted};">Niveau : </span>${esc(profile.niveau || '—')}
              </td>
              <td style="padding:4px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:${navy};">
                <span style="color:${muted};">Ancienneté : </span>${esc(profile.anciennete || '—')}
              </td>
            </tr>
          </table>
          <div style="margin-top:14px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${muted};">Édité le ${formatDate()}</div>
        </td></tr>

        <tr><td style="padding:16px 0 8px 0;border-top:1px solid ${rule};">
          <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${muted};font-weight:600;margin-bottom:6px;">Profil saisi</div>
          ${
            profile.missions
              ? `<div style="font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:14px;line-height:1.6;margin-bottom:8px;"><span style="color:${muted};">Missions : </span>${esc(profile.missions)}</div>`
              : ''
          }
          ${
            profile.competences
              ? `<div style="font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:14px;line-height:1.6;"><span style="color:${muted};">Compétences : </span>${esc(profile.competences)}</div>`
              : ''
          }
        </td></tr>

        ${sectionTitle(1, 'Synthèse', 'Synthèse du profil')}
        <tr><td style="padding-bottom:8px;font-family:Georgia,'Times New Roman',serif;color:${navy};font-size:16px;line-height:1.7;">${esc(synthese)}</td></tr>

        ${sectionTitle(2, 'Points forts', 'Points forts identifiés')}
        ${bulletList(pointsForts)}

        ${sectionTitle(3, 'Développement', 'Axes de développement')}
        ${bulletList(axesDeveloppement)}

        ${sectionTitle(4, 'Formation', 'Recommandations formation')}
        <tr><td>${reco ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">${reco}</table>` : ''}</td></tr>

        ${sectionTitle(5, 'Trajectoire', 'Trajectoire 2030')}
        ${traj}

        ${sectionTitle(6, 'Score', "Score d'alignement CAP 2030")}
        ${score}

        <tr><td style="padding-top:24px;border-top:1px solid ${rule};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${muted};">
          Rapport généré par CAP 2030 Analyzer · Référentiel : cap.professioncomptable2030.fr
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildReportEmailText({ profile = {}, report = {} }) {
  const {
    synthese = '',
    pointsForts = [],
    axesDeveloppement = [],
    recommandationsFormation = [],
    trajectoire2030 = {},
    scoreAlignement = {},
  } = report;

  const lines = [];
  lines.push('CAP 2030 — Rapport d\'analyse de profil');
  lines.push('=========================================');
  lines.push('');
  lines.push(`Poste       : ${profile.intitulePoste || '—'}`);
  lines.push(`Département : ${profile.departement || '—'}`);
  lines.push(`Niveau      : ${profile.niveau || '—'}`);
  lines.push(`Ancienneté  : ${profile.anciennete || '—'}`);
  lines.push(`Édité le    : ${formatDate()}`);
  lines.push('');
  if (profile.missions) {
    lines.push('Missions :');
    lines.push(profile.missions);
    lines.push('');
  }
  if (profile.competences) {
    lines.push('Compétences :');
    lines.push(profile.competences);
    lines.push('');
  }

  lines.push('1. SYNTHÈSE');
  lines.push('-----------');
  lines.push(synthese);
  lines.push('');

  lines.push('2. POINTS FORTS');
  lines.push('---------------');
  pointsForts.forEach((p, i) => lines.push(`${String(i + 1).padStart(2, '0')}. ${p}`));
  lines.push('');

  lines.push('3. AXES DE DÉVELOPPEMENT');
  lines.push('------------------------');
  axesDeveloppement.forEach((a, i) => lines.push(`${String(i + 1).padStart(2, '0')}. ${a}`));
  lines.push('');

  lines.push('4. RECOMMANDATIONS FORMATION');
  lines.push('----------------------------');
  recommandationsFormation.forEach((r, i) => {
    lines.push(`${String(i + 1).padStart(2, '0')}. ${r.intitule || ''} [${PRIORITE_LABEL[r.priorite] || r.priorite || ''}]`);
    if (r.rattachement) lines.push(`    Axe : ${r.rattachement}`);
    if (r.duree) lines.push(`    Durée : ${r.duree}`);
    if (r.justification) lines.push(`    ${r.justification}`);
    lines.push('');
  });

  lines.push('5. TRAJECTOIRE 2030');
  lines.push('-------------------');
  lines.push(`Horizon 12 mois : ${trajectoire2030.horizon12mois || '—'}`);
  lines.push(`Horizon 3 ans   : ${trajectoire2030.horizon3ans || '—'}`);
  lines.push(`Horizon 2030    : ${trajectoire2030.horizon2030 || '—'}`);
  lines.push('');

  lines.push('6. SCORE D\'ALIGNEMENT CAP 2030');
  lines.push('-------------------------------');
  lines.push(`Score : ${scoreAlignement.score ?? '—'}/100`);
  lines.push(`Niveau : ${scoreAlignement.niveau || '—'}`);
  if (scoreAlignement.justification) {
    lines.push('');
    lines.push(scoreAlignement.justification);
  }
  lines.push('');
  lines.push('— Référentiel : cap.professioncomptable2030.fr');

  return lines.join('\n');
}

export async function sendReportEmail({ profile, report, apiKey, to, from }) {
  if (!apiKey) throw new Error('RESEND_API_KEY non configurée');
  if (!to) throw new Error('REPORT_EMAIL_TO non configurée');

  const resend = new Resend(apiKey);

  const subject = `CAP 2030 — Rapport ${profile?.intitulePoste || 'profil'} (${formatDate()})`;
  const html = buildReportEmailHtml({ profile, report });
  const text = buildReportEmailText({ profile, report });

  const { data, error } = await resend.emails.send({
    from: from || 'CAP 2030 <onboarding@resend.dev>',
    to: [to],
    subject,
    html,
    text,
  });

  if (error) {
    const msg = error.message || error.error || JSON.stringify(error);
    throw new Error(`Resend: ${msg}`);
  }

  return data;
}
