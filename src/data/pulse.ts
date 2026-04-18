/**
 * "Just nu i Rom" — kuraterad temporal intelligence.
 * Tre nivåer: stadens rytm, kvarterspuls, ställesnivå.
 * Mock-data v1: vi handskriver en specifik dag som om en lokal kurator skrev appen.
 */

export type PulseLevel = "city" | "neighborhood" | "venue";

export type PulseItem = {
  id: string;
  level: PulseLevel;
  /** Kort etikett, t.ex. "Festdag", "Piazza-spelning", "Kvällens jazzset" */
  kind: string;
  title: string;
  /** Var: kvarter eller specifik plats */
  where: string;
  /** När i dag — fri text, t.ex. "hela dagen", "från 19:00", "21–23" */
  when: string;
  /** Beskrivande text — ska kännas som en lokal som berättar */
  blurb: string;
  /** "Varför det spelar roll för din dag" — kärnan i temporal intelligence */
  whyItMatters: string;
  /** Matchar en eller flera vibes — visas extra prominent när användarens vibe matchar */
  matchesVibes?: ("slow" | "buzzy" | "romantic" | "curious")[];
};

export type PulseDay = {
  /** ISO-datum för demon. Visas som "Torsdag 18 april" osv. */
  date: string;
  /** Veckodag på svenska, redan formaterad */
  weekdayLabel: string;
  dateLabel: string;
  /** Ramberättelsen — en mening om hur dagen känns i Rom */
  headline: string;
  subhead: string;
  items: PulseItem[];
};

export const ROME_PULSE: PulseDay = {
  date: "2026-04-18",
  weekdayLabel: "Torsdag",
  dateLabel: "18 april",
  headline: "Rom är vårtrött och vaken på samma gång.",
  subhead:
    "Tre dagar kvar till stadens födelsedag. Ljuset är längre än det var i går. Något börjar.",
  items: [
    // ── Stadens rytm ────────────────────────────────────────────────
    {
      id: "natale-di-roma-prep",
      level: "city",
      kind: "Stadens rytm",
      title: "Upptakt till Natale di Roma",
      where: "Hela centro",
      when: "21 april (om tre dagar)",
      blurb:
        "Roms 2779-årsdag. Foro Romano öppnar gratis, fackeltåg på Aventino, gladiatorer på Via dei Fori Imperiali. Förberedelserna syns redan — flaggor, scenrigg, en viss förväntan.",
      whyItMatters:
        "Bo kvar till söndag om du kan. Det är en av få dagar då Rom firar sig själv på riktigt — inte för turisterna.",
      matchesVibes: ["curious", "slow"],
    },
    {
      id: "lazio-roma-derby",
      level: "city",
      kind: "Varning",
      title: "Inget derby i kväll — men Lazio spelar i Europa League",
      where: "Stadio Olimpico + barer i Prati",
      when: "Avspark 21:00",
      blurb:
        "Inte derbyt, men tillräckligt för att Prati och Flaminio ska vara fulla av blå tröjor från 18:00. Tunnelbana A blir överfull mellan 19 och 20.",
      whyItMatters:
        "Vill du ha lugn middag — håll dig söder om floden. Vill du känna pulsen — gå till en bar i Prati och beställ en Peroni.",
      matchesVibes: ["buzzy"],
    },
    {
      id: "giovedi-gnocchi",
      level: "city",
      kind: "Tradition",
      title: "Torsdag är gnocchi-dag",
      where: "Romerska trattorior, överallt",
      when: "Lunch och middag",
      blurb:
        "Giovedì gnocchi, venerdì pesce, sabato trippa. Det är en romersk regel som fortfarande gäller på de äkta ställena. Felice a Testaccio, Armando, Da Cesare — alla har gnocchi alla romana i dag.",
      whyItMatters:
        "Beställ inte cacio e pepe i kväll. Beställ gnocchi. Det är vad köket lagat sedan i morse.",
      matchesVibes: ["slow", "curious"],
    },

    // ── Kvarterspuls ────────────────────────────────────────────────
    {
      id: "monti-mercato",
      level: "neighborhood",
      kind: "Kvarterspuls",
      title: "Mercato Monti har öppnat för säsongen",
      where: "Via Leonina, Monti",
      when: "10–20",
      blurb:
        "Vintage, unga designers, vinyl, italienskt hantverk. Andra helgen efter påsk är alltid den bästa — full uppställning, lugnt tempo, säljarna pratar.",
      whyItMatters:
        "Lägg en timme här i eftermiddag i stället för Via del Corso. Det är allt Rom vill att du ska köpa, utan ett enda souvenir-magnet.",
      matchesVibes: ["curious", "slow"],
    },
    {
      id: "pigneto-piazza",
      level: "neighborhood",
      kind: "Kvarterspuls",
      title: "Piazza-spelning på Largo Spartaco",
      where: "Pigneto",
      when: "Från 19:30, spontant",
      blurb:
        "Två killar med dragspel och gitarr drar upp varje torsdag när vädret tillåter. Stornello, lite Lucio Battisti, någon som ropar Sara perché ti amo runt 22. Ingen affisch, ingen entré.",
      whyItMatters:
        "Det här är inte en spelning du hittar på Resident Advisor. Det är därför du åker till Pigneto en torsdag i april.",
      matchesVibes: ["buzzy", "romantic"],
    },
    {
      id: "trastevere-amerikaner",
      level: "neighborhood",
      kind: "Undvik",
      title: "Trastevere är full av studiegrupper i kväll",
      where: "Piazza Santa Maria + omkring",
      when: "Från 20:00",
      blurb:
        "Vårterminens utbytesstudenter har precis upptäckt aperitivo. Det är charmigt en gång. Inte två.",
      whyItMatters:
        "Vill du ha Trastevere-känsla utan trängsel — gå till Piazza San Cosimato i stället. Två kvarter bort, en helt annan stad.",
    },
    {
      id: "testaccio-mercato",
      level: "neighborhood",
      kind: "Kvarterspuls",
      title: "Testaccios saluhall stänger 14:00",
      where: "Mercato di Testaccio",
      when: "07–14",
      blurb:
        "Mordi & Vai gör panino con allesso direkt från grytan. Köa eller missa det. Efter 13:30 börjar de packa ihop.",
      whyItMatters:
        "Lunch under 8 €, bättre än 90 % av middagarna i centro. Du ångrar dig inte.",
      matchesVibes: ["slow", "curious"],
    },

    // ── Ställesnivå ─────────────────────────────────────────────────
    {
      id: "gregorys-jazz",
      level: "venue",
      kind: "Kvällens jazzset",
      title: "Trio italiano på Gregory's",
      where: "Via Gregoriana 54a, vid Spanska trappan",
      when: "Två set: 22:00 och 23:30",
      blurb:
        "Lokal trio, standards och en del Pino Daniele. Mörkt rum, rött ljus, bartendern minns vad du drack förra gången. Ingen entré, en drink-minimum.",
      whyItMatters:
        "Den enda anledningen att vara nära Spanska trappan efter mörkrets inbrott. Alla andra åker hem klockan 20.",
      matchesVibes: ["romantic", "buzzy"],
    },
    {
      id: "enoteca-vinprovning",
      level: "venue",
      kind: "Kväll med tema",
      title: "Lazio-viner med producenten själv",
      where: "Litro, Monteverde",
      when: "19:30, fem viner + småplock",
      blurb:
        "En av Roms bästa naturvinsbarer. I kväll: Damiano Ciolli från Olevano Romano. Cesanese på rätt sätt. 35 € per person, boka via Instagram-DM (ja, så funkar det).",
      whyItMatters:
        "Det här är en av kvällarna man kommer ihåg från en Romresa. Inte Colosseum.",
      matchesVibes: ["curious", "romantic"],
    },
    {
      id: "rooftop-opening",
      level: "venue",
      kind: "Säsongspremiär",
      title: "Hotel Locarnos takbar öppnar i kväll",
      where: "Via della Penna 22, nära Piazza del Popolo",
      when: "Från 18:30",
      blurb:
        "Första kvällen för säsongen. Liberty-stil, vinrankor, utsikt mot Villa Borghese. Negroni 14 €, men du betalar för utsikten och för att vara där den första kvällen.",
      whyItMatters:
        "Premiärkvällar i Rom är värda något. Personalen är pigg, vinerna nya, alla är på humör. Imorgon är det redan rutin.",
      matchesVibes: ["romantic", "slow"],
    },
    {
      id: "santa-maria-concert",
      level: "venue",
      kind: "Liten konsert",
      title: "Stråkkvartett i Santa Maria sopra Minerva",
      where: "Piazza della Minerva",
      when: "20:30, ca 1h",
      blurb:
        "Vivaldi och Respighi, gratis (donation). Den enda gotiska kyrkan i Rom, Berninis elefant utanför. Sätt dig långt bak — akustiken är bättre där.",
      whyItMatters:
        "30 minuter från en perfekt middag i centro. Lägg in det mellan apertivo och bord.",
      matchesVibes: ["curious", "romantic"],
    },
  ],
};
