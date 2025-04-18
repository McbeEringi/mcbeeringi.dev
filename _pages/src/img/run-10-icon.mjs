#!/usr/bin/env -S bun
import{svg2png}from'../src/svg2png.mjs';

const
main=async n=>await Bun.write(
	`${n}.png`,
	svg2png(await Bun.file(n).text()),
	console.log(n)
);

main('icon.svg');
main('icon_hat.svg');

