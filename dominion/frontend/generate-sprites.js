const { createCanvas } = require('canvas');
const fs = require('fs');

const SIZE = 64;
const PIXEL = 4; // each "pixel" is 4x4 real pixels = 16x16 grid in 64x64

function drawSprite(name, grid, palette) {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');
  
  // Transparent background
  ctx.clearRect(0, 0, SIZE, SIZE);
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const char = grid[y][x];
      if (char !== '.' && palette[char]) {
        ctx.fillStyle = palette[char];
        ctx.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
      }
    }
  }
  
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/sprites/${name}.png`, buf);
  console.log(`✓ ${name}.png (${buf.length} bytes)`);
}

// THRONE - King with golden crown and red cape
drawSprite('throne', [
  '....YYYY........',
  '...YyYyYY.......',
  '...YYYYYY.......',
  '....SSSS........',
  '...SSSSSS.......',
  '...S.SS.S.......',
  '...SSSSSS.......',
  '....SmSS........',
  '...RRGGRR.......',
  '..RRRGGGRRR.....',
  '..RR.GGG.RR.....',
  '..RR.GGG.RR.....',
  '.RR..GGG..RR....',
  '......B.........',
  '.....BBB........',
  '....BB.BB.......',
], { Y: '#FFD700', y: '#FFA500', S: '#FFDBAC', m: '#D4956A', G: '#DAA520', R: '#CC0000', B: '#8B4513', '.': null });

// GRIMOIRE - Wizard with purple robe and pointed hat
drawSprite('grimoire', [
  '......P.........',
  '.....PPP........',
  '....PPPPP.......',
  '...PPPPPPP......',
  '...PP.W.PP......',
  '....SSSS........',
  '...S.SS.S.......',
  '...SSSSSS.......',
  '....SSSS........',
  '...PPPPPP.......',
  '..PPPPPPPP......',
  '..PP.PP.PP......',
  '..PP.PP.PP......',
  '..PPPPPPPP......',
  '.....BB.........',
  '....BB.BB.......',
], { P: '#6B21A8', W: '#FFD700', S: '#FFDBAC', B: '#4A3728', '.': null });

// ECHO - Bard with blue outfit and horn
drawSprite('echo', [
  '....BBB.........',
  '...BBBBB........',
  '...SSSSBB.......',
  '...S.SS.S.......',
  '...SSSSSS.......',
  '....SSSS........',
  '...LLLLLL.......',
  '..LLLLLLLL......',
  '..LL.LL.LLY.....',
  '..LL.LL.LYYY....',
  '..LLLLLLLL.Y....',
  '..LLLLLLLL......',
  '.....BB.........',
  '....BB.BB.......',
  '....B...B.......',
  '................',
], { L: '#3B82F6', B: '#1E3A5F', S: '#FFDBAC', Y: '#DAA520', '.': null });

// SEER - Hooded oracle with crystal ball
drawSprite('seer', [
  '...CCCCCC.......',
  '..CCCCCCCC......',
  '..CC.SS.CC......',
  '..CCSSSSCC......',
  '...CSSSC........',
  '..CCCCCCCC......',
  '..CC.CC.CC......',
  '..CCCCCCCC......',
  '..CC.CC.CC......',
  '..CCCCCCCC......',
  '...CCCCCC.......',
  '....aaa.........',
  '...aaaaa........',
  '...aAaAa........',
  '...aaaaa........',
  '....aaa.........',
], { C: '#0E7490', S: '#FFDBAC', a: '#06B6D4', A: '#FFFFFF', '.': null });

// PHANTOM - Dark assassin with black cloak
drawSprite('phantom', [
  '....DDD.........',
  '...DDDDD........',
  '..DDDDDDD.......',
  '..DD.SS.DD......',
  '..DDSSSSDD......',
  '...DSSSD........',
  '..DDDDDDDD......',
  '.DDDDDDDDDD.....',
  '.DDD.DD.DDD.....',
  '.DDD.DD.DDD.....',
  '.DDDDDDDDDD.....',
  '..DDDDDDDDD.....',
  '...DDDDDDD......',
  '....DDDDD.......',
  '.....DDD........',
  '................',
], { D: '#1a1a2e', S: '#CCCCCC', '.': null });

// MAMMON - Merchant with gold coins
drawSprite('mammon', [
  '....BBB.........',
  '...BBBBB........',
  '...BSSSSB.......',
  '...S.SS.S.......',
  '...SSSSSS.......',
  '....SmSS........',
  '..GGGGGGGG......',
  '..GG.GG.GG......',
  '..GG.GG.GG......',
  '..GGGGGGGG......',
  '..GG.GG.GG......',
  '..GGGGGGGG......',
  '.YYY.BB.YYY.....',
  'YYYYY..YYYYY....',
  '.YYY....YYY.....',
  '................',
], { B: '#8B4513', S: '#FFDBAC', m: '#D4956A', G: '#2D5016', Y: '#FFD700', '.': null });

// WRAITH-EYE - Hooded watcher with glowing red eye
drawSprite('wraith-eye', [
  '...KKKKKK.......',
  '..KKKKKKKK......',
  '..KK.KK.KK......',
  '..KKRKKKKK......',
  '..KKKSSKKK......',
  '...KKSSKK.......',
  '..KKKKKKKK......',
  '.KKKKKKKKKK.....',
  '.KKK.KK.KKK....',
  '.KKK.KK.KKK....',
  '.KKKKKKKKKK.....',
  '..KKKKKKKK......',
  '...KKKKKK.......',
  '....KKKK........',
  '................',
  '................',
], { K: '#2D1B4E', R: '#FF0000', S: '#FFDBAC', '.': null });

console.log('\nAll sprites generated!');
