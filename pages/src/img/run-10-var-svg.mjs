#!/usr/bin/env -S bun
const
w=await Bun.file('icon+.svg').text(),
col=p=>w.replace(/.*?@media.*?\n/,'').replace('var(--s)',p.fg).replace('class="b"',`fill="${p.bg}"`),
tr=w=>w.replace(/.*?<path.+?\/>\n/,'');

await Bun.write('icon.svg',col({fg:'#000',bg:'#fff'}));
await Bun.write('icon!.svg',col({fg:'#fff',bg:'#222'}));
await Bun.write('icon_.svg',tr(col({fg:'#000'})));
await Bun.write('icon!_.svg',tr(col({fg:'#fff'})));
await Bun.write('icon+_.svg',tr(w));
