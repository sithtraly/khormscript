import fs from 'fs'
import { join } from 'path'
import { tranpile } from './config/tranpile.js'
import { spawn } from 'child_process'
import { Script } from 'vm'

const targetFile = process.argv[2]
const isWeb = process.argv.includes('--web')

if (!targetFile) {
    console.error("សូមបញ្ជាក់ឈ្មោះឯកសារ (Please specify a file name)");
    process.exit(1);
}

// Get the base name of the file
const fileName = targetFile.split('/').pop().split('\\').pop().replace('.khs', '.js');
const destinationFile = join(process.cwd(), 'dist', fileName)

// Error Dictionary
const errorTranslation = {
    "Unexpected identifier": "រកឃើញពាក្យមិនរំពឹងទុក (Identifier)។ ប្រហែលជាអ្នកភ្លេចដាក់សញ្ញា ឬប្រើពាក្យគន្លឹះខុសកន្លែង។",
    "Missing initializer in const declaration": "ខ្វះការកំណត់តម្លៃដំបូងសម្រាប់ការប្រកាស 'ថេរ' (const)។",
    "Unexpected token": "រកឃើញនិមិត្តសញ្ញាមិនរំពឹងទុក។ សូមពិនិត្យមើលសញ្ញា បិទ/បើក វង់ក្រចក ឬសញ្ញាផ្សេងៗ។",
    "is not defined": "មិនត្រូវបានកំណត់ ឬរកមិនឃើញឡើយ។",
    "Invalid or unexpected token": "និមិត្តសញ្ញាមិនត្រឹមត្រូវ ឬមិនរំពឹងទុក។",
    "Unexpected end of input": "ការសរសេរកូដមិនទាន់ចប់សព្វគ្រប់ (ប្រហែលជាភ្លេចបិទសញ្ញា } )។",
    "document is not defined": "ឯកសារ (document) មិនមាននៅក្នុង Node.js ទេ (សូមប្រើ flag --web ដើម្បីបកប្រែសម្រាប់ Browser)"
}

function translateError(errorMessage) {
    for (const [key, value] of Object.entries(errorTranslation)) {
        if (errorMessage.includes(key)) return value;
    }
    return errorMessage;
}

try {
    const klang = fs.readFileSync(targetFile, 'utf-8')
    const js = tranpile(klang)

    if (!fs.existsSync(join(process.cwd(), 'dist'))) {
        fs.mkdirSync(join(process.cwd(), 'dist'))
    }

    fs.writeFileSync(destinationFile, js, { encoding: 'utf-8' })
    console.log(`✅ បកប្រែជោគជ័យ៖ ${destinationFile}`);

    // Skip Node execution if it's for web
    if (isWeb) {
        console.log("🌐 រួចរាល់សម្រាប់ Browser។ សូមបើកឯកសារ HTML របស់អ្នក។");
        process.exit(0);
    }

    // 1. Check Syntax for Node
    try {
        new Script(js); 
    } catch (syntaxError) {
        console.error("\n=== កំហុសការបកប្រែកូដ (Transpilation Error) ===");
        console.error(`📍 ទីតាំង៖ បន្ទាត់ទី ${syntaxError.stack.split('\n')[0].split(':').pop()}`);
        console.error(`❌ បញ្ហា៖ ${translateError(syntaxError.message)}`);
        process.exit(1);
    }

    // 2. Run file
    const child = spawn('node', [destinationFile], { stdio: 'inherit' });
    child.on('exit', (code) => {
        if (code !== 0) console.error(`\n[KhormScript] Exit code: ${code}`);
    });

} catch (err) {
    console.error("កំហុស៖", err.message);
}
