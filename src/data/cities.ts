import romeImg from "@/assets/city-rome.jpg";
import stockholmImg from "@/assets/city-stockholm.jpg";
import pragueImg from "@/assets/city-prague.jpg";

export type Vibe = "slow" | "buzzy" | "romantic" | "curious";

export type Stop = {
  time: string;
  title: string;
  type: string;
  neighborhood: string;
  blurb: string;
  duration: string;
  tip?: string;
};

export type City = {
  id: "rome" | "stockholm" | "prague";
  name: string;
  country: string;
  tagline: string;
  image: string;
  routes: Record<Vibe, { title: string; subtitle: string; stops: Stop[] }>;
};

export const VIBES: { id: Vibe; label: string; description: string }[] = [
  { id: "slow", label: "Slow & sun-drenched", description: "Långa luncher, inga måsten." },
  { id: "buzzy", label: "Buzzy & local", description: "Där lokalbefolkningen faktiskt hänger." },
  { id: "romantic", label: "Romantic & golden", description: "Magic hour, vin, utsikter." },
  { id: "curious", label: "Curious & cultural", description: "Konst, historia, små museer." },
];

export const CITIES: City[] = [
  {
    id: "rome",
    name: "Rom",
    country: "Italien",
    tagline: "Ockra väggar, espresso vid disken, en kväll som drar ut på tiden.",
    image: romeImg,
    routes: {
      slow: {
        title: "En långsam söndag i Trastevere",
        subtitle: "Inget brådskande. Bara skuggor, bröd och vin.",
        stops: [
          { time: "09:30", title: "Bar San Calisto", type: "Caffè", neighborhood: "Trastevere", blurb: "Cappuccino vid disken, 1.30 €. Ingen wifi, ingen hast.", duration: "20 min", tip: "Stå vid disken — bordsservering kostar dubbelt." },
          { time: "11:00", title: "Orto Botanico", type: "Promenad", neighborhood: "Trastevere", blurb: "Botaniska trädgården. Bambulund, citrusträd, knappt några turister.", duration: "1h" },
          { time: "13:30", title: "Da Enzo al 29", type: "Lunch", neighborhood: "Trastevere", blurb: "Cacio e pepe som det ska smaka. Köa eller boka.", duration: "1h 30 min" },
          { time: "16:00", title: "Fatamorgana", type: "Gelato", neighborhood: "Trastevere", blurb: "Salt karamell med pinjenötter. Ovanliga smaker, bra hantverk.", duration: "15 min" },
          { time: "18:30", title: "Freni e Frizioni", type: "Aperitivo", neighborhood: "Trastevere", blurb: "Negroni på trappan utanför. Folkliv, ljus, en perfekt övergång till kvällen.", duration: "1h" },
        ],
      },
      buzzy: {
        title: "Pigneto efter mörkrets inbrott",
        subtitle: "Bortom Colosseum. Här lever Rom 2026.",
        stops: [
          { time: "18:00", title: "Necci dal 1924", type: "Bar", neighborhood: "Pigneto", blurb: "Pasolinis gamla stamställe. Spritz på trottoaren.", duration: "45 min" },
          { time: "19:30", title: "Mercato Esquilino-promenad", type: "Vandring", neighborhood: "Esquilino", blurb: "Multikulturella kvarter, gatukonst, bagerier.", duration: "1h" },
          { time: "21:00", title: "Mazzo", type: "Middag", neighborhood: "Centocelle", blurb: "Två kockar, åtta bord. Romersk mat, omtolkad.", duration: "2h", tip: "Boka två veckor i förväg." },
          { time: "23:30", title: "Co.So.", type: "Cocktails", neighborhood: "Pigneto", blurb: "Carbonara sour. Ja, på riktigt. Ja, det funkar.", duration: "1h 30 min" },
        ],
      },
      romantic: {
        title: "Golden hour på sju kullar",
        subtitle: "För någon att hålla i handen.",
        stops: [
          { time: "17:00", title: "Giardino degli Aranci", type: "Utsikt", neighborhood: "Aventino", blurb: "Apelsinträdgården. Hela Rom under fötterna, ljuset blir honung.", duration: "45 min" },
          { time: "18:30", title: "Nyckelhålet i Aventino", type: "Hemlighet", neighborhood: "Aventino", blurb: "Titta genom nyckelhålet. Du kommer förstå när du gjort det.", duration: "10 min" },
          { time: "19:30", title: "Pierluigi", type: "Middag", neighborhood: "Centro Storico", blurb: "Skaldjur, vit duk, värd varje euro. Be om bord ute.", duration: "2h" },
          { time: "22:00", title: "Ponte Sisto vid midnatt", type: "Promenad", neighborhood: "Trastevere", blurb: "Bron är tom. Floden är guld. Inget mer behövs.", duration: "30 min" },
        ],
      },
      curious: {
        title: "De små museernas Rom",
        subtitle: "För dig som tröttnat på Vatikanens köer.",
        stops: [
          { time: "10:00", title: "Galleria Doria Pamphilj", type: "Museum", neighborhood: "Centro", blurb: "Privatpalats, Caravaggio och Velázquez. Ljudguiden av prinsen själv.", duration: "1h 30 min" },
          { time: "12:30", title: "Roscioli", type: "Lunch", neighborhood: "Campo de' Fiori", blurb: "Salumeria med matsal. Burrata, ansjovisar, naturvin.", duration: "1h 30 min" },
          { time: "15:00", title: "Centrale Montemartini", type: "Museum", neighborhood: "Ostiense", blurb: "Antika statyer i ett gammalt elkraftverk. Surrealistiskt.", duration: "1h 30 min" },
          { time: "18:00", title: "Libreria Altroquando", type: "Bokhandel", neighborhood: "Centro", blurb: "Konstböcker, vinyl, sällan en turist.", duration: "45 min" },
        ],
      },
    },
  },
  {
    id: "stockholm",
    name: "Stockholm",
    country: "Sverige",
    tagline: "Mellan vatten och sten — en stad som tystnar vackert.",
    image: stockholmImg,
    routes: {
      slow: {
        title: "Söndag på Södermalm",
        subtitle: "Inga ärenden. Bara fika, bok, promenad.",
        stops: [
          { time: "10:00", title: "Drop Coffee", type: "Kaffe", neighborhood: "Södermalm", blurb: "Sveriges bästa specialty. Ljusrostat, exakt.", duration: "30 min" },
          { time: "11:00", title: "Vitabergsparken", type: "Promenad", neighborhood: "Södermalm", blurb: "Sofia kyrka på höjden. Stockholm vid dina fötter.", duration: "1h" },
          { time: "13:00", title: "Petite France", type: "Lunch", neighborhood: "Kungsholmen", blurb: "Galette, sallad, ett glas Sancerre. Som Paris.", duration: "1h 30 min" },
          { time: "16:00", title: "Konsthall C", type: "Konst", neighborhood: "Hökarängen", blurb: "Litet, samtida, gratis. T-bana hit är halva nöjet.", duration: "1h" },
          { time: "18:30", title: "Häktet", type: "Aperitif", neighborhood: "Södermalm", blurb: "Trädgård, lyktor, en negroni. Sommarens hela poäng.", duration: "1h" },
        ],
      },
      buzzy: {
        title: "En SoFo-kväll",
        subtitle: "Där Stockholms 30-åringar äter sent.",
        stops: [
          { time: "17:30", title: "Tjoget", type: "Cocktails", neighborhood: "Hornstull", blurb: "Bästa bartendrarna i stan. Beställ det de rekommenderar.", duration: "1h" },
          { time: "19:00", title: "Adam/Albin", type: "Middag", neighborhood: "Norrmalm", blurb: "Sjurätters tasting. Värt sitt pris. Boka tidigt.", duration: "2h 30 min" },
          { time: "22:00", title: "Folii", type: "Vin", neighborhood: "Vasastan", blurb: "Naturvinsbar med små rätter. Avslappnat, kunnigt.", duration: "1h 30 min" },
          { time: "23:30", title: "Trädgården", type: "Klubb", neighborhood: "Södermalm", blurb: "Bara öppet på sommaren. Värt hela årets väntan.", duration: "öppet" },
        ],
      },
      romantic: {
        title: "Skärgårdens magic hour",
        subtitle: "Stadens vatten gör resten.",
        stops: [
          { time: "16:00", title: "Fjäderholmarna med båt", type: "Båt", neighborhood: "Slussen", blurb: "20 minuter ut. Ingen bil, inget brus, bara vatten.", duration: "1h" },
          { time: "17:30", title: "Rökeriet", type: "Smörgås", neighborhood: "Fjäderholmarna", blurb: "Varmrökt lax, mörkt bröd, Riesling. Klassiker.", duration: "1h 30 min" },
          { time: "20:00", title: "Skinnarviksberget", type: "Utsikt", neighborhood: "Södermalm", blurb: "Stockholms vackraste solnedgång. Ta med en filt.", duration: "1h" },
          { time: "22:00", title: "Pharmarium", type: "Cocktail", neighborhood: "Gamla Stan", blurb: "Apoteksinspirerad bar i en 1500-talsbyggnad.", duration: "1h" },
        ],
      },
      curious: {
        title: "Modernism och makt",
        subtitle: "En dag i 1900-talets Stockholm.",
        stops: [
          { time: "10:00", title: "Skogskyrkogården", type: "Arkitektur", neighborhood: "Enskede", blurb: "Asplunds mästerverk. UNESCO. Stilla, monumentalt.", duration: "1h 30 min" },
          { time: "12:30", title: "Rosendals Trädgård", type: "Lunch", neighborhood: "Djurgården", blurb: "Egenodlat, vedugnsbröd, ute i trädgården.", duration: "1h 30 min" },
          { time: "14:30", title: "Moderna Museet", type: "Museum", neighborhood: "Skeppsholmen", blurb: "Picasso, Duchamp, fantastisk samling. Gratis entré.", duration: "2h" },
          { time: "17:00", title: "Stadsbiblioteket", type: "Arkitektur", neighborhood: "Vasastan", blurb: "Asplunds rotunda. Stå mitt i den. Andas.", duration: "30 min" },
        ],
      },
    },
  },
  {
    id: "prague",
    name: "Prag",
    country: "Tjeckien",
    tagline: "Dimma, spiror, källarbarer som inte finns på Google.",
    image: pragueImg,
    routes: {
      slow: {
        title: "Vinohrady på halvfart",
        subtitle: "Bortom Karlsbron. Här bor Prag faktiskt.",
        stops: [
          { time: "10:00", title: "Kavárna Místo", type: "Kaffe", neighborhood: "Vinohrady", blurb: "Nordic-style café. Eget bageri, lugna stamgäster.", duration: "45 min" },
          { time: "11:30", title: "Riegrovy sady", type: "Park", neighborhood: "Vinohrady", blurb: "Park med utsikt över Pragborgen. Lokalbefolkningens favorit.", duration: "1h" },
          { time: "13:30", title: "Eska", type: "Lunch", neighborhood: "Karlín", blurb: "Modern tjeckisk mat i en gammal fabrik. Surdeg, kål, exakt.", duration: "1h 30 min" },
          { time: "16:00", title: "Café Savoy", type: "Fika", neighborhood: "Malá Strana", blurb: "Belle époque-tak. Beställ větrník — chouxbakelsen.", duration: "1h" },
          { time: "18:30", title: "Vinograf", type: "Vinbar", neighborhood: "Vinohrady", blurb: "Tjeckiskt vin, charkuteri, värdar som vet allt.", duration: "1h 30 min" },
        ],
      },
      buzzy: {
        title: "Žižkov efter klockan tio",
        subtitle: "Fler barer per kvarter än någon annanstans i Europa.",
        stops: [
          { time: "19:00", title: "Lokál Hamburk", type: "Pivnice", neighborhood: "Karlín", blurb: "Tankøl direkt från Plzeň. Knödlar, gulasch, snabb service.", duration: "1h 30 min" },
          { time: "21:00", title: "Bukowski's", type: "Bar", neighborhood: "Žižkov", blurb: "Mörkt, rökigt (lagligt!), bra cocktails. Litterärt.", duration: "1h 30 min" },
          { time: "22:30", title: "Hospoda U Vystřelenýho oka", type: "Hak", neighborhood: "Žižkov", blurb: "Punkbar sedan -90. Billig öl, levande Prag.", duration: "1h 30 min" },
          { time: "00:30", title: "Cross Club", type: "Klubb", neighborhood: "Holešovice", blurb: "Industriell labyrint. Drum'n'bass tills solen går upp.", duration: "öppet" },
        ],
      },
      romantic: {
        title: "Dimma över Vltava",
        subtitle: "Som ett kapitel ur Kundera.",
        stops: [
          { time: "16:30", title: "Petřín-tornet", type: "Utsikt", neighborhood: "Petřín", blurb: "Linbana upp. Hela staden i guld och dimma.", duration: "1h" },
          { time: "18:00", title: "Vrtbovská-trädgården", type: "Trädgård", neighborhood: "Malá Strana", blurb: "Barockterrasser, knappt en själ. Magiskt.", duration: "45 min" },
          { time: "19:30", title: "Field", type: "Middag", neighborhood: "Staré Město", blurb: "Michelin, men mänskligt. Bord vid fönstret om möjligt.", duration: "2h 30 min" },
          { time: "22:30", title: "Hemingway Bar", type: "Cocktails", neighborhood: "Staré Město", blurb: "Absint på rätt sätt. Liten, intim, perfekt.", duration: "1h 30 min" },
        ],
      },
      curious: {
        title: "Kafkas och kubismens stad",
        subtitle: "Konst, böcker, modernism du inte väntar dig.",
        stops: [
          { time: "10:00", title: "Museum Kampa", type: "Museum", neighborhood: "Kampa", blurb: "Tjeckisk modernism. Kupka, Šíma. Ljust och välkurerat.", duration: "1h 30 min" },
          { time: "12:30", title: "Sansho", type: "Lunch", neighborhood: "Petrská", blurb: "Pan-asiatiskt, från en före detta Nobu-kock. Tilliten betalar sig.", duration: "1h 30 min" },
          { time: "14:30", title: "House of the Black Madonna", type: "Arkitektur", neighborhood: "Staré Město", blurb: "Världens enda kubistiska byggnad. Kubistiskt café på första.", duration: "1h" },
          { time: "16:30", title: "DOX Centre", type: "Konsthall", neighborhood: "Holešovice", blurb: "Samtidskonst i en ombyggd fabrik. Zeppelinaren på taket.", duration: "1h 30 min" },
        ],
      },
    },
  },
];
