#!/usr/bin/env node
// Kaido (I14c, TikTok-Review): kein „Postiz“/„Gitroom“ in den ausgelieferten Next-Dateien.
//
// Läuft im Image-Bau direkt nach `pnpm run build` über apps/frontend/.next (static + server,
// beide gleich, damit Server-Darstellung und Browser dieselben Schlüssel und Texte haben).
// Die Upstream-Quellen bleiben unberührt, der wöchentliche Rebase kollidiert dort nie.
//
//   node tools-kaido/entmarken.mjs <.next-Ordner>            ersetzt und prüft
//   node tools-kaido/entmarken.mjs <.next-Ordner> --pruefen  nur prüfen
//
// Exit 1, wenn unter static/ danach noch ein Treffer /postiz|gitroom/i steht — dann scheitert
// der Bau, statt still eine wiedererkennbare Fassung auszuliefern.
//
// Bewusst NICHT angefasst: Umgebungsvariablen in Großbuchstaben (NEXT_PUBLIC_POSTIZ_…,
// POSTIZ_GENERIC_OAUTH) und die Pfade der Dateien in public/ — beide stehen nur im Server-Teil.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FORK = 'https://github.com/hagelitservices/kaido-publish-app';
const SEITE = 'https://publish.kaidostudios.de';
const ENDUNGEN = /\.(js|mjs|cjs|html|rsc|body|json|txt)$/;
const MUSTER = /postiz|gitroom/i;

// Platzhalter für Stellen, die stehen bleiben müssen.
const SCHUTZ = [
  /\b[A-Z0-9_]*POSTIZ[A-Z0-9_]*\b(?<!\bPOSTIZ_API_KEY)/g, // Umgebungsvariablen
  /\/postiz(?:-fav|-text)?\.(?:svg|png)\b/g, // Dateien in public/
];

const REGELN = [
  // Quelltext-Links (AGPL) auf den eigenen Fork
  [/https?:\/\/github\.com\/gitroomhq\/(?:postiz-app|Kaido Publish-app|postiz-agent)\b/g, FORK],
  [/https?:\/\/github\.com\/hagelitservices\/postiz-app\b/g, FORK],
  [/\bgitroomhq\/(?:postiz-agent|postiz-app)\b/g, 'hagelitservices/kaido-publish-app'],
  // Alle übrigen Adressen mit Postiz/Gitroom → Produktseite
  [/https?:\/\/[^\s"'`\\)<>]*(?:postiz|gitroom)[^\s"'`\\)<>]*/gi, SEITE],
  [/\b(?:[a-z0-9-]+\.)*(?:postiz|gitroom)\.(?:com|pro|io)\b/gi, 'publish.kaidostudios.de'],
  [/\bpostiz:\/\//g, 'kaidopublish://'],
  [/\bPOSTIZ_API_KEY\b/g, 'KAIDO_API_KEY'],
  [/MyPostizAgent/g, 'MyKaidoAgent'],
  // Schlüssel in snake_case (Übersetzungen, Tariftabelle) — überall gleich umbenannt
  [/(?<=[a-z0-9_])postiz|postiz(?=_)/g, 'kaido'],
  [/(?<=[a-z0-9_])gitroom|gitroom(?=_)/g, 'kaido'],
  // Sichtbare Namen
  [/\bPostiz\b/g, 'Kaido Publish'],
  [/\bGitroom\b/g, 'Kaido Studios'],
  [/\bgitroom\b/g, 'kaido_studios'],
  [/\bpostiz\b/g, 'kaido'],
];

function* dateien(ordner) {
  for (const name of readdirSync(ordner)) {
    const pfad = join(ordner, name);
    const st = statSync(pfad);
    if (st.isDirectory()) {
      if (name !== 'cache') yield* dateien(pfad);
    } else if (ENDUNGEN.test(name)) {
      yield pfad;
    }
  }
}

function entmarken(text) {
  const gesichert = [];
  for (const re of SCHUTZ) {
    text = text.replace(re, (m) => `\u0000${gesichert.push(m) - 1}\u0000`);
  }
  for (const [re, ersatz] of REGELN) text = text.replace(re, ersatz);
  return text.replace(/\u0000(\d+)\u0000/g, (_, i) => gesichert[Number(i)]);
}

const [ordner, ...rest] = process.argv.slice(2);
if (!ordner) {
  console.error('Aufruf: entmarken.mjs <.next-Ordner> [--pruefen]');
  process.exit(2);
}
const pruefen = rest.includes('--pruefen');
let geaendert = 0;
const reste = [];
for (const teil of ['static', 'server']) {
  let wurzel;
  try {
    wurzel = statSync(join(ordner, teil)).isDirectory() ? join(ordner, teil) : null;
  } catch {
    wurzel = null;
  }
  if (!wurzel) continue;
  for (const pfad of dateien(wurzel)) {
    const alt = readFileSync(pfad, 'utf8');
    if (!MUSTER.test(alt)) continue;
    const neu = pruefen ? alt : entmarken(alt);
    if (neu !== alt) {
      writeFileSync(pfad, neu);
      geaendert++;
    }
    if (teil === 'static' && MUSTER.test(neu)) {
      const treffer = [...new Set(neu.match(/.{0,30}(?:postiz|gitroom).{0,30}/gi))].slice(0, 5);
      reste.push(`${pfad}: ${treffer.join(' | ')}`);
    }
  }
}
console.log(`entmarken: ${geaendert} Dateien geändert, ${reste.length} mit Resten unter static/`);
for (const z of reste) console.log('  ' + z);
process.exit(reste.length ? 1 : 0);
