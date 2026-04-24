import { khmerToJsMap } from "./map.js"

export function tranpile(khmerCode) {
    const khRange = '\\u1780-\\u17FF\\u200C\\u200D';

    // Regex to identify different parts of the code
    const commentOrCode = new RegExp(
        `((?<![${khRange}])បើកសារ[\\s\\S]*?បិទសារ)|` + // Group 1: Multi-line Comment
        `((?<![${khRange}])សារ.*)|` +                   // Group 2: Single-line Comment
        `("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'|(?:\`[\\s\\S]*?\`))|` + // Group 3: Strings
        `(\\/(?:\\\\.|[^\\/\\\\])+\\/[gimyuy]*)|` +   // Group 4: Regex
        `((?:(?!(?<![${khRange}])បើកសារ|(?<![${khRange}])សារ|"|'|\`|\\/)[\\s\\S])+)`, // Group 5: Actual Code
        'g'
    );
    
    const sortedKeys = Object.keys(khmerToJsMap).sort((a, b) => b.length - a.length);
    const numberKeys = sortedKeys.filter(k => /[\u17E0-\u17E9]/.test(k));
    const specialOperators = ["បូក", "ដក", "គុណ", "ចែក", "សំណល់", "ស្មើរ", "ឲ"];
    const wordKeys = sortedKeys.filter(k => /[\u1780-\u17FF]/.test(k) && !specialOperators.includes(k));
    const symbolKeys = sortedKeys.filter(k => !/[\u1780-\u17FF]/.test(k) || specialOperators.includes(k));

    function applyTranslation(text) {
        let translated = text;
        // 1. Numbers
        for (const key of numberKeys) {
            translated = translated.split(key).join(khmerToJsMap[key]);
        }
        // 2. Symbols
        for (const key of symbolKeys) {
            translated = translated.split(key).join(khmerToJsMap[key]);
        }
        // 3. Khmer Words (with boundary check)
        for (const key of wordKeys) {
            const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const bRegex = new RegExp(`(?<![${khRange}])${escape(key)}(?![${khRange}])`, 'g');
            translated = translated.replace(bRegex, khmerToJsMap[key]);
        }
        return translated;
    }

    return khmerCode.replace(commentOrCode, (match, multiline, singleline, string, regex, code) => {
        if (multiline) return multiline.replace("បើកសារ", "/*").replace("បិទសារ", "*/")
        if (singleline) return singleline.replace("សារ", "//")
        if (regex) return match
        
        // If it's a string, we NOW translate its content (so "ចុច" becomes "click")
        if (string) {
            return applyTranslation(string);
        }
        
        if (code) {
            return applyTranslation(code);
        }
        return match
    })
}
