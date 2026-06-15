const fs = require('fs');
const { SourceMapConsumer } = require('source-map');
const mapPath = 'dist/assets/index-El04oiwc.js.map';
if (!fs.existsSync(mapPath)) {
  console.error('Source map not found:', mapPath);
  process.exit(1);
}
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
SourceMapConsumer.with(map, null, consumer => {
  const locs = [
    { line: 8, column: 29835 },
    { line: 8, column: 42241 },
    { line: 8, column: 43104 },
  ];
  locs.forEach(({ line, column }) => {
    const pos = consumer.originalPositionFor({ line, column });
    console.log(`${line}:${column} => ${pos.source}:${pos.line}:${pos.column} name=${pos.name}`);
  });
});
