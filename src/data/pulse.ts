/**
 * "Just nu i Rom" — kuraterad temporal intelligence per resdag.
 * Tre nivåer: stadens rytm, kvarterspuls, ställesnivå.
 * Mock-data: vi handskriver fem specifika dagar som om en lokal kurator skrev appen.
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
  /** Maskinläsbar starttid HH:mm (lokal tid). Saknas = gäller hela dagen. */
  startsAt?: string;
  /** Maskinläsbar sluttid HH:mm. Saknas = okänt slut. */
  endsAt?: string;
  /** Beskrivande text — ska kännas som en lokal som berättar */
  blurb: string;
  /** "Varför det spelar roll för din dag" — kärnan i temporal intelligence */
  whyItMatters: string;
  /** Matchar en eller flera vibes */
  matchesVibes?: ("slow" | "buzzy" | "romantic" | "curious")[];
};

export type PulseDay = {
  /** ISO-datum (yyyy-mm-dd). */
  date: string;
  /** Veckodag på svenska, redan formaterad */
  weekdayLabel: string;
  dateLabel: string;
  /** Ramberättelsen — en mening om hur dagen känns i Rom */
  headline: string;
  subhead: string;
  items: PulseItem[];
};

export const ROME_PULSE_DAYS: PulseDay[] = [
  // ── Dag 1 ─ Torsdag 18 april ──────────────────────────────────────
  {
    date: "2026-04-18",
    weekdayLabel: "Torsdag",
    dateLabel: "18 april",
    headline: "Rom är vårtrött och vaken på samma gång.",
    subhead:
      "Tre dagar kvar till stadens födelsedag. Ljuset är längre än det var i går. Något börjar.",
    items: [
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
        startsAt: "21:00",
        endsAt: "23:00",
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
      {
        id: "monti-mercato",
        level: "neighborhood",
        kind: "Kvarterspuls",
        title: "Mercato Monti har öppnat för säsongen",
        where: "Via Leonina, Monti",
        when: "10–20",
        startsAt: "10:00",
        endsAt: "20:00",
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
        startsAt: "19:30",
        endsAt: "23:00",
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
        startsAt: "20:00",
        endsAt: "23:30",
        blurb:
          "Vårterminens utbytesstudenter har precis upptäckt aperitivo. Det är charmigt en gång. Inte två.",
        whyItMatters:
          "Vill du ha Trastevere-känsla utan trängsel — gå till Piazza San Cosimato i stället. Två kvarter bort, en helt annan stad.",
      },
      {
        id: "gregorys-jazz",
        level: "venue",
        kind: "Kvällens jazzset",
        title: "Trio italiano på Gregory's",
        where: "Via Gregoriana 54a, vid Spanska trappan",
        when: "Två set: 22:00 och 23:30",
        startsAt: "22:00",
        endsAt: "00:30",
        blurb:
          "Lokal trio, standards och en del Pino Daniele. Mörkt rum, rött ljus, bartendern minns vad du drack förra gången. Ingen entré, en drink-minimum.",
        whyItMatters:
          "Den enda anledningen att vara nära Spanska trappan efter mörkrets inbrott. Alla andra åker hem klockan 20.",
        matchesVibes: ["romantic", "buzzy"],
      },
      {
        id: "rooftop-opening",
        level: "venue",
        kind: "Säsongspremiär",
        title: "Hotel Locarnos takbar öppnar i kväll",
        where: "Via della Penna 22, nära Piazza del Popolo",
        when: "Från 18:30",
        startsAt: "18:30",
        endsAt: "01:00",
        blurb:
          "Första kvällen för säsongen. Liberty-stil, vinrankor, utsikt mot Villa Borghese. Negroni 14 €, men du betalar för utsikten och för att vara där den första kvällen.",
        whyItMatters:
          "Premiärkvällar i Rom är värda något. Personalen är pigg, vinerna nya, alla är på humör. Imorgon är det redan rutin.",
        matchesVibes: ["romantic", "slow"],
      },
    ],
  },

  // ── Dag 2 ─ Fredag 19 april ──────────────────────────────────────
  {
    date: "2026-04-19",
    weekdayLabel: "Fredag",
    dateLabel: "19 april",
    headline: "Fredag, fisk, och en stad som tar helg.",
    subhead:
      "Venerdì pesce. Aperitivopubliken börjar tidigare. Centro fylls — kvarteren tystnar.",
    items: [
      {
        id: "venerdi-pesce",
        level: "city",
        kind: "Tradition",
        title: "Fredag är fiskdag",
        where: "Trattorior i Testaccio, Trastevere, centro",
        when: "Lunch och middag",
        blurb:
          "Fritto misto, spaghetti alle vongole, baccalà. Fredag är dagen då även köttslaktarna i Testaccio gör sin spaghetti con le sarde.",
        whyItMatters:
          "Beställ fisk på en romersk trattoria i kväll — det är dagens specialitet. Da Bucatino i Testaccio är klockrent.",
        matchesVibes: ["slow", "curious"],
      },
      {
        id: "aperitivo-rush",
        level: "city",
        kind: "Stadens rytm",
        title: "Fredagsaperitivon börjar 18:00",
        where: "Hela staden",
        when: "18–21",
        startsAt: "18:00",
        endsAt: "21:00",
        blurb:
          "Romarna jobbar långa dagar men tar helg sent. Mellan 18 och 21 är varje bar i centro full. Efter 21:30 lugnar det och man hittar bord.",
        whyItMatters:
          "Vill du sitta — ät tidigt eller sent. Däremellan står man.",
      },
      {
        id: "campo-marknad",
        level: "neighborhood",
        kind: "Kvarterspuls",
        title: "Campo de' Fiori-marknaden packas tidigt",
        where: "Campo de' Fiori, Centro",
        when: "07–13:30",
        startsAt: "07:00",
        endsAt: "13:30",
        blurb:
          "Fredagsmarknaden är störst i veckan. Blommor, kronärtskockor, första körsbären om vädret hållit. Lugnast 09–10:30.",
        whyItMatters:
          "Ta en cappuccino på Forno Campo de' Fiori och titta. Det är en av de mest fotograferade scenerna i Rom — och fortfarande sann.",
        matchesVibes: ["slow", "curious"],
      },
      {
        id: "testaccio-club",
        level: "neighborhood",
        kind: "Kvarterspuls",
        title: "Testaccio går igång efter midnatt",
        where: "Via di Monte Testaccio",
        when: "Från 23:30",
        startsAt: "23:30",
        endsAt: "04:00",
        blurb:
          "Hela kullen är klubbar och livescener. På fredagar drar Goa och Akab fullt. 20€-25€ entré, fri innan midnatt på vissa.",
        whyItMatters:
          "Den enda klubbnatten där taxin hem är billigare än drinken inne.",
        matchesVibes: ["buzzy"],
      },
      {
        id: "ostiense-streetart",
        level: "neighborhood",
        kind: "Kvarterspuls",
        title: "Streetart-tour i Ostiense kl 17",
        where: "Mötesplats: Garbatella metro",
        when: "17:00–19:00",
        startsAt: "17:00",
        endsAt: "19:00",
        blurb:
          "Lokala konstnärer guidar genom Blu, Sten Lex, JB Rock. Donation-baserat, säg till på Instagram @999contemporary.",
        whyItMatters:
          "En av de bästa sätten att se Rom som inte är från medeltiden. Ostiense är där samtiden händer.",
        matchesVibes: ["curious"],
      },
      {
        id: "pierluigi-fri",
        level: "venue",
        kind: "Boka nu",
        title: "Pierluigi tar bara walk-ins efter 22:30",
        where: "Piazza de' Ricci, Centro",
        when: "Hela kvällen",
        blurb:
          "Klassikern bland fiskställen. På fredagar är de fullbokade redan — men släpper bord från 22:30 om man står utanför.",
        whyItMatters:
          "Ät en sen apertivo på Roscioli och dyk upp 22:15. Det funkar oftare än man tror.",
        matchesVibes: ["romantic"],
      },
    ],
  },

  // ── Dag 3 ─ Lördag 20 april ──────────────────────────────────────
  {
    date: "2026-04-20",
    weekdayLabel: "Lördag",
    dateLabel: "20 april",
    headline: "Lördag före födelsedagen — staden andas in.",
    subhead:
      "Imorgon firar Rom sig själv. I kväll: trippa, vin, och en lugn långpromenad.",
    items: [
      {
        id: "sabato-trippa",
        level: "city",
        kind: "Tradition",
        title: "Sabato trippa",
        where: "Romerska trattorior",
        when: "Lunch",
        blurb:
          "Lördag är trippa-dag. Trippa alla romana med pecorino och mynta. Inte för alla — men det är dagen att prova om du ska prova.",
        whyItMatters:
          "Felice a Testaccio gör den klassiska. Be om ett halvt portion om du tvekar.",
        matchesVibes: ["curious"],
      },
      {
        id: "natale-eve",
        level: "city",
        kind: "Stadens rytm",
        title: "Sista förberedelserna inför Natale di Roma",
        where: "Centro, Aventino, Foro Romano",
        when: "Hela dagen",
        blurb:
          "Scener byggs på Piazza del Campidoglio. Foro Romano stänger redan 16 i dag för rigg. Aventino börjar fyllas.",
        whyItMatters:
          "Vill du till Foro Romano — gör det före lunch. I morgon är det gratis men trångt.",
      },
      {
        id: "monti-mercato-sat",
        level: "neighborhood",
        kind: "Kvarterspuls",
        title: "Mercato Monti — bästa lördagen",
        where: "Via Leonina, Monti",
        when: "10–20",
        startsAt: "10:00",
        endsAt: "20:00",
        blurb:
          "Dubbelt så stort på lördagar. Live-DJ från 16. Lokala designers du inte hittar på nätet.",
        whyItMatters:
          "Bättre shopping än Via Condotti. Annorlunda souvenirer.",
        matchesVibes: ["curious", "slow"],
      },
      {
        id: "trastevere-lugn",
        level: "neighborhood",
        kind: "Kvarterspuls",
        title: "Trastevere — gå västerut",
        where: "Vicolo del Cinque, Piazza San Cosimato",
        when: "Kväll",
        blurb:
          "Östra Trastevere (vid Santa Maria) är fullt. Västra delen — där lokalbefolkningen bor — är fortfarande lugn även en lördagskväll.",
        whyItMatters:
          "Två kvarter ifrån trängseln finns det Trastevere alla letar efter.",
        matchesVibes: ["slow", "romantic"],
      },
      {
        id: "litro-natural",
        level: "venue",
        kind: "Vinprovning",
        title: "Naturvin från Frascati på Litro",
        where: "Monteverde",
        when: "19:00, fyra viner + tilltugg",
        startsAt: "19:00",
        endsAt: "22:00",
        blurb:
          "Frascati Superiore från små producenter. Vit vulkanjord, mineralisk. 30€, boka via DM.",
        whyItMatters:
          "Frascati är inte längre supermarketvinet du minns. Det här är en återuppståndelse.",
        matchesVibes: ["curious", "romantic"],
      },
    ],
  },

  // ── Dag 4 ─ Söndag 21 april ──────────────────────────────────────
  {
    date: "2026-04-21",
    weekdayLabel: "Söndag",
    dateLabel: "21 april",
    headline: "Natale di Roma — staden firar 2779 år.",
    subhead:
      "En av få dagar då Rom firar sig själv på riktigt. Gratis museer, fackeltåg, gladiatorer.",
    items: [
      {
        id: "natale-di-roma-day",
        level: "city",
        kind: "Festdag",
        title: "Natale di Roma — Roms födelsedag",
        where: "Hela centro, höjdpunkt vid Foro Romano och Circo Massimo",
        when: "Hela dagen, fackeltåg 21:00",
        blurb:
          "Foro Romano öppet gratis. Gladiatoroptåg på Via dei Fori Imperiali kl 11. Fackeltåg från Aventino kl 21. Hela centro stängs för bilar.",
        whyItMatters:
          "Det här är dagen. Allt annat går i andra hand. Lägg in en luckaktivitet på morgonen och dyk in i firandet eftermiddag/kväll.",
        matchesVibes: ["curious", "slow", "romantic"],
      },
      {
        id: "no-cars-centro",
        level: "city",
        kind: "Varning",
        title: "Bilfritt centro hela dagen",
        where: "Innanför Aurelianska muren",
        when: "06–24",
        blurb:
          "Tack och lov bilfritt. Men: ingen taxi når dig. Allt blir promenad eller tunnelbana.",
        whyItMatters:
          "Boende i centro? Lämna inte väskor sent. Boende utanför? Räkna med 30+ min till och från.",
      },
      {
        id: "domenica-bellezza",
        level: "city",
        kind: "Tradition",
        title: "Första söndagen i månaden — gratis statliga museer",
        where: "Galleria Borghese, Castel Sant'Angelo, m.fl.",
        when: "Hela dagen",
        blurb:
          "Domenica al museo. Plus Natale di Roma — många statliga museer öppna gratis. Borghese kräver fortfarande bokning.",
        whyItMatters:
          "Två gratis-tillfällen samma dag. Boka Borghese-slot i förväg.",
        matchesVibes: ["curious"],
      },
      {
        id: "aventino-fackel",
        level: "neighborhood",
        kind: "Kvarterspuls",
        title: "Aventino fylls från 19:30",
        where: "Giardino degli Aranci",
        when: "19:30 → 21 (avgång fackeltåg)",
        startsAt: "19:30",
        endsAt: "21:30",
        blurb:
          "Apelsinträdgården och nyckelhålet — vanliga turistmål — är fyllda av romare i dag. Pukor, fanor, en stilla högtid.",
        whyItMatters:
          "Var där 19. Stå längs muren mot Forum. Fotot du tar säger något — inte bara visar.",
        matchesVibes: ["romantic", "curious"],
      },
      {
        id: "circo-massimo-show",
        level: "venue",
        kind: "Föreställning",
        title: "Historisk parad på Circo Massimo",
        where: "Circo Massimo",
        when: "14:00 och 16:00",
        startsAt: "14:00",
        endsAt: "17:30",
        blurb:
          "2000+ skådespelare i romersk dräkt. Senatorer, legioner, vestaler. 70 min, gratis.",
        whyItMatters:
          "Det är kitsch. Det är magnifikt. Det är Rom som tar sig själv på allvar — vilket inte händer ofta.",
        matchesVibes: ["curious"],
      },
    ],
  },

  // ── Dag 5 ─ Måndag 22 april ──────────────────────────────────────
  {
    date: "2026-04-22",
    weekdayLabel: "Måndag",
    dateLabel: "22 april",
    headline: "Måndag — dagen efter. Rom slappnar av.",
    subhead:
      "Många museer stängda. Markander stängda. Men: gatorna är dina, och vädret håller.",
    items: [
      {
        id: "musei-stangda",
        level: "city",
        kind: "Varning",
        title: "Många museer stängda på måndagar",
        where: "Hela staden",
        when: "Hela dagen",
        blurb:
          "Vatikanmuseerna, Galleria Borghese, MAXXI — stängda. Däremot: Centrale Montemartini, Galleria Doria Pamphilj, Museo Nazionale Romano öppna.",
        whyItMatters:
          "Lägg din museidag på en annan dag. I dag — gå, ät, sitt på piazza.",
      },
      {
        id: "lunedi-lugn",
        level: "city",
        kind: "Stadens rytm",
        title: "Centro är fortfarande lugnt efter helgens fest",
        where: "Centro storico",
        when: "Förmiddag",
        blurb:
          "Romarna är trötta. Caféerna öppnar lite senare. Pantheon och Piazza Navona är ovanligt lugna fram till 11.",
        whyItMatters:
          "Bästa morgonen att gå runt monumenten utan trängsel. Var där 09.",
        matchesVibes: ["slow", "romantic"],
      },
      {
        id: "trastevere-tyst",
        level: "neighborhood",
        kind: "Kvarterspuls",
        title: "Trastevere efter helgens festival — tyst som en söndag",
        where: "Trastevere",
        when: "Hela dagen",
        blurb:
          "Många restauranger har riposo. Men Da Enzo, Tonnarello, Spirito DiVino — öppna. Promenadkvarter idag, inte ätkvarter.",
        whyItMatters:
          "Boka middagen — bekräfta dubbelt. Mycket är stängt.",
        matchesVibes: ["slow"],
      },
      {
        id: "pigneto-monday",
        level: "neighborhood",
        kind: "Kvarterspuls",
        title: "Pigneto har sin egen måndagskväll",
        where: "Pigneto",
        when: "Från 21",
        blurb:
          "Necci dal 1924 har akustisk konsert varje måndag. Konstnärer, musiker, kvarterspublik. Ingen entré.",
        whyItMatters:
          "Andra kvarter sover. Pigneto vaknar.",
        matchesVibes: ["buzzy", "romantic"],
      },
      {
        id: "centrale-montemartini",
        level: "venue",
        kind: "Hemligt museum",
        title: "Centrale Montemartini — öppet idag",
        where: "Via Ostiense 106, Ostiense",
        when: "09:30–19",
        blurb:
          "Antika statyer i ett gammalt elkraftverk. Surrealistiskt. En av de få museerna öppna på måndag — och en av Roms bästa.",
        whyItMatters:
          "Om du bara hinner ett museum den här resan — gör det här. Knappt någon turist.",
        matchesVibes: ["curious"],
      },
    ],
  },
];

/** Bakåtkompatibel export — pekar på första dagen. */
export const ROME_PULSE: PulseDay = ROME_PULSE_DAYS[0];

/** Hitta en specifik dag på ISO-datum, eller falla tillbaka till första. */
export function getPulseDay(dateISO: string | undefined): PulseDay {
  if (!dateISO) return ROME_PULSE_DAYS[0];
  return ROME_PULSE_DAYS.find((d) => d.date === dateISO) ?? ROME_PULSE_DAYS[0];
}
