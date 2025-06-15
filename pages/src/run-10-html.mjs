#!/usr/bin/env -S bun
import{Glob}from'bun';

new Glob('**/*.html').scanSync('.').forEach(async n=>await Bun.write(n,(x=>(
	x
		.replace(/<html>/,'<html lang="ja">')
		.replace(/(\t*)<head>\n?/,`$1<head>\n$1\t<meta charset="utf-8">\n$1\t<meta name="viewport" content="width=device-width,initial-scale=1">\n`)
))(await Bun.file(n).text(),console.log(n))))
