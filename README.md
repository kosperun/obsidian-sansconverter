# SansConverter for Obsidian

An Obsidian plugin for converting between Sanskrit transliteration encodings. Based on the [SansConverter](https://github.com/kosperun/SansConverter) desktop app.

## Supported Encodings

- **IAST** (International Alphabet of Sanskrit Transliteration)
- **Balaram** (used in many Vaiṣṇava publications, legacy)
- **Harvard-Kyoto** (ASCII-friendly encoding)
- **Velthius** (ASCII-friendly encoding using digraphs)
- **Ukrainian IAST** (Cyrillic-based transliteration)

## Available Conversions

| From | To |
|------|-----|
| Harvard-Kyoto | IAST |
| Harvard-Kyoto | Ukrainian |
| Velthius | IAST |
| Velthius | Ukrainian |
| Balaram (legacy) | IAST |
| Balaram (legacy) | Ukrainian |
| IAST | Balaram (legacy) |
| IAST | Ukrainian |

## Installation

### Manual Installation

1. Download the latest release from the [Releases](../../releases) page
2. Extract the files into your vault's plugins folder: `<vault>/.obsidian/plugins/sanskrit-transliteration/`
3. Reload Obsidian
4. Go to Settings → Community plugins and enable "SansConverter"

### Using BRAT (Beta Reviewers Auto-update Tester)

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) from Community Plugins
2. Open BRAT settings and click "Add Beta plugin"
3. Enter this repository URL: `https://github.com/kosperun/obsidian-sansconverter`
4. Enable the plugin in Community plugins

## Usage

1. Select the text you want to convert
2. Open the command palette (`Cmd/Ctrl + P`)
3. Search for "Convert selection" and choose your desired conversion
4. The selected text will be replaced with the converted version

### Setting Hotkeys

For faster workflow, assign custom hotkeys:

1. Go to Settings → Hotkeys
2. Search for "SansConverter"
3. Assign your preferred key combinations

**Suggested hotkeys:**

- `Cmd/Ctrl + Shift + I` → IAST → Balaram
- `Cmd/Ctrl + Shift + B` → Balaram → IAST
- etc.

## Examples

| Input (Balaram, legacy) | Output (IAST) |
|-------------------------|---------------|
| Kåñëa | Kṛṣṇa |

| Input (Harvard-Kyoto) | Output (IAST) |
|-----------------------|---------------|
| KRSNa | Kṛṣṇa |

| Input (Velthius) | Output (IAST) |
|------------------|---------------|
| K.r.s.na | Kṛṣṇa |

| Input (IAST) | Output (Ukrainian) |
|--------------|-------------------|
| Kṛṣṇa | Кр̣шн̣а |

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

MIT License - see [LICENSE](LICENSE) for details.
