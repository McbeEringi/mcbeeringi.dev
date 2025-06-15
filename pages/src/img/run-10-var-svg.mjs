#!/usr/bin/env -S bun
const
w=await Bun.file('icon.svg').text(),
wi=w.replace(/(?<=#)[\wa-f]{2,}/g,x=>({'fff':'222','000':'fff'}[x]||x)),
tr=w=>w.replace(/.*?<path.+?\/>\n/,'');

await Bun.write('icon!.svg',wi);
await Bun.write('icon_.svg',tr(w));
await Bun.write('icon!_.svg',tr(wi));
