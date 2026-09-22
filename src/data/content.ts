/**
 * Až budeš mít hudbu, vlož soubory do public/audio/
 * a doplň `src` u tracku nebo meditace.
 * Příklad: src: "/audio/calm/hlubina-01.mp3"
 */

export type Mode = "calm" | "energize";
export type Page = "home" | "playlists" | "meditations";

export type Track = {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
  /** Sem později dáš soubor, např. /audio/calm/hlubina-01.mp3 */
  src?: string;
};

export type Playlist = {
  id: string;
  title: string;
  subtitle: string;
  mode: Mode;
  accent: string;
  tracks: Track[];
};

export type Meditation = {
  id: string;
  title: string;
  subtitle: string;
  durationSec: number;
  kind: "dech" | "telo" | "spanek" | "focus";
  /** Sem později dáš nahrávku, např. /audio/meditations/ctyri-dechy.mp3 */
  src?: string;
};

export const playlists: Playlist[] = [
  {
    id: "hlubina",
    title: "Hlubina",
    subtitle: "Pomalé, temné, jako voda pod ledem.",
    mode: "calm",
    accent: "210 40% 58%",
    tracks: [
      { id: "h1", title: "Pod hladinou", artist: "SOS", durationSec: 312 },
      { id: "h2", title: "Ticho mezi vlnami", artist: "SOS", durationSec: 248 },
      { id: "h3", title: "Bez břehu", artist: "SOS", durationSec: 401 },
    ],
  },
  {
    id: "mlha",
    title: "Mlha",
    subtitle: "Měkké hrany. Nic nespěchá.",
    mode: "calm",
    accent: "230 28% 62%",
    tracks: [
      { id: "m1", title: "Ráno bez obrysů", artist: "SOS", durationSec: 276 },
      { id: "m2", title: "Sklo", artist: "SOS", durationSec: 198 },
      { id: "m3", title: "Cesta domů", artist: "SOS", durationSec: 334 },
    ],
  },
  {
    id: "po-desti",
    title: "Po dešti",
    subtitle: "Čerstvý vzduch. Mokré dřevo. Klid.",
    mode: "calm",
    accent: "165 22% 52%",
    tracks: [
      { id: "p1", title: "Okna", artist: "SOS", durationSec: 221 },
      { id: "p2", title: "Listí", artist: "SOS", durationSec: 289 },
    ],
  },
  {
    id: "prazdny-dum",
    title: "Prázdný dům",
    subtitle: "Prostor, ve kterém můžeš dýchat.",
    mode: "calm",
    accent: "250 18% 60%",
    tracks: [
      { id: "d1", title: "Chodba", artist: "SOS", durationSec: 188 },
      { id: "d2", title: "Světlo na podlaze", artist: "SOS", durationSec: 256 },
      { id: "d3", title: "Poslední lustr", artist: "SOS", durationSec: 310 },
    ],
  },
  {
    id: "prvni-svetlo",
    title: "První světlo",
    subtitle: "Teplý start. Bez spěchu, s energií.",
    mode: "energize",
    accent: "38 70% 58%",
    tracks: [
      { id: "s1", title: "Otevři oči", artist: "SOS", durationSec: 204 },
      { id: "s2", title: "Teplo v hrudníku", artist: "SOS", durationSec: 242 },
      { id: "s3", title: "Ven", artist: "SOS", durationSec: 198 },
    ],
  },
  {
    id: "tep",
    title: "Tep",
    subtitle: "Rytmus, který tě nese, neštve.",
    mode: "energize",
    accent: "22 68% 56%",
    tracks: [
      { id: "t1", title: "Krok", artist: "SOS", durationSec: 176 },
      { id: "t2", title: "Tep", artist: "SOS", durationSec: 213 },
      { id: "t3", title: "Výdech vpřed", artist: "SOS", durationSec: 231 },
    ],
  },
  {
    id: "otevrene-okno",
    title: "Otevřené okno",
    subtitle: "Světlo, vzduch, pohyb mysli.",
    mode: "energize",
    accent: "48 55% 58%",
    tracks: [
      { id: "o1", title: "Průvan", artist: "SOS", durationSec: 190 },
      { id: "o2", title: "Město zdálky", artist: "SOS", durationSec: 267 },
    ],
  },
  {
    id: "rovnovaha",
    title: "Rovnováha",
    subtitle: "Jasná hlava. Tělo v pohybu.",
    mode: "energize",
    accent: "28 50% 54%",
    tracks: [
      { id: "r1", title: "Osa", artist: "SOS", durationSec: 225 },
      { id: "r2", title: "Držet směr", artist: "SOS", durationSec: 248 },
      { id: "r3", title: "Bez šumu", artist: "SOS", durationSec: 201 },
    ],
  },
];

export const meditations: Meditation[] = [
  {
    id: "ctyri-dechy",
    title: "Čtyři dechy",
    subtitle: "Krátké ukotvení. Nadechni, drž, pusť.",
    durationSec: 180,
    kind: "dech",
  },
  {
    id: "ukotveni",
    title: "Ukotvení",
    subtitle: "Zpátky do těla. Teď, tady.",
    durationSec: 300,
    kind: "focus",
  },
  {
    id: "telo-krajina",
    title: "Tělo jako krajina",
    subtitle: "Pomalý scan od chodidel po temeno.",
    durationSec: 720,
    kind: "telo",
  },
  {
    id: "rano-bez-spechu",
    title: "Ráno bez spěchu",
    subtitle: "Než sahneš po světě, vrať se k sobě.",
    durationSec: 420,
    kind: "focus",
  },
  {
    id: "slyset-ticho",
    title: "Slyšet ticho",
    subtitle: "Poslech prostoru mezi zvuky.",
    durationSec: 480,
    kind: "dech",
  },
  {
    id: "nez-usnes",
    title: "Než usneš",
    subtitle: "Povol ramena. Zhasni den.",
    durationSec: 900,
    kind: "spanek",
  },
];

export const kindLabel: Record<Meditation["kind"], string> = {
  dech: "Dech",
  telo: "Tělo",
  spanek: "Spánek",
  focus: "Pozornost",
};

/** Jedna skladba pro tlačítka na home (Uklidnit se / Nabudit se). */
export const quickModes: Record<Mode, Playlist> = {
  calm: {
    id: "uklidnit",
    title: "Uklidnit se",
    subtitle: "Pět minut. Hudba, která tě drží v klidu.",
    mode: "calm",
    accent: "210 40% 58%",
    tracks: [
      {
        id: "uklidnit-1",
        title: "Meditace",
        artist: "SOS",
        durationSec: 300,
        src: "/audio/calm/uklidnit.m4a",
      },
    ],
  },
  energize: {
    id: "nabudit",
    title: "Nabudit se",
    subtitle: "Check-in. Dech. Disciplína.",
    mode: "energize",
    accent: "38 70% 58%",
    tracks: [
      {
        id: "nabudit-1",
        title: "Check-in · Dech",
        artist: "SOS",
        durationSec: 300,
        src: "/audio/energize/nabudit.m4a",
      },
    ],
  },
};

export function playlistByMode(mode: Mode) {
  return playlists.filter((p) => p.mode === mode);
}

export function playlistById(id: string) {
  return playlists.find((p) => p.id === id);
}

export function meditationById(id: string) {
  return meditations.find((m) => m.id === id);
}

export function totalDuration(tracks: Track[]) {
  return tracks.reduce((sum, t) => sum + t.durationSec, 0);
}
