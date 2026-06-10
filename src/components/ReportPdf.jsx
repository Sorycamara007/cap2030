import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
} from '@react-pdf/renderer'

// Brand palette (mirrors Tailwind config)
const COLORS = {
  navy: '#0A1A2F',
  navySoft: 'rgba(10, 26, 47, 0.85)',
  navyMuted: 'rgba(10, 26, 47, 0.55)',
  navyFaint: 'rgba(10, 26, 47, 0.35)',
  gold: '#B8945F',
  goldSoft: 'rgba(184, 148, 95, 0.12)',
  cream: '#FBF9F4',
  rule: '#E6DFD2',
}

// react-pdf ships Helvetica/Times/Courier built-in.
// We register Inter via Google Fonts CDN for the sans face,
// keep Times-Roman for the serif/display face (no CDN dependency).
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7.woff',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1xL7.woff',
      fontWeight: 700,
    },
  ],
})

// Hyphenation in french content tends to over-aggressively break words;
// disable so words stay intact at line ends.
Font.registerHyphenationCallback((word) => [word])

const PRIORITE_LABEL = { haute: 'Haute', moyenne: 'Moyenne', basse: 'Basse' }
const ECHEANCE = {
  haute: '0 à 3 mois',
  moyenne: '3 à 9 mois',
  basse: '9 à 18 mois',
}
const SCORE_RANGES = [
  { min: 0, max: 40, label: 'Insuffisant' },
  { min: 41, max: 70, label: 'Satisfaisant' },
  { min: 71, max: 100, label: 'Aligné' },
]

const styles = StyleSheet.create({
  page: {
    paddingTop: 72,
    paddingBottom: 64,
    paddingHorizontal: 56,
    fontFamily: 'Inter',
    fontSize: 10.5,
    color: COLORS.navy,
    backgroundColor: COLORS.cream,
    lineHeight: 1.5,
  },

  // Running page header
  pageHeader: {
    position: 'absolute',
    top: 28,
    left: 56,
    right: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.rule,
    fontSize: 8,
    color: COLORS.navyMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },

  // Running page footer (page n / N)
  pageFooter: {
    position: 'absolute',
    bottom: 28,
    left: 56,
    right: 56,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.rule,
    textAlign: 'center',
    fontSize: 8,
    color: COLORS.navyMuted,
    letterSpacing: 0.8,
  },

  // Cover
  coverEyebrow: {
    fontSize: 9,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2.2,
    marginBottom: 18,
    fontWeight: 600,
  },
  coverTitle: {
    fontSize: 36,
    color: COLORS.navy,
    lineHeight: 1.1,
    marginBottom: 18,
    maxWidth: 420,
  },
  goldRule: {
    width: 64,
    height: 2,
    backgroundColor: COLORS.gold,
    marginBottom: 24,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 28,
    marginBottom: 28,
  },
  metaCell: {
    width: '50%',
    marginBottom: 10,
    fontSize: 10,
  },
  metaLabel: { color: COLORS.navyMuted },
  metaValue: { color: COLORS.navy, fontWeight: 600 },
  coverDate: {
    marginTop: 36,
    fontSize: 8,
    color: COLORS.navyMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },

  // Section header (number + eyebrow + title + rule)
  section: {
    marginBottom: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionNumber: {
    fontSize: 16,
    color: COLORS.gold,
    marginRight: 14,
    fontWeight: 700,
  },
  sectionEyebrow: {
    fontSize: 8,
    color: COLORS.navyMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 600,
  },
  sectionTitle: {
    fontSize: 22,
    color: COLORS.navy,
    marginBottom: 10,
    lineHeight: 1.15,
  },
  sectionGoldRule: {
    width: 64,
    height: 2,
    backgroundColor: COLORS.gold,
    marginBottom: 22,
  },

  // Body text
  paragraph: {
    fontSize: 10.5,
    color: COLORS.navySoft,
    lineHeight: 1.6,
    marginBottom: 8,
  },

  // Numbered list item (points forts / axes développement)
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  listNumber: {
    width: 22,
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: 700,
  },
  listBody: {
    flex: 1,
    fontSize: 10.5,
    color: COLORS.navySoft,
    lineHeight: 1.55,
  },

  // Recommendation card
  recCard: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.rule,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  recNumber: {
    width: 22,
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: 700,
  },
  recTitle: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.navy,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  recPriority: {
    fontSize: 8,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: 700,
    marginLeft: 8,
  },
  recMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 22,
    marginTop: 2,
    marginBottom: 6,
  },
  recMetaItem: {
    fontSize: 7.5,
    color: COLORS.navyMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginRight: 14,
  },
  recBody: {
    marginLeft: 22,
    fontSize: 10,
    color: COLORS.navySoft,
    lineHeight: 1.55,
    marginBottom: 6,
  },
  recLink: {
    marginLeft: 22,
    fontSize: 8,
    color: COLORS.gold,
    textDecoration: 'underline',
    letterSpacing: 0.8,
  },

  // Trajectoire (3 colonnes)
  trajWrap: {
    flexDirection: 'row',
    marginTop: 4,
  },
  trajCol: {
    flex: 1,
    paddingRight: 14,
  },
  trajLabel: {
    fontSize: 8,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginBottom: 6,
    fontWeight: 700,
  },
  trajRule: {
    width: 24,
    height: 1,
    backgroundColor: COLORS.gold,
    marginBottom: 10,
  },
  trajText: {
    fontSize: 10,
    color: COLORS.navySoft,
    lineHeight: 1.55,
  },

  // Score
  scoreCenter: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  scoreCircleWrap: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  scoreNumber: {
    fontSize: 60,
    color: COLORS.navy,
    fontWeight: 700,
    lineHeight: 1,
  },
  scoreOver: {
    fontSize: 8,
    color: COLORS.navyMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginTop: 6,
  },
  scoreNiveau: {
    fontSize: 22,
    color: COLORS.navy,
    fontWeight: 700,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  scoreEyebrow: {
    fontSize: 8,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 700,
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreJustification: {
    fontSize: 10.5,
    color: COLORS.navySoft,
    lineHeight: 1.6,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 40,
  },
  legendRow: {
    flexDirection: 'row',
    marginTop: 28,
  },
  legendCell: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderLeftWidth: 2,
    marginRight: 8,
  },
  legendCellLast: { marginRight: 0 },
  legendRange: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  legendLabel: { fontSize: 12, fontWeight: 700 },

  // Plan d'action — table
  tableHead: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1.2,
    borderBottomColor: COLORS.navy,
    marginBottom: 6,
  },
  th: {
    fontSize: 7.5,
    color: COLORS.navyMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.rule,
  },
  colFormation: { flex: 3, paddingRight: 8 },
  colPriority: { flex: 1, paddingRight: 4 },
  colDuration: { flex: 1, paddingRight: 4 },
  colDeadline: { flex: 1 },
  cellTitle: {
    fontSize: 10,
    color: COLORS.navy,
    fontWeight: 700,
    marginBottom: 2,
  },
  cellMeta: {
    fontSize: 7.5,
    color: COLORS.navyFaint,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  cellLink: {
    fontSize: 7,
    color: COLORS.gold,
    textDecoration: 'underline',
    marginTop: 2,
  },
  cellText: { fontSize: 9.5, color: COLORS.navySoft },
  cellPriority: {
    fontSize: 8,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: 700,
  },

  // Signature block
  sigGrid: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 36,
  },
  sigCol: { flex: 1, marginRight: 24 },
  sigColLast: { marginRight: 0 },
  sigLabel: {
    fontSize: 8,
    color: COLORS.navyMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    fontWeight: 700,
    marginBottom: 60,
  },
  sigLine: {
    height: 0.8,
    backgroundColor: COLORS.navyFaint,
    marginBottom: 4,
  },
  sigSub: {
    fontSize: 7.5,
    color: COLORS.navyFaint,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  remiseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  remiseBox: {
    width: 12,
    height: 12,
    borderWidth: 0.8,
    borderColor: COLORS.navy,
    marginRight: 8,
  },
  remiseText: {
    fontSize: 10,
    color: COLORS.navySoft,
  },
  remiseLine: {
    flex: 1,
    borderBottomWidth: 0.6,
    borderBottomColor: COLORS.navyFaint,
    marginLeft: 6,
    height: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 36,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.rule,
    fontSize: 7.5,
    color: COLORS.navyMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
})

function PageHeader({ headerLeft, headerRight }) {
  return (
    <View style={styles.pageHeader} fixed>
      <Text>{headerLeft}</Text>
      <Text>{headerRight}</Text>
    </View>
  )
}

function PageFooter() {
  return (
    <Text
      style={styles.pageFooter}
      fixed
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} / ${totalPages}`
      }
    />
  )
}

function SectionHeader({ number, eyebrow, title }) {
  return (
    <View>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionNumber}>
          {String(number).padStart(2, '0')}
        </Text>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionGoldRule} />
    </View>
  )
}

export default function ReportPdf({ report, profile }) {
  const {
    synthese = '',
    pointsForts = [],
    axesDeveloppement = [],
    recommandationsFormation = [],
    trajectoire2030 = {},
    scoreAlignement = {},
  } = report || {}

  const safeScore = Math.max(
    0,
    Math.min(100, Number(scoreAlignement.score) || 0),
  )
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const headerLeft = 'CAP 2030 · Profession Comptable'
  const headerRight = dateStr

  return (
    <Document title={`Rapport CAP 2030 — ${profile.intitulePoste || 'Profil'}`}>
      {/* Cover */}
      <Page size="A4" style={styles.page}>
        <PageHeader headerLeft={headerLeft} headerRight={headerRight} />
        <View style={{ marginTop: 80 }}>
          <Text style={styles.coverEyebrow}>
            CAP 2030 · Profession Comptable
          </Text>
          <Text style={styles.coverTitle}>Rapport d'analyse de profil</Text>
          <View style={styles.goldRule} />
          <View style={styles.metaGrid}>
            <Text style={styles.metaCell}>
              <Text style={styles.metaLabel}>Poste : </Text>
              <Text style={styles.metaValue}>
                {profile.intitulePoste || '—'}
              </Text>
            </Text>
            <Text style={styles.metaCell}>
              <Text style={styles.metaLabel}>Département : </Text>
              <Text style={styles.metaValue}>
                {profile.departement || '—'}
              </Text>
            </Text>
            <Text style={styles.metaCell}>
              <Text style={styles.metaLabel}>Niveau : </Text>
              <Text style={styles.metaValue}>{profile.niveau || '—'}</Text>
            </Text>
            <Text style={styles.metaCell}>
              <Text style={styles.metaLabel}>Ancienneté : </Text>
              <Text style={styles.metaValue}>
                {profile.anciennete || '—'}
              </Text>
            </Text>
          </View>
          <Text style={styles.coverDate}>Édité le {dateStr}</Text>
        </View>
        <PageFooter />
      </Page>

      {/* Synthèse */}
      <Page size="A4" style={styles.page}>
        <PageHeader headerLeft={headerLeft} headerRight={headerRight} />
        <SectionHeader number={1} eyebrow="Synthèse" title="Synthèse du profil" />
        <Text style={styles.paragraph}>{synthese}</Text>
        <PageFooter />
      </Page>

      {/* Points forts */}
      <Page size="A4" style={styles.page}>
        <PageHeader headerLeft={headerLeft} headerRight={headerRight} />
        <SectionHeader
          number={2}
          eyebrow="Points forts"
          title="Points forts identifiés"
        />
        {pointsForts.map((p, i) => (
          <View key={i} style={styles.listItem} wrap={false}>
            <Text style={styles.listNumber}>
              {String(i + 1).padStart(2, '0')}
            </Text>
            <Text style={styles.listBody}>{p}</Text>
          </View>
        ))}
        <PageFooter />
      </Page>

      {/* Axes de développement */}
      <Page size="A4" style={styles.page}>
        <PageHeader headerLeft={headerLeft} headerRight={headerRight} />
        <SectionHeader
          number={3}
          eyebrow="Développement"
          title="Axes de développement"
        />
        {axesDeveloppement.map((a, i) => (
          <View key={i} style={styles.listItem} wrap={false}>
            <Text style={styles.listNumber}>
              {String(i + 1).padStart(2, '0')}
            </Text>
            <Text style={styles.listBody}>{a}</Text>
          </View>
        ))}
        <PageFooter />
      </Page>

      {/* Recommandations formation */}
      <Page size="A4" style={styles.page}>
        <PageHeader headerLeft={headerLeft} headerRight={headerRight} />
        <SectionHeader
          number={4}
          eyebrow="Formation"
          title="Recommandations formation"
        />
        <Text style={[styles.paragraph, { fontStyle: 'italic', marginBottom: 16 }]}>
          Toutes les formations recommandées proviennent du catalogue officiel
          CFPC (catalogue.cfpc.net), tag « Profession comptable 2030 ».
        </Text>
        {recommandationsFormation.map((r, i) => (
          <View key={i} style={styles.recCard} wrap={false}>
            <View style={styles.recHeader}>
              <Text style={styles.recNumber}>
                {String(i + 1).padStart(2, '0')}
              </Text>
              <Text style={styles.recTitle}>{r.intitule}</Text>
              <Text style={styles.recPriority}>
                {(PRIORITE_LABEL[r.priorite] || r.priorite || '').toString()}
              </Text>
            </View>
            <View style={styles.recMetaRow}>
              {r.rattachement && (
                <Text style={styles.recMetaItem}>Axe · {r.rattachement}</Text>
              )}
              {r.type && <Text style={styles.recMetaItem}>Type · {r.type}</Text>}
              {r.duree && (
                <Text style={styles.recMetaItem}>Durée · {r.duree}</Text>
              )}
              {r.modules && (
                <Text style={styles.recMetaItem}>{r.modules}</Text>
              )}
            </View>
            <Text style={styles.recBody}>{r.justification}</Text>
            {r.url && (
              <Link src={r.url} style={styles.recLink}>
                {r.url.replace(/^https?:\/\//, '')}
              </Link>
            )}
          </View>
        ))}
        <PageFooter />
      </Page>

      {/* Trajectoire 2030 */}
      <Page size="A4" style={styles.page}>
        <PageHeader headerLeft={headerLeft} headerRight={headerRight} />
        <SectionHeader
          number={5}
          eyebrow="Trajectoire"
          title="Trajectoire 2030"
        />
        <View style={styles.trajWrap} wrap={false}>
          {[
            { label: 'Horizon 12 mois', value: trajectoire2030.horizon12mois },
            { label: 'Horizon 3 ans', value: trajectoire2030.horizon3ans },
            { label: 'Horizon 2030', value: trajectoire2030.horizon2030 },
          ].map((h, i) => (
            <View key={i} style={styles.trajCol}>
              <Text style={styles.trajLabel}>{h.label}</Text>
              <View style={styles.trajRule} />
              <Text style={styles.trajText}>{h.value || '—'}</Text>
            </View>
          ))}
        </View>
        <PageFooter />
      </Page>

      {/* Score d'alignement */}
      <Page size="A4" style={styles.page}>
        <PageHeader headerLeft={headerLeft} headerRight={headerRight} />
        <SectionHeader
          number={6}
          eyebrow="Score"
          title="Score d'alignement CAP 2030"
        />
        <View wrap={false}>
          <View style={styles.scoreCenter}>
            <View style={styles.scoreCircleWrap}>
              <Text style={styles.scoreNumber}>{safeScore}</Text>
              <Text style={styles.scoreOver}>/ 100</Text>
            </View>
            <Text style={styles.scoreEyebrow}>Alignement CAP 2030</Text>
            <Text style={styles.scoreNiveau}>
              {scoreAlignement.niveau || '—'}
            </Text>
          </View>
          <Text style={styles.scoreJustification}>
            {scoreAlignement.justification || ''}
          </Text>
          <View style={styles.legendRow}>
            {SCORE_RANGES.map((r, i) => {
              const active = safeScore >= r.min && safeScore <= r.max
              const isLast = i === SCORE_RANGES.length - 1
              return (
                <View
                  key={r.label}
                  style={[
                    styles.legendCell,
                    isLast && styles.legendCellLast,
                    {
                      borderLeftColor: active ? COLORS.gold : COLORS.rule,
                      backgroundColor: active ? COLORS.goldSoft : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.legendRange,
                      { color: active ? COLORS.gold : COLORS.navyMuted },
                    ]}
                  >
                    {r.min}–{r.max}
                  </Text>
                  <Text
                    style={[
                      styles.legendLabel,
                      { color: active ? COLORS.navy : COLORS.navyMuted },
                    ]}
                  >
                    {r.label}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
        <PageFooter />
      </Page>

      {/* Plan d'action */}
      <Page size="A4" style={styles.page}>
        <PageHeader headerLeft={headerLeft} headerRight={headerRight} />
        <SectionHeader
          number={7}
          eyebrow="Plan d'action"
          title="Plan d'action de formation"
        />
        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.colFormation]}>Formation</Text>
          <Text style={[styles.th, styles.colPriority]}>Priorité</Text>
          <Text style={[styles.th, styles.colDuration]}>Durée</Text>
          <Text style={[styles.th, styles.colDeadline]}>Échéance</Text>
        </View>
        {recommandationsFormation.map((r, i) => (
          <View key={i} style={styles.tableRow} wrap={false}>
            <View style={styles.colFormation}>
              <Text style={styles.cellTitle}>{r.intitule}</Text>
              <Text style={styles.cellMeta}>
                {r.rattachement && `Axe · ${r.rattachement}`}
                {r.type && `  ·  ${r.type}`}
              </Text>
              {r.url && (
                <Link src={r.url} style={styles.cellLink}>
                  {r.url.replace(/^https?:\/\//, '')}
                </Link>
              )}
            </View>
            <View style={styles.colPriority}>
              <Text style={styles.cellPriority}>
                {(PRIORITE_LABEL[r.priorite] || r.priorite || '—').toString()}
              </Text>
            </View>
            <View style={styles.colDuration}>
              <Text style={styles.cellText}>{r.duree || '—'}</Text>
            </View>
            <View style={styles.colDeadline}>
              <Text style={styles.cellText}>
                {ECHEANCE[r.priorite] || '—'}
              </Text>
            </View>
          </View>
        ))}
        <PageFooter />
      </Page>

      {/* Validation + signatures + bottom bar */}
      <Page size="A4" style={styles.page}>
        <PageHeader headerLeft={headerLeft} headerRight={headerRight} />
        <SectionHeader number={8} eyebrow="Validation" title="Validation du rapport" />
        <View wrap={false}>
          <View style={styles.sigGrid}>
            <View style={styles.sigCol}>
              <Text style={styles.sigLabel}>Signature RH</Text>
              <View style={styles.sigLine} />
              <Text style={styles.sigSub}>Date · Lieu</Text>
            </View>
            <View style={[styles.sigCol, styles.sigColLast]}>
              <Text style={styles.sigLabel}>Signature Collaborateur</Text>
              <View style={styles.sigLine} />
              <Text style={styles.sigSub}>Date · Lieu</Text>
            </View>
          </View>
          <View style={styles.remiseRow}>
            <View style={styles.remiseBox} />
            <Text style={styles.remiseText}>
              Document remis au collaborateur le :
            </Text>
            <View style={styles.remiseLine} />
          </View>
        </View>
        <View style={styles.bottomBar}>
          <Text>Rapport généré par CAP 2030 Analyzer</Text>
          <Text>cap.professioncomptable2030.fr</Text>
        </View>
        <PageFooter />
      </Page>
    </Document>
  )
}
