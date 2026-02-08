const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../data/QWERTY Francais.json');
const outputFile = path.join(__dirname, 'qwerty-francais.json');

const mapping = {
    // Row E (Number Row)
    'E00': 'Backquote',
    'E01': 'Digit1', 'E02': 'Digit2', 'E03': 'Digit3', 'E04': 'Digit4', 'E05': 'Digit5',
    'E06': 'Digit6', 'E07': 'Digit7', 'E08': 'Digit8', 'E09': 'Digit9', 'E10': 'Digit0',
    'E11': 'Minus', 'E12': 'Equal',
    
    // Row D (Top Letter Row)
    'D01': 'KeyQ', 'D02': 'KeyW', 'D03': 'KeyE', 'D04': 'KeyR', 'D05': 'KeyT',
    'D06': 'KeyY', 'D07': 'KeyU', 'D08': 'KeyI', 'D09': 'KeyO', 'D10': 'KeyP',
    'D11': 'BracketLeft', 'D12': 'BracketRight', 
    'D13': 'Backslash', // Visualizer maps this to Row C, logical D13

    // Row C (Home Row)
    'C01': 'KeyA', 'C02': 'KeyS', 'C03': 'KeyD', 'C04': 'KeyF', 'C05': 'KeyG',
    'C06': 'KeyH', 'C07': 'KeyJ', 'C08': 'KeyK', 'C09': 'KeyL',
    'C10': 'Semicolon', 'C11': 'Quote',
    // C12 (Backslash equivalent in ISO) is NOT in QWERTY JSON (D13 is used instead)

    // Row B (Bottom Row)
    'B00': 'IntlBackslash',
    'B01': 'KeyZ', 'B02': 'KeyX', 'B03': 'KeyC', 'B04': 'KeyV', 'B05': 'KeyB',
    'B06': 'KeyN', 'B07': 'KeyM',
    'B08': 'Comma', 'B09': 'Period', 'B10': 'Slash',
    
    // Row A (Space)
    'A03': 'Space'
};

try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const inputJson = JSON.parse(rawData);
    
    const outputJson = {
        name: "qwerty-francais",
        version: inputJson.version,
        geometry: "ansi", // QWERTY is ANSI based, though we use ISO visualizer keys
        capslock: true,
        altgr: true,
        keymap: {},
        deadkeys: {}
    };

    // Convert Keys
    inputJson.rows.forEach(row => {
        row.keys.forEach(key => {
            const domId = mapping[key.position];
            if (domId) {
                // array: [base, shift, caps, caps_shift, alt_gr, shift_alt_gr, caps_alt_gr, caps_shift_alt_gr]
                const layers = [
                    key.base,
                    key.shift,
                    key.caps,
                    key.caps_shift,
                    key.alt_gr,
                    key.shift_alt_gr,
                    key.caps_alt_gr,
                    key.caps_shift_alt_gr
                ];
                outputJson.keymap[domId] = layers;
            } else {
                console.warn(`Warning: No mapping for position ${key.position}`);
            }
        });
    });

    // Convert Dead Keys
    if (inputJson.dead_keys) {
        Object.entries(inputJson.dead_keys).forEach(([name, data]) => {
            if (data.table) {
                outputJson.deadkeys[name] = data.table;
            }
        });
    }

    fs.writeFileSync(outputFile, JSON.stringify(outputJson, null, 2));
    console.log(`Successfully generated ${outputFile}`);

} catch (err) {
    console.error('Error converting JSON:', err);
}
