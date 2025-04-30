#!/usr/bin/env -S bun
import{Glob}from'bun';
import{svg2png}from'../src/svg2png.mjs';

new Glob('*.svg').scanSync('.').forEach(async n=>await Bun.write(
	`${n}.png`,
	svg2png(await Bun.file(n).text(),console.log(n))
));
