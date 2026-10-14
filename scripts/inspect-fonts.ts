import fs from 'node:fs';
import path from 'node:path';

/** Read SFNT metadata without installing fonts or changing the source files. */
export function inspectFont(filePath: string) {
  const font = fs.readFileSync(filePath);
  const tables = new Map<string, number>();
  for (let i = 0; i < font.readUInt16BE(4); i++) {
    const record = 12 + i * 16;
    tables.set(font.toString('ascii', record, record + 4), font.readUInt32BE(record + 8));
  }
  const cmap = tables.get('cmap');
  if (cmap === undefined) throw new Error(`Missing cmap: ${filePath}`);
  const codepoints = new Set<number>();
  for (let i = 0; i < font.readUInt16BE(cmap + 2); i++) {
    const record = cmap + 4 + i * 8;
    const platform = font.readUInt16BE(record);
    const encoding = font.readUInt16BE(record + 2);
    if (platform !== 0 && !(platform === 3 && (encoding === 1 || encoding === 10))) continue;
    const subtable = cmap + font.readUInt32BE(record + 4);
    const format = font.readUInt16BE(subtable);
    if (format === 4) {
      const segments = font.readUInt16BE(subtable + 6) / 2;
      const ends = subtable + 14;
      const starts = ends + segments * 2 + 2;
      const deltas = starts + segments * 2;
      const offsets = deltas + segments * 2;
      for (let j = 0; j < segments; j++) {
        const start = font.readUInt16BE(starts + j * 2);
        const end = font.readUInt16BE(ends + j * 2);
        const delta = font.readInt16BE(deltas + j * 2);
        const offset = font.readUInt16BE(offsets + j * 2);
        for (let cp = start; cp <= end && cp < 0xffff; cp++) {
          let glyph = offset ? font.readUInt16BE(offsets + j * 2 + offset + (cp - start) * 2) : cp;
          if (!offset || glyph) glyph = (glyph + delta) & 0xffff;
          if (glyph) codepoints.add(cp);
        }
      }
    } else if (format === 12) {
      for (let j = 0; j < font.readUInt32BE(subtable + 12); j++) {
        const group = subtable + 16 + j * 12;
        const start = font.readUInt32BE(group);
        const end = font.readUInt32BE(group + 4);
        const glyph = font.readUInt32BE(group + 8);
        for (let cp = start; cp <= end; cp++) {
          if (glyph + cp - start) codepoints.add(cp);
        }
      }
    }
  }
  const specimen = 'मराठी हवामान लवचिकता क्ष ज्ञ श्र त्र क्र प्र ळ ऱ ०१२३४५६७८९';
  const missing = [...new Set([...specimen])].filter(char => !codepoints.has(char.codePointAt(0)!));
  return {
    file: path.relative(process.cwd(), filePath),
    bytes: font.length,
    tables: [...tables.keys()].sort(),
    devanagariCodepoints: [...codepoints].filter(cp => cp >= 0x0900 && cp <= 0x097f).length,
    missingSpecimenCharacters: missing,
    embeddingFlags: tables.has('OS/2') ? font.readUInt16BE(tables.get('OS/2')! + 8) : null
  };
}

if (process.argv[1]?.endsWith('inspect-fonts.ts')) {
  for (const filePath of process.argv.slice(2)) {
    console.log(JSON.stringify(inspectFont(path.resolve(filePath)), null, 2));
  }
}
