import { readdir, mkdir, rmdir } from 'node:fs/promises';

await rmdir('build',{recursive:1});await mkdir('build');
(await readdir('assets',{recursive:1,withFileTypes:1})).forEach(x=>(x.isFile()||x.isSymbolicLink())&&(
	x=(x.parentPath+'/'+x.name).slice('assets/'.length),
	Bun.write('build/'+x,Bun.file('assets/'+x))
));
