const fs = require('fs');
const { SourceMapConsumer } = require('source-map');
const raw = fs.readFileSync('dist/assets/index-El04oiwc.js.map', 'utf8');
SourceMapConsumer.with(JSON.parse(raw), null, consumer => {
  const positions = [
    { line: 8, column: 29835 },
    { line: 8, column: 42241 },
    { line: 8, column: 43104 },
  ];
  positions.forEach((pos, idx) => {
    const original = consumer.originalPositionFor(pos);
    console.log('original', idx + 1, pos, original);
  });
});
