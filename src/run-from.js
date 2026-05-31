// eslint-disable-next-line
const { execSync } = require('child_process');
// eslint-disable-next-line
const fs = require('fs');

const specFile = 'cypress/integration/page.spec.js';
const fromTest = process.argv[2]; // test name passed as argument

const content = fs.readFileSync(specFile, 'utf8');
let testCount = 0;
const lines = content.split('\n');

let found = false;
let numerated = false;

const resetOnly = lines.map(line => {
  if (line.match(/^\s+it.only\('/)) {
    // eslint-disable-next-line no-console
    console.log('Removing existing "only" from:', line.trim());

    return line.replace(/it.only\(/, 'it(');
  }

  return line;
});

const numerate = resetOnly.map(line => {
  if (!numerated && line.includes(`it('1 `)) {
    numerated = true;
    // eslint-disable-next-line no-console
    console.log(numerated);
  }

  if (!numerated && line.includes(` it('`)) {
    // eslint-disable-next-line no-console
    console.log('Numerating test:', testCount);
    testCount++;

    return line.replace(/it\('/, `it('${testCount} `);
  }

  return line;
});

const modified = numerate.map(line => {
  if (!found && line.includes(`it('${fromTest}`)) {
    found = true;
  }

  if (found && line.match(/^\s+it\('/)) {
    return line.replace(/it\(/, 'it.only(');
  }

  if (line.includes('describe.skip(')) {
    return line.replace('describe.skip(', 'describe(');
  }

  return line;
});

fs.writeFileSync(specFile, modified.join('\n'));
// eslint-disable-next-line no-console
console.log(`Running from: "${fromTest}"`);

try {
  execSync(
    `npx cypress run --spec ${specFile} --config baseUrl=http://localhost:5173`,
    { stdio: 'inherit' },
  );
} finally {
}
