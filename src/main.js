import fs from 'fs'
import { join } from 'path'
import { tranpile } from './config/tranpile.js'
import { exec, spawn } from 'child_process'

const targetFile = process.argv[2]
if (!targetFile) {
    console.error("សូមបញ្ជាក់ឈ្មោះឯកសារ");
    process.exit(1);
}
const destinationFile = join(process.cwd(), 'dist', 'hello.js')

const klang = fs.readFileSync(targetFile)
const js = tranpile(klang.toString())
if (!fs.existsSync(join(process.cwd(), 'dist')))
    fs.mkdirSync(join(process.cwd(), 'dist'))
fs.writeFileSync(destinationFile, js.toString(), { encoding: 'utf-8' })
spawn('node', [destinationFile])