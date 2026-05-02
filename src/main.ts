import { Plugin, Editor, Notice } from 'obsidian';

// Character mappings (basic - for Roman-to-Roman conversions)
const BALARAM = [
  "ä", "é", "ü", "ÿ", "è", "å", "ñ", "ì", "ï", "ö", "ò", "ë", "ç", "ù", "à",
  "Ä", "É", "Ü", "Ÿ", "È", "Å", "Ñ", "Ì", "Ï", "Ö", "Ò", "Ë", "Ç", "Ù", "À"
];

const IAST = [
  "ā", "ī", "ū", "ḷ", "ṝ", "ṛ", "ṣ", "ṅ", "ñ", "ṭ", "ḍ", "ṇ", "ś", "ḥ", "ṁ",
  "Ā", "Ī", "Ū", "Ḷ", "Ṝ", "Ṛ", "Ṣ", "Ṅ", "Ñ", "Ṭ", "Ḍ", "Ṇ", "Ś", "Ḥ", "Ṁ"
];

const HK = [
  "A", "I", "U", "lR", "RR", "R", "S", "G", "J", "T", "D", "N", "z", "H", "M",
  "A", "I", "U", "lR", "RR", "R", "S", "G", "J", "T", "D", "N", "z", "H", "M"
];

const VELTHIUS = [
  "aa", "ii", "uu", ".l", ".rr", ".r", ".s", '"n', "~n", ".t", ".d", ".n", '"s', ".h", ".m",
  "AA", "II", "UU", ".L", ".RR", ".R", ".S", '"N', "~N", ".T", ".D", ".N", '"S', ".H", ".M"
];

const VELTHIUS_EXT = [
  "AA", "II", "UU", ".L", ".RR", ".R", '"S', ".S", '"N', "~N", ".T", ".D", ".N", ".H", ".M",
  "A", "B", "C", "J", "J", "D", "E", "G", "H", "I", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U",
  "V", "Y", "aa", "ii", "uu", ".l", ".rr", ".r", '"s', ".s", '"n', "~n", ".t", ".d", ".n", ".h", ".m",
  "a", "b", "c", "j", "d", "e", "g", "h", "i", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "y"
];

// Extended mappings (for conversions involving Ukrainian)
const IAST_EXT = [
  "Ā", "Ī", "Ū", "Ḷ", "Ṝ", "Ṛ", "Ś", "Ṣ", "Ṅ", "Ñ", "Ṭ", "Ḍ", "Ṇ", "Ḥ", "Ṁ", "A", "B", "C",
  "J", "J", "D", "E", "G", "H", "I", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "V",
  "Y", "ā", "ī", "ū", "ḷ", "ṝ", "ṛ", "ś", "ṣ", "ṅ", "ñ", "ṭ", "ḍ", "ṇ", "ḥ", "ṁ", "a", "b",
  "c", "j", "d", "e", "g", "h", "i", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "y"
];

const BALARAM_EXT = [
  "Ä", "É", "Ü", "Ÿ", "È", "Å", "Ç", "Ñ", "Ì", "Ï", "Ö", "Ò", "Ë", "Ù", "À", "A", "B", "C",
  "J", "J", "D", "E", "G", "H", "I", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "V",
  "Y", "ä", "é", "ü", "ÿ", "è", "å", "ç", "ñ", "ì", "ï", "ö", "ò", "ë", "ù", "à", "a", "b",
  "c", "j", "d", "e", "g", "h", "i", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "y"
];

const HK_EXT = [
  "A", "I", "U", "lR", "RR", "R", "z", "S", "G", "J", "T", "D", "N", "H", "M", "a", "b", "c",
  "j", "j", "d", "e", "g", "h", "i", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v",
  "y", "A", "I", "U", "lR", "RR", "R", "z", "S", "G", "J", "T", "D", "N", "H", "M", "a", "b",
  "c", "j", "d", "e", "g", "h", "i", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "y"
];

const UKR = [
  "Ā", "Ī", "Ӯ", "Л̣", "Р̣̄", "Р̣", "Ш́", "Ш", "Н̇", "Н̃", "Т̣", "Д̣", "Н̣", "Х̣", "М̇", "А", "Б", "Ч",
  "Дж", "ДЖ", "Д", "Е", "Ґ", "Х", "І", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "В",
  "Й", "ā", "ī", "ӯ", "л̣", "р̣̄", "р̣", "ш́", "ш", "н̇", "н̃", "т̣", "д̣", "н̣", "х̣", "м̇", "а", "б",
  "ч", "дж", "д", "е", "ґ", "х", "і", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "в", "й"
];

// Aspirated consonant letters for special handling
const ASPIRATED_CYRILLIC = ["к", "ґ", "ч", "ж", "т̣", "д̣", "т", "д", "п", "б"];
const ASPIRATED_ROMAN = ["k", "g", "c", "j", "ṭ", "ḍ", "t", "d", "p", "b"];

enum Encoding {
  IAST = "IAST",
  Balaram = "Balaram",
  HK = "HK",
  Velthius = "Velthius",
  UKR = "Ukrainian"
}

function convertAspiratedCyrillicProperly(str: string): string[] {
  const symbols = [...str];
  for (let i = 0; i < symbols.length - 1; i++) {
    const lower = symbols[i].toLowerCase();
    if (ASPIRATED_CYRILLIC.includes(lower) && symbols[i + 1] === "х") {
      symbols[i + 1] = "г";
    } else if (ASPIRATED_CYRILLIC.includes(lower) && symbols[i + 1] === "Х") {
      symbols[i + 1] = "Г";
    }
    if (ASPIRATED_ROMAN.includes(lower) && symbols[i + 1] === "г") {
      symbols[i + 1] = "h";
    } else if (ASPIRATED_ROMAN.includes(lower) && symbols[i + 1] === "Г") {
      symbols[i + 1] = "H";
    }
  }
  return symbols;
}

function convertJProperly(str: string): string {
  let result = str;
  let pos = 0;
  try {
    while (result.includes("Дж") && pos !== -1) {
      pos = result.indexOf("Дж", pos);
      if (pos !== -1 && pos + 2 < result.length && result[pos + 2] === result[pos + 2].toUpperCase() && result[pos + 2] !== result[pos + 2].toLowerCase()) {
        result = result.slice(0, pos) + "ДЖ" + result.slice(pos + 2);
      }
      pos = result.indexOf("Дж", pos + 1);
    }
  } catch {
    if (result.endsWith("Дж")) {
      result = result.slice(0, -1) + "Ж";
    }
  }
  return result;
}

function convertUkrainian(str: string): string {
  const symbols = convertAspiratedCyrillicProperly(str);
  return symbols.join("");
}

function convert(
  str: string,
  inputChars: string[],
  outputChars: string[],
  inputEnc: Encoding,
  outputEnc: Encoding
): string {
  if (inputEnc === outputEnc) return str;

  // Sort by length descending to handle multi-char sequences first (like "Дж", "lR", "RR")
  const sortedPairs: [string, string][] = inputChars
    .map((char, i) => [char, outputChars[i]] as [string, string])
    .sort((a, b) => b[0].length - a[0].length);

  let result = str;
  const placeholder = "\u0000";
  const replacements: string[] = [];

  for (const [inp, out] of sortedPairs) {
    if (inp && inp !== out && result.includes(inp)) {
      const ph = placeholder + replacements.length + placeholder;
      replacements.push(out);
      result = result.split(inp).join(ph);
    }
  }

  for (let i = 0; i < replacements.length; i++) {
    const ph = placeholder + i + placeholder;
    result = result.split(ph).join(replacements[i]);
  }

  if (inputEnc === Encoding.HK) {
    result = result.toLowerCase();
  }

  if (inputEnc === Encoding.UKR || outputEnc === Encoding.UKR) {
    result = convertUkrainian(result);
  }

  if (result.includes("Дж")) {
    result = convertJProperly(result);
  }

  return result;
}

// Conversion functions
function iastToBalaram(str: string): string {
  return convert(str, IAST, BALARAM, Encoding.IAST, Encoding.Balaram);
}

function iastToUkr(str: string): string {
  return convert(str, IAST_EXT, UKR, Encoding.IAST, Encoding.UKR);
}

function balaramToIast(str: string): string {
  return convert(str, BALARAM, IAST, Encoding.Balaram, Encoding.IAST);
}

function balaramToUkr(str: string): string {
  return convert(str, BALARAM_EXT, UKR, Encoding.Balaram, Encoding.UKR);
}

function hkToIast(str: string): string {
  return convert(str, HK, IAST, Encoding.HK, Encoding.IAST);
}

function hkToUkr(str: string): string {
  return convert(str, HK_EXT, UKR, Encoding.HK, Encoding.UKR);
}

function velthiusToIast(str: string): string {
  return convert(str, VELTHIUS, IAST, Encoding.Velthius, Encoding.IAST);
}

function velthiusToUkr(str: string): string {
  return convert(str, VELTHIUS_EXT, UKR, Encoding.Velthius, Encoding.UKR);
}

function iastToHk(str: string): string {
  return convert(str, IAST_EXT, HK_EXT, Encoding.IAST, Encoding.HK);
}

function ukrToIast(str: string): string {
  return convert(str, UKR, IAST_EXT, Encoding.UKR, Encoding.IAST);
}

export default class SansConverterPlugin extends Plugin {
  onload() {
    // IAST → Balaram
    this.addCommand({
      id: 'iast-to-balaram',
      name: 'Convert selection: IAST → Balaram',
      editorCallback: (editor: Editor) => this.convertSelection(editor, iastToBalaram)
    });

    // IAST → Ukrainian
    this.addCommand({
      id: 'iast-to-ukrainian',
      name: 'Convert selection: IAST → Ukrainian',
      editorCallback: (editor: Editor) => this.convertSelection(editor, iastToUkr)
    });

    // Balaram → IAST
    this.addCommand({
      id: 'balaram-to-iast',
      name: 'Convert selection: Balaram → IAST',
      editorCallback: (editor: Editor) => this.convertSelection(editor, balaramToIast)
    });

    // Balaram → Ukrainian
    this.addCommand({
      id: 'balaram-to-ukrainian',
      name: 'Convert selection: Balaram → Ukrainian',
      editorCallback: (editor: Editor) => this.convertSelection(editor, balaramToUkr)
    });

    // Harvard-Kyoto → IAST
    this.addCommand({
      id: 'hk-to-iast',
      name: 'Convert selection: Harvard-Kyoto → IAST',
      editorCallback: (editor: Editor) => this.convertSelection(editor, hkToIast)
    });

    // Harvard-Kyoto → Ukrainian
    this.addCommand({
      id: 'hk-to-ukrainian',
      name: 'Convert selection: Harvard-Kyoto → Ukrainian',
      editorCallback: (editor: Editor) => this.convertSelection(editor, hkToUkr)
    });

    // Velthius → IAST
    this.addCommand({
      id: 'velthius-to-iast',
      name: 'Convert selection: Velthius → IAST',
      editorCallback: (editor: Editor) => this.convertSelection(editor, velthiusToIast)
    });

    // Velthius → Ukrainian
    this.addCommand({
      id: 'velthius-to-ukrainian',
      name: 'Convert selection: Velthius → Ukrainian',
      editorCallback: (editor: Editor) => this.convertSelection(editor, velthiusToUkr)
    });

    // IAST → Harvard-Kyoto
    this.addCommand({
      id: 'iast-to-hk',
      name: 'Convert selection: IAST → Harvard-Kyoto',
      editorCallback: (editor: Editor) => this.convertSelection(editor, iastToHk)
    });

    // Ukrainian → IAST
    this.addCommand({
      id: 'ukrainian-to-iast',
      name: 'Convert selection: Ukrainian → IAST',
      editorCallback: (editor: Editor) => this.convertSelection(editor, ukrToIast)
    });

  }

  convertSelection(editor: Editor, convertFn: (s: string) => string) {
    const selection = editor.getSelection();
    if (!selection) {
      new Notice('No text selected');
      return;
    }
    const converted = convertFn(selection);
    editor.replaceSelection(converted);
  }

  onunload() {}
}
