import { readdir } from "node:fs/promises";
(await readdir("src",{recursive:1})).forEach(x=>
	Bun.write("build/"+x,Bun.file("src/"+x))
);
Bun.write("build/test/index.html",`trailing slash?`);
Bun.write("build/404.html",`404dayo`);
