#!/usr/bin/env -S bun
import{Glob,$}from'bun';
// import{svg2png}from'../src/svg2png.mjs';
import{mkpltepng}from'../src/mkpltepng.mjs';

await Bun.write('plte.png',mkpltepng([
	0xffffffff,
	0x66ccaaff,
	0x888888ff,
	0x000000ff,
]));
await new Promise(f=>setTimeout(f,1000));
new Glob('*.svg').scanSync('.').forEach(async n=>(
	// await Bun.write(
	// 	`${n}.png`,
	// 	svg2png(await Bun.file(n).text(),console.log(n))
	// )
	$`magick ${n} +dither -remap plte.png ${n}.png`
));
