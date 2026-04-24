import { tranpile } from './src/config/tranpile.js';

const testCases = [
    {
        name: "Basic Variable and Loop",
        code: `ថេរ​ក​ឲ​«១,២,៣,៤,៥,៦,៧,៨,៩»
វិល (ថេរ ខ នៃ ក)««
បើ(ខ សំណល់ ២ ឲឲ ១) បន្តរ
មើល(ខ)
»»`
    },
    {
        name: "Comments and Strings",
        code: `សារ នេះជាមតិយោបល់
តាង អត្ថបទ = "នេះជាអត្ថបទដែលមានពាក្យ តាង នៅខាងក្នុង"
បើកសារ
នេះជាមតិយោបល់
ច្រើនបន្ទាត់
បិទសារ
មើល(អត្ថបទ)`
    },
    {
        name: "Keyword inside identifier (Potential Issue)",
        code: `តាង តាងក = ១០;
មើល(តាងក);`
    },
    {
        name: "Comment markers inside strings",
        code: `តាង ស = "នេះមិនមែនជា សារ ទេ";
តាង ម = "នេះក៏មិនមែនជា បើកសារ មតិយោបល់ បិទសារ ដែរ";`
    },
    {
        name: "Template literals and Regex literals",
        code: `តាង គ = \`នេះជា សារ ក្នុង template\`;
តាង រ = /សារ/;`
    }
];

testCases.forEach(tc => {
    console.log(`--- Test Case: ${tc.name} ---`);
    console.log("Input:");
    console.log(tc.code);
    console.log("Output:");
    try {
        const output = tranpile(tc.code);
        console.log(output);
    } catch (e) {
        console.error("Error during transpilation:", e);
    }
    console.log("\n");
});
