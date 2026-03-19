import { khmerToJsMap } from "./map.js"

export function tranpile(khmerCode) {
    // let jsCode = khmerCode

    // // Replace keywords using Regex
    // Object.keys(khmerToJsMap).forEach(key => {
    //     const regex = new RegExp(key, 'g')
    //     jsCode = jsCode.replace(regex, khmerToJsMap[key])
    // })

    // return jsCode


    // 1. First, handle the comments specifically so they don't get mangled
    // Group 1: (បើកសារ[\s\S]*?បិទសារ) -> Multi-line Comment
    // Group 2: (សារ.*) -> Single-line Comment
    // Group 3: ("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*') -> Strings (handles escaped quotes too!)
    // Group 4: ((?:(?!បើកសារ|សារ|"|')[\s\S])+) -> Actual Code
    // const commentOrCode = /(បើកសារ[\s\S]*?បិទសារ)|(សារ.*)|([\s\S]+?)/g
    // const commentOrCode = /(បើកសារ[\s\S]*?បិទសារ)|(សារ.*)|((?:(?!បើកសារ|សារ)[\s\S])+)/g
    const commentOrCode = /(បើកសារ[\s\S]*?បិទសារ)|(សារ.*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|((?:(?!បើកសារ|សារ|"|')[\s\S])+)/g
    // Sort keys by length (longest first) so "ហើយបើ" is checked before "ហើយ"
    const sortedKeys = Object.keys(khmerToJsMap).sort((a, b) => b.length - a.length);
    return khmerCode.replace(commentOrCode, (match, multiline, singleline, text, code) => {
        // If it's a multi-line comment: Replace the markers but NOT the inside content
        if (multiline) return multiline.replace("បើកសារ", "/*").replace("បិទសារ", "*/")
        else if (singleline) return singleline.replace("សារ", "//")
        else if (text) return text
        else {
            // If it's actual CODE: Translate keywords using word boundaries (\b doesn't work well for Khmer, 
            // so we map the specific keys)
            let translatedCode = code

            for (const key of sortedKeys) {
                // We only replace if the key is not part of a comment (handled above)
                translatedCode = translatedCode.split(key).join(khmerToJsMap[key])
            }
            return translatedCode
        }
        return 0
    })
}