# STUDIO-BRAND-MARKET-RESEARCH-V1 — Worker Result

Work Order: `Artifacts/DirectorDispatch/STUDIO-BRAND-MARKET-RESEARCH-V1/WORK_ORDER.md`
(SHA-256 `ce42b4b8bafe5558397d28cee8d5dcca6c866a638bcf14707909392f098ee286`, verified
with `sha256sum` before starting: match).
Worker: separate Claude Code subagent (research role). Date of research: 2026-11-17.
Status: risk screening and proposal only. **Not legal advice. Nothing was registered,
reserved, filed, bought, downloaded, installed, posted or sent to any person.**
Sources: see `SOURCES.md` in this folder (every URL, access date 2026-11-17). Numbers in
square brackets `[S-nn]` point to that list.

---

## Kurzfassung für den Human (Deutsch)

- **Wichtigste Einschränkung:** Die Netzwerkregeln dieser Sitzung haben alle direkten
  Datenbank- und Seitenabrufe blockiert (Steam-Suche, RDAP für .com/.de/.games/.studio,
  TMview/EUIPO). Geprüft wurde deshalb über eine Websuche (Suchindex, auch gezielt auf
  Steam/itch.io begrenzt) und über Marken-Aggregatoren für die USA. **EUIPO, DPMA,
  offizielles USPTO und alle Domain-Abfragen sind NICHT ERREICHBAR** und müssen vor einer
  Entscheidung noch nachgeholt werden (Liste in Abschnitt 9).
- **Studioname:** Empfehlung **„Sixth Finger Games“** (kein Studio und keine Marke dieses
  Namens gefunden). „Six Fingers“ selbst ist belegt: ein Steam-Horrorspiel „SIX FINGERS“
  (2024), ein itch.io-Entwickler „Six Finger Software“ und eine US-Marke „SIXFINGERS“
  für Papierwaren. Alternative mit Zwergenbezug: **„Six-Fingered Dwarf“**. Bart-Namen
  sind stark besetzt (Graybeard, Red Beard, Ugly Beard, Beard Envy, WeirdBeard …);
  „Braided Beard Games“ ist frei, aber es gibt eine US-Marke „THE BRAIDED BEARD GAME“
  für Bartpflege.
- **KI-Risiko beim Namen „Six Finger“:** Weil beide Spiele generative KI offenlegen, kann
  der Name als Selbstironie, als Anti-KI-Spott oder als Heuchelei gelesen werden. Das
  hängt fast nur von der Kommunikation ab. Empfehlung: offen und selbstironisch
  („wir zeigen unser Werkzeug und zählen die Finger nach“), nie als Anti-KI-Witz.
- **Hearthlands-Titel:** Empfehlung **„Torchwrights“** (keine Kollision gefunden).
  Alternativen **„Oathbraid“** und **„Brandholm“**. Ausgeschieden u. a. Lanternhold
  (Steam-Dorfbauspiel „Lantern Hollow“, Okt. 2026), Firebearers (Aufbauspiel
  „Forebearers“), Emberstead, Emberhold (belegt).
- **Underreign-Titel:** Empfehlung **„Underreign“ behalten** (kein Spiel, keine Marke
  gefunden; Restrisiko: „Reigns“, „Underlords“). Alternativen **„Strataheart“** und
  **„Netherstrata“**. Ausgeschieden: Sunderdeep (zu nah an „UNDERDEEP“, Steam Okt. 2026),
  Undercrown, Underthrone, Deepcrown.
- **„New Retro Games“:** Kein Studio und keine Marke „NEW RETRO“ gefunden, aber „New
  Retro“ ist teilweise besetzt (Publisher Retrovibe „with a New Retro twist“, das
  VR-Spiel „New Retro Arcade: Neon“, Musikmarke NewRetroWave; „NEO RETRO“ ist US-Marke
  in Klasse 9). Empfehlung: als **Slogan und Steam-Kurator** nutzen, nicht als
  Studioname oder Marke. Labels verbreiten sich über Fans, Entwickler, Presse und am
  Ende ein Steam-Tag (Beispiel „Boomer Shooter“).
- **Markt:** Wishlist-Umwandlung erste Woche im Median 0,15× (bei Preis > 10 $ 0,10×);
  vom Brutto bleiben ca. 55–60 %. KI-Offenlegung: 49,9 % der Steam-Neuheiten im Oktober
  2026; offengelegte Spiele bekommen deutlich weniger Reviews. Steam Next Fest 2027:
  22.2.–1.3. (Anmeldung bis 10.1.) und 14.–21.6. (Anmeldung bis 25.4.); Oktober 2027
  ohne Datum.
- **Reihenfolge (Vorschlag):** Titel und Studioname zuerst klären → Hearthlands
  „Demnächst“-Seite so früh wie möglich → Demo aus Akt I → **Next Fest Juni 2027**
  (Ausweichtermin Oktober 2027) → Start (Form nach F-REL-001 offen). Underreign
  danach, mit Store-Seite erst, wenn es nicht mehr nach Greybox aussieht.
- **Publisher:** Selbstverlag als Grundlinie. Wichtig: Hooded Horse (Manor Lords,
  Against the Storm) verbietet generative KI vertraglich und fällt damit für beide
  Spiele aus.

---

## 1. Inputs read (local, read-only)

| Source | What was used |
|---|---|
| Studio `AGENTS.md` | Gate, evidence and report rules |
| Studio `Docs/CONFIRMED_DECISIONS.md` | DEC-013 (downloads), DEC-014 (installs), DEC-025 (no-training), DEC-041 (Underreign originality, Claude Director), DEC-042 (Underreign own content to Meshy, Steam AI disclosure), DEC-043 (Unreal Engine 5) |
| Studio `Projects/Underreign/Docs/GAME_CONCEPT.md` | World, five peoples, Deep Dwarves (UD-32). Section 7 still says Unity; DEC-043 (Unreal 5.8) governs. Not edited. |
| Hearthlands `Wiki/Bereiche/Spielidee-und-USPs.md`, `Release.md`, `Offene-Fragen.md`, `Entscheidungen/HD-48.md`, `HD-57.md`, `Features/Release/F-REL-001.md`, `F-REL-004.md` | Game pitch, ~75 min matches, business goal ~EUR 60k/year (HD-57), Meshy only when necessary (HD-48), title is working title (OD-07; "Hearthlands" already exists on Steam, app 336300), release form open (F-REL-001 / N4-28 / D-R1, recommendation B = staged/Early Access with Act I), D-R3 title before "Coming soon", D-R4 demo from Act I |
| Underreign `Design/Snapshot/OPEN_DECISIONS.md`, `Game/README.md`, `Game/SPIELANLEITUNG.md` | OD-02 title open, OD-06 Meshy + Steam AI disclosure, OD-10 Deep Dwarves must not overlap Hearthlands, Dev-Build 3 (rules 61), mostly greybox |

---

## 2. Method and reachability

- Quick collision screening by web search for each candidate (exact phrase), then for the
  top 3 per category: web search restricted to `store.steampowered.com`, `itch.io`,
  `steamdb.info`, `steamcommunity.com` (this also surfaces Steam developer names shown on
  store pages), plus trademark aggregator search (justia, markinton, trademarkdir,
  gleanmark — secondary copies of USPTO data).
- **Direct access attempts and results (2026-11-17):**
  - `rdap.verisign.com` (.com), `rdap.denic.de` (.de), `rdap.identitydigital.services`
    (.games, .studio), `data.iana.org`: curl → proxy answered **403 to CONNECT**
    (session network policy). WebFetch of `rdap.verisign.com` → **ENOTFOUND** (outside the
    session's allowed domains).
  - `store.steampowered.com/search` via WebFetch → **ENOTFOUND** (not allowed).
  - `www.tmdn.org` (TMview, covers EUIPO and DPMA) via WebFetch → **ENOTFOUND**.
  - After these failures the tool instructed to stop trying further hosts; therefore
    `euipo.europa.eu`, `register.dpma.de`, `tmsearch.uspto.gov`, social sites and itch.io
    search pages were **not attempted directly**. They are reported as NOT REACHABLE with
    this reason. To run them, the hosts must be allowed in the session's network settings,
    or the Human runs them manually.
- Web search results were read as search-engine summaries of the pages, not as full page
  fetches. A "no hit" in a search index is weaker evidence than a database query.

Status legend for the check matrix: **DONE** = checked; **DONE-I** = checked indirectly
via web search index (no direct database/store query); **NR** = NOT REACHABLE (reason in
section 2); **ND** = NOT DONE (reason given).

---

## 3. Studio name

### 3.1 Screening (8 candidates)

| # | Candidate | Quick collision finding | Screening verdict |
|---|---|---|---|
| 1 | **Sixth Finger Games** (or Sixth Finger Studio) | No studio, game or mark "Sixth Finger" found [S-01..S-04, S-60]. Nearby only: Steam game "SIX FINGERS" (horror, WALEED, 2024-11-26) [S-05]; itch.io "Six Finger Software" [S-61] | **Top 3 — recommended** |
| 2 | **Six-Fingered Dwarf** | Nothing found as studio/game [S-06, S-62]. Pop-culture echo: "six-fingered man" (The Princess Bride villain) [S-06] | **Top 3** |
| 3 | **Braided Beard Games** | No studio found [S-07, S-63]. US mark "THE BRAIDED BEARD GAME", serial 87913551, beard-care goods (class 3, not 9/28/41) [S-08] | **Top 3** |
| 4 | Six Fingers Games (Human keyword, baseline) | Steam game "SIX FINGERS" (2024) [S-05]; itch.io "Six Finger Software" [S-61]; US "SIXFINGERS DESIGN" serial 77151231, stationery/illustrations (via aggregator) [S-09] | Medium risk; checked as baseline |
| 5 | Polydactyl Games | Nothing found [S-10] | Clear but medical word, harder to read/spell |
| 6 | Hexadactyl Games | Nothing found [S-11] | Clear but obscure |
| 7 | New Retro Games | No company found; "New Retro" used by Retrovibe ("New Retro twist") [S-12] and the VR game "New Retro Arcade: Neon" [S-13] | Better as tagline/label, see section 6 |
| 8 | Oldbeard / Sixbeard / other beard names | "Oldbeard", "Sixbeard" not found [S-14, S-15], but the beard field is crowded: Graybeard Games (David Brevik), Red Beard Games (Hi-Rez), Ugly Beard Games, Beard Envy, WeirdBeard, Beard Games Studio, Tallbeard, Team Halfbeard [S-07, S-14] | Screened out (crowded, weak distinctiveness) |

### 3.2 Check matrix — studio names

| Check | Sixth Finger Games | Six-Fingered Dwarf | Braided Beard Games | Six Fingers Games (baseline) |
|---|---|---|---|---|
| Steam store titles | DONE-I: no title; nearest "SIX FINGERS" (horror) [S-05, S-60] | DONE-I: none [S-62] | DONE-I: only Dota 2 cosmetic item names [S-63] | DONE-I: title "SIX FINGERS" exists [S-05] |
| Steam developer names | DONE-I: none found | DONE-I: none found | DONE-I: none found | DONE-I: developer of "SIX FINGERS" is "WALEED", not a name clash [S-05] |
| itch.io | DONE-I: none; "Six Finger Fillet" game exists [S-60] | DONE-I: "Six Finger Software" developer exists (close) [S-62] | DONE-I: none (beard art packs only) [S-63] | DONE-I: "Six Finger Software" [S-61] |
| Existing game/studio names | DONE-I: none [S-03, S-04] | DONE-I: none [S-06] | DONE-I: none [S-07] | DONE-I: none named "Six Fingers" studio [S-01] |
| EUIPO (cl. 9/28/41) | NR | NR | NR | NR |
| DPMA (cl. 9/28/41) | NR | NR | NR | NR |
| USPTO (cl. 9/28/41) | NR (official). Secondary: no record found [S-16] | NR (official). Secondary: ND (not searched separately) | NR (official). Secondary: only class-3 beard-care mark [S-08] | NR (official). Secondary: SIXFINGERS DESIGN (paper goods) [S-09] |
| Social handles (X, Instagram, YouTube, TikTok, Bluesky) | ND — platforms not reachable; web index shows no account [S-60] (weak) | ND — same reason | ND — same reason; web index shows only hairstyle hashtag use of "braidedbeard" [S-64] | ND — web index shows no "@sixfingers" game account [S-65] (weak) |
| Domains .com/.de/.games/.studio | NR (RDAP blocked) | NR | NR | NR |

**Assessment (screening only):** Sixth Finger Games has the lowest collision found and keeps
the Human's allusion. Six-Fingered Dwarf is the most distinctive and links both keywords,
but it ties the studio to dwarves (Underreign is not a dwarf game) and echoes a film
villain. Braided Beard Games is clean in games classes but loses the "Six Fingers" idea.

### 3.3 "Six Fingers" and disclosed generative AI — brand risk

Facts:
- The "AI drawing hands" meme (extra fingers) went viral from 2022-06-22 and peaked late
  2022 / early 2023; newer sources say hands are no longer a reliable AI tell [S-17].
- Underreign uses Meshy for main modelling with Steam AI disclosure (OD-06, DEC-042);
  Hearthlands uses Meshy only when absolutely necessary, with case-by-case approval (HD-48)
  and needs a Steam disclosure where used (F-REL-006).
- Player attitudes: GameDiscoverCo survey (~3,800 Steam users, 2026-06-25 to 07-02): ~31 %
  view AI disclosure negatively, 8 % would never buy; ~17 % trust developers on
  audiovisual AI transparency [S-18].
- Commercial signal: Game Oracle analysis of ~10,000 Steam games (Jan–Oct 2025): disclosed
  games got about 53 % fewer reviews than comparable games; among titles with ≥50 reviews,
  77 % vs 83 % positive (later report, Oct 2026) [S-18, S-19].
- Industry stance: Hooded Horse bans generative-AI assets in contracts (reported Jan 2026)
  [S-20].

How the name can read:

| Reading | Trigger | Risk |
|---|---|---|
| Self-irony ("we know the joke, we own it") | Studio says openly that it uses AI tools, shows its process, and fixes the flaws | Low–medium; works with the curious/neutral majority |
| Anti-AI joke | Name used to mock AI art while the games carry an AI disclosure | High: invites "hypocrisy" call-outs once players read the Steam disclosure (44 % read disclosures in detail [S-18]) |
| Hypocrisy | Disclosure discovered later, no prior framing | High, hard to repair |
| Neutral / dwarven lore | Sixth finger reframed as a dwarven smith legend (e.g. the hammer as "the sixth finger") | Low; AI allusion becomes an insider joke |

Framing options (proposal):
- **A — "Count the fingers" honesty (recommended):** a short studio line such as "Made by
  two, with tools, checked by hand" and a public "How we make it" page that names the AI
  tools and what a human changed. Effort: low (one page, consistent Steam disclosure text).
  Risk: low–medium.
- **B — Lore framing:** the sixth finger is a dwarven craft symbol; the AI joke is never
  stated. Effort: low. Risk: medium (if the AI link is discovered, it can look evasive).
- **C — Avoid:** choose Braided Beard Games. Effort: none. Risk: lowest for AI, but drops a
  keyword the Human chose.

---

## 4. Titles — Hearthlands (working title)

Constraints: DEC-041-style originality (no existing game names or trademarks); "Hearthlands"
exists on Steam (app 336300, city builder, 2017-04-28) [S-21]; title before "Coming soon"
(D-R3). Pitch words used: dwarves, fire claims land, carriers, oaths/oath stones, braids,
highlands.

### 4.1 Screening (10 candidates)

| # | Candidate | Quick collision finding | Verdict |
|---|---|---|---|
| 1 | **Torchwrights** | No game/mark found [S-22, S-23, S-66]; nearest Torchlight series (Runic/Echtra/XD) and TORCHLIGHT marks (cl. 41/42, film production) [S-23] | **Top 3 — recommended** |
| 2 | **Oathbraid** | No game/mark found [S-24, S-67, S-68] | **Top 3** |
| 3 | **Brandholm** | No game/mark found [S-25, S-26, S-69]; reads like "Bornholm" (Danish island) [S-69] | **Top 3** |
| 4 | Kindlemark | No game found [S-27]; but Amazon holds KINDLE marks incl. classes 9/38/41 (US Reg. 3694267, via aggregator) [S-28] | Screened out (well-known mark in class 9/41) |
| 5 | Lanternhold | No exact hit, but Steam village-builder "Lantern Hollow" released 2026-10-29 [S-29]; board game "Lanternfell" [S-30] | Screened out (same genre, similar sound) |
| 6 | Firebearers | Steam city-building survival game "Forebearers" (2019) [S-31] | Screened out (same genre, one letter) |
| 7 | Emberstead | itch.io browser colony-survival game "Emberstead" [S-67]; Steam "EmberStride" [S-67] | Screened out |
| 8 | Emberhold | Several games of this name [S-32] | Screened out |
| 9 | Emberwrights | No exact hit; Steam tower-defense "Emberward" is close [S-33] | Medium, not shortlisted |
| 10 | Oathfire | No exact hit; itch jam "Oath & Fire", Steam "Oathbound" (2025) [S-34] | Medium, not shortlisted |

Also checked and rejected as too close: "Cinder-" names (itch "Cinderhold", "Cinderdelve" —
a dwarf digging game) [S-35]; "Hearthkin" (Hearthstone family association) [S-36].

### 4.2 Check matrix — Hearthlands top 3

| Check | Torchwrights | Oathbraid | Brandholm |
|---|---|---|---|
| Steam store titles | DONE-I: none [S-66] | DONE-I: none [S-67] | DONE-I: none (only Bornholm mods) [S-69] |
| Steam developer names | DONE-I: none | DONE-I: none | DONE-I: none |
| itch.io | DONE-I: none (itch "Torchbound" RPG Maker project is different) [S-37, S-66] | DONE-I: none [S-67] | DONE-I: none |
| Existing game names | DONE-I: none [S-22] | DONE-I: none [S-68] | DONE-I: none [S-25] |
| EUIPO / DPMA (cl. 9/28/41) | NR | NR | NR |
| USPTO | NR (official). Secondary: no TORCHWRIGHT; TORCHLIGHT marks exist [S-23] | NR (official). Secondary: no OATHBRAID [S-24] | NR (official). Secondary: no BRANDHOLM [S-26] |
| Social handles | ND (platforms not reachable) | ND | ND |
| Domains .com/.de/.games/.studio | NR | NR | NR |
| Fit / notes | Says "craftsmen of fire", fits carriers and fire claiming land; English-readable | Ties beards/braids (USP 9) and oath stones (USP 3, Eidsteine) | "Brand" = fire in German/Norse; English players may read "brand" (marketing). Internal overlap: Underreign has a creature "Brand-hound" |

UD-32 note: Oathbraid overlaps the Underreign unit name "Oath-warden" and the Ashen Pact
contract theme; Brandholm overlaps "Brand-hound". These are internal names and can be
changed, but the studio should keep fire/oath vocabulary on Hearthlands and out of
Underreign marketing.

---

## 5. Titles — Underreign (working title)

Constraints: original (DEC-041); Deep Dwarves must not overlap Hearthlands (UD-32, OD-10) —
so no dwarf/hearth/fire words in the title.

### 5.1 Screening (9 candidates)

| # | Candidate | Quick collision finding | Verdict |
|---|---|---|---|
| 1 | **Underreign** (keep) | No game, page or mark found [S-38, S-39, S-40, S-70]; nearby: "Reigns" (Devolver, 2016), Valve "Underlords", "War for the Overworld: Underlord Edition" [S-38] | **Top 3 — recommended** |
| 2 | **Strataheart** | No game/mark found [S-40, S-41, S-71] | **Top 3** |
| 3 | **Netherstrata** | No game found [S-42, S-71]; "Nether" is strongly associated with Minecraft [S-42] | **Top 3** |
| 4 | Sunderdeep | No exact hit, but "UNDERDEEP" (dungeon idle RPG, Steam, 2026-10-29) [S-70] and "Underdeep" (MobyGames) [S-43] | Screened out (too close) |
| 5 | Undercrown | Browser dungeon brawler "Undercrown" (Sept 2026) and itch tabletop game [S-44] | Screened out |
| 6 | Underthrone | "Underground Throne" / Command Throne, a Dungeon Keeper successor [S-45] | Screened out |
| 7 | Deepcrown | itch.io jam game "DeepCrown" [S-46] | Screened out |
| 8 | Hollowreign | itch prototype "Hollow reigns" [S-47] | Screened out |
| 9 | Stratakeep | Nothing found [S-41]; many "Strata" games on itch [S-71] | Clear but weak; not shortlisted |

### 5.2 Check matrix — Underreign top 3

| Check | Underreign | Strataheart | Netherstrata |
|---|---|---|---|
| Steam store titles | DONE-I: none [S-70] | DONE-I: none [S-70, S-71] | DONE-I: none [S-71] |
| Steam developer names | DONE-I: none | DONE-I: none | DONE-I: none |
| itch.io | DONE-I: none [S-39] | DONE-I: none (only "Strata" games) [S-71] | DONE-I: none [S-71] |
| Existing game names | DONE-I: none [S-38] | DONE-I: none [S-41] | DONE-I: none [S-42] |
| EUIPO / DPMA (cl. 9/28/41) | NR | NR | NR |
| USPTO | NR (official). Secondary: no UNDERREIGN; nearby UNDERMIND (live), UNDERLORE (pending) [S-40] | NR (official). Secondary: none [S-40] | NR (official). Secondary: ND |
| Social handles | ND | ND | ND |
| Domains .com/.de/.games/.studio | NR | NR | NR |
| Fit / notes | Already in use internally; says "rule below"; short | "Heart" is the player's core (the Heart); strata are the USP | Strong "layers" signal; Minecraft "Nether" association |

---

## 6. Domains

| Domain set | Candidates | Status |
|---|---|---|
| .com, .de, .games, .studio | sixthfinger(games), sixfingereddwarf, braidedbeard(games), sixfingers(games), torchwrights, oathbraid, brandholm, underreign, strataheart, netherstrata, newretrogames | **NOT REACHABLE** — RDAP endpoints for Verisign (.com), DENIC (.de) and Identity Digital (.games, .studio) refused by the session proxy (403) or not resolvable (ENOTFOUND). No WHOIS was used. |

Weak indication only: web searches for "sixthfinger.com", "sixfingers.com",
"braidedbeard.com", "newretrogames.com" found no indexed site [S-60, S-64, S-65, S-48].
This is **not** evidence of availability. When RDAP is reachable, an RDAP "not found"
is also only an indication, not proof; registration is a separate Human step (not
authorised here).

---

## 7. "New Retro Games" — label analysis

### 7.1 Prior use

| Term | Prior use found | Collision risk |
|---|---|---|
| NewRetroWave | Music website/YouTube channel founded Nov 2011 by a producer known as "Ten", later a label (NRW Records) [S-49] | Low in games classes, but the Human's label would be read as derived from it — intended |
| "New Retro" (games) | Publisher Retrovibe (Warsaw, 2021, with GOG) markets "indie games with a New Retro twist" [S-12]; VR game "New Retro Arcade: Neon" (Digital Cybercherries, Steam, 2016-08-01) [S-13]; itch "New Retro Arcade" [S-48] | Medium: "New Retro" alone is not distinctive; Retrovibe uses the phrase commercially |
| NEO RETRO | US owner "NEO RETRO" holds class-9 marks incl. VECTREX (via aggregator) [S-50]; "neo-retro" used as a movement term since a Game Developer essay [S-51] | High for "Neo-Retro" as a brand |
| "Modern retro" / "retro-modern" | Null Games calls itself a publisher of "modern retro games"; term is informal [S-52] | Medium |
| "Boomer shooter" | Fan/developer joke around Dusk (2018); devs used it in promotion from 2019; now an official Steam tag; Humble uses it [S-53] | Reference case for how labels spread |
| Steam tags | "Retro" and "Old School" are existing user tags [S-54] | A new label would sit next to these |
| "NEW RETRO" mark | No mark found in classes 9/41 via aggregators [S-50]; EUIPO/DPMA NR | Unknown until official check |

Note: "New Retro Games" as words is descriptive (new games in retro style). Descriptive
phrases are usually hard to register as a mark and hard to defend (general trademark
principle; not legal advice).

### 7.2 How such labels spread (evidence)

- Bottom-up: "boomer shooter" started as a joke, was adopted by fans and the Dusk team,
  then used by developers in tweets and press releases from 2019, and was finally adopted
  by Valve as a Steam tag and by Humble for bundles [S-53].
- Steam curators: any non-limited account can run a curator page; it appears in curator
  lists after 10 recommendations; Curator Connect lets developers send keys once a
  "Coming soon" page is public [S-55]. A curator "Dwarves of Gaming" already exists [S-62].
- Third-party Steam events: Valve can enable tools for organisers to build their own sale
  event page after proposal approval; homepage featuring is "exceptional"; 30-day discount
  cooldown still applies [S-56].

### 7.3 Options (proposal)

| Option | What | Effort | Risk |
|---|---|---|---|
| 1. Tagline | "New retro games from [studio]" on capsule/trailer/store "About"; never as a mark | Very low | Low |
| 2. Steam curator "New Retro Games" | Studio-run curator recommending classic-mechanics games with modern tech (Settlers-likes, Keeper-likes, etc.), ≥10 reviews to appear in lists | Low–medium (ongoing curation) | Low; needs a Steam account (Human step, not done here) |
| 3. Themed event "New Retro Week" | Third-party Steam sale/festival page with other devs | High (proposal to Valve, outreach to other devs, cooldown rules) | Medium; requires contact with others (Human-approved step) |
| 4. Studio name "New Retro Games" | Use the label as the company name | Low | Medium–high (descriptive, Retrovibe/"New Retro Arcade" overlap) |

Recommendation: 1 now, 2 when the first "Coming soon" page is public, 3 only after a
release with an audience. Do not choose 4.

---

## 8. Market facts

All numbers with source and date; **E** = estimate (third-party tracker or own calculation).

### 8.1 Settlement / logistics builders (Hearthlands)

| Fact | Value | Source |
|---|---|---|
| Pioneers of Pagonia (Envision, Settlers creator) | >100,000 sales in first 7 days of Early Access (Dec 2023); 1.0 on 2025-12-11 with 30 % launch discount; ~5,100 reviews ~82 % positive (tracker); ~192,000 copies **E** | [S-57] |
| Against the Storm (Eremite / Hooded Horse) | >2 million copies (press release 2026-08-12); 1 million on Steam (Mar 2024) | [S-58] |
| City Builder tag | Still Top 10 of Steam tags by revenue but down 5 places to #7 (2021→2025, GameDiscoverCo) | [S-59] |
| City Builder success rate (blog, mis-tag caveat) | 0.5 % of 397 games reached 1,000 reviews in 2025 vs 2.70 % in 2024 **E** | [S-59] |
| Recent comparables | Town to City 1.0 on 2026-05-26 (No. 1 SteamDB Hot Releases); Lantern Hollow (village builder) 2026-10-29; Tiny Cities (carriers on foot) planned 2026-10-16 | [S-72, S-29] |

### 8.2 Dungeon management (Underreign)

| Fact | Value | Source |
|---|---|---|
| Dungeons 4 (Kalypso, 2023) | ~56,800 Steam copies **E** (tracker, as of 2026-06-24; console/other stores not included); all-time peak 4,498 concurrent (2023-11-12); ~88 % positive of ~3,000 reviews | [S-73] |
| Recent / upcoming Keeper-likes | Masters of Albion (22cans) 2026-04-22; Sintopia 2026-04-16; Dominar Sanctum (UE5) Q4 2026; Malignus Q4 2026; Infamous Keepers early 2027 | [S-45] |
| Competition signal | Several Keeper-inspired titles in 2026–27 = demand exists, but crowded announcement field | [S-45] (interpretation) |

### 8.3 Wishlists, conversion, net revenue

| Fact | Value | Source |
|---|---|---|
| First-week sales per wishlist (2024–25, ≥25k wishlists) | median 0.15×; for price > $10: 0.10× | [S-74] |
| Older survey | median 0.2× first week, average 0.36× | [S-74] |
| Gross to net (VAT, refunds, Valve cut) | ~55–60 % of gross (worked example 57.75 %) **E** | [S-75] |
| Valve revenue share | 30 % up to $10M, 25 % to $50M, 20 % above | [S-75] |
| Steam Direct fee | $100 per app, recoupable after $1,000 adjusted gross | [S-76] |
| Store page timing | "As early as possible" (Zukowski); 6–12+ months before launch (Presskit.gg) | [S-77] |

**HD-57 check (own calculation, E):** goal ~EUR 60,000/year (HD-57). Assumption: price
around EUR 20, blended net per unit after discounts ~EUR 8–10 (55–60 % of a discounted
average; assumption, not sourced). → roughly **6,000–7,500 units per year**. With a
first-week conversion of 0.10× for >$10 games [S-74], 10,000 wishlists ≈ 1,000 first-week
units. The goal therefore needs a launch in the tens of thousands of wishlists plus a long
tail (no reliable long-tail multiplier found in this session).

### 8.4 Steam Next Fest 2027

| Edition | Dates | Registration deadline | Source |
|---|---|---|---|
| February 2027 | 2027-02-22 to 03-01 | 2027-01-10, 11:59 pm PST | [S-78] |
| June 2027 | 2027-06-14 to 06-21 | 2027-04-25, 11:59 pm PDT | [S-78] |
| October 2027 | planned; dates not announced (checked 2026-11-17) | — | [S-78] |

Rules (Feb 2027 page): public store page, public playable demo at festival start, release
after the event; **a game can take part only once** [S-79].

### 8.5 AI-disclosure reception

| Fact | Value | Source |
|---|---|---|
| Share of 2025 Steam releases disclosing gen-AI (as of 2025-07-13) | ~20 %; 7,818 of ~114,126 titles (~7 % of catalogue) | [S-80] |
| Share of Oct 2026 releases | 49.9 % (community tally by Reddit user u/ploz, not Valve); 2026 Jan–Oct average 40.1 %; disclosed games ≈40 % of 2026 releases but ≈12 % of reviews | [S-19] |
| Player survey (2026-06/07) | ~31 % negative, 8 % never buy, 44 % read disclosures in detail | [S-18] |
| Review effect (2025 releases) | ~53 % fewer reviews; 77 % vs 83 % positive (≥50 reviews) | [S-18] |
| Valve rule change Jan 2026 | Behind-the-scenes development tools excluded from disclosure | [S-18] |

Implication: both games must disclose (OD-06/DEC-042; F-REL-006). Visible quality and the
honest framing in 3.3 matter more than the name.

---

## 9. Proposed order (proposal, not a decision)

Respects HD-57 (income goal → earliest viable revenue from the more market-ready game) and
leaves F-REL-001 (full vs staged/Early Access) open.

| Step | Hearthlands | Underreign | Gate |
|---|---|---|---|
| 0 | Run the NOT REACHABLE checks (EUIPO, DPMA, USPTO, RDAP, handles) for the chosen names; optional paid professional clearance | same | Human (network allowlist or manual; any payment needs approval) |
| 1 | Decide studio name and final title (D-R3) | Decide title (OD-02) | Human |
| 2 | Steam "Coming soon" page as early as possible (needs Steamworks account, $100 fee: Human approval, DEC-023) [S-76, S-77] | Wait until key art/capsule no longer greybox | Human |
| 3 | Demo from Act I (D-R4); optional Steam Playtest | Internal playtests continue | — |
| 4 | **Next Fest June 2027** (register by 2027-04-25) if Act I demo is ready; fallback October 2027. Feb 2027 is likely too early (deadline 2027-01-10, page + demo needed) [S-78] | No Next Fest in 2027 unless art is ready; target an edition in 2028 (estimate) | Human |
| 5 | Release form per F-REL-001 (existing recommendation: decide once Act I is playable); launch a few weeks after Next Fest | Announce Underreign's page around Hearthlands' launch to reuse its traffic on the shared developer page (proposal) | Human |
| 6 | Updates (multiplayer, Acts II–III) | Next Fest → launch | Human |

Avoid: both games in the same Next Fest month or launch window; spending the single Next
Fest slot with a weak demo.

---

## 10. Publisher vs self-publishing (facts and trade-offs)

| Topic | Self-publishing | Publisher |
|---|---|---|
| Revenue | ~70 % after Steam's 30 % (before VAT/refunds) [S-81, S-75] | Publisher cut often 30–60 % after platform fees; historic "70/30" norm; pre-recoup developer shares 0/100 to 30/70; one 2020 review of 30 contracts: 42 % paid the developer nothing until full recoup [S-81] |
| Services | Developer does marketing, PR, localisation, QA | Marketing, PR, localisation, QA, sometimes funding [S-81] |
| Control | Full | Shared; contract terms on rights and duration matter more than the headline split [S-81] |
| AI policy fit | No conflict | Some publishers exclude gen-AI: **Hooded Horse** (strategy/city-builder leader: Manor Lords, Against the Storm) bans it contractually [S-20]. Others (EA, Ubisoft) promote AI tools [S-20]. Both games' disclosed AI narrows the publisher pool |
| Risk | Visibility, workload for a two-seat team (HD-53) | Recoup, loss of rights, fit |

No publisher was contacted (forbidden by the Work Order).

---

## 11. Decision questions for the Human (max 8)

1. **Studio name?** Recommendation: **Sixth Finger Games**; alternative Six-Fingered Dwarf.
   Avoid "Six Fingers Games" (Steam title + itch developer + US stationery mark).
2. **How to frame the AI allusion?** Recommendation: **Option A** — open, self-ironic
   "we show our tools" framing; never an anti-AI joke.
3. **Hearthlands final title?** Recommendation: **Torchwrights**; alternatives Oathbraid,
   Brandholm.
4. **Underreign final title?** Recommendation: **keep "Underreign"**; alternative
   Strataheart.
5. **Allow the missing official checks?** Recommendation: yes — allow the hosts
   (EUIPO/TMview, DPMA, USPTO, RDAP servers) for a follow-up order, or run them by hand,
   before any public use; consider a paid professional clearance for the final pair
   (purchase needs separate approval).
6. **"New Retro Games" use?** Recommendation: tagline now, Steam curator once the first
   "Coming soon" page is live; no studio name, no trademark filing.
7. **Order?** Recommendation: Hearthlands first; Next Fest **June 2027** (fallback
   October 2027); Underreign store page only after it leaves greybox. F-REL-001 stays open
   until Act I is playable.
8. **Publisher stance?** Recommendation: self-publish as default; if a publisher is
   considered later, only those that accept disclosed AI (Hooded Horse excluded by its
   policy).

---

## 12. Forbidden-action confirmation

- No account creation, domain registration/reservation, trademark filing, purchase,
  download, installation, contact with people, or public post.
- Search queries contained only candidate names, genre words and public market topics; no
  private Human data or unpublished game details.
- Writes: only this file and `SOURCES.md` in this folder (folder created). No git
  operations; nothing changed in either game repository; `GAME_CONCEPT.md` not edited.
- Capability Knowledge Base query: NOT APPLICABLE (per Work Order).
