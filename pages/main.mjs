import { readdir, mkdir, rmdir } from 'node:fs/promises';

await rmdir('build',{recursive:1});await mkdir('build');
// (await readdir('assets',{recursive:1,withFileTypes:1})).forEach(x=>(x.isFile()||x.isSymbolicLink())&&(
// 	x=(x.parentPath+'/'+x.name).slice('assets/'.length),
// 	Bun.write('build/'+x,Bun.file('assets/'+x))
// ));

(await readdir('src',{recursive:1,withFileTypes:1})).reduce(async(a,x)=>(a=await a,x.isFile()||x.isSymbolicLink())&&(
	x='./'+(x.parentPath+'/'+x.name),x.slice(-4)=='.mjs'&&(
		(await import(x)).default.map(x=>(
			Bun.write('build/'+x.name,x.buffer)
		))
	),
	a
),[]);
