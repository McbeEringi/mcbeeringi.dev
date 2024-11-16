import { readdir } from 'node:fs/promises';
export default (await readdir('assets/src',{recursive:1,withFileTypes:1})).reduce((a,x)=>((x.isFile()||x.isSymbolicLink())&&(
	x=x.parentPath+'/'+x.name,
	a.push({
		name:`/src/${x.slice('assets/src/'.length)}`,
		buffer:Bun.file(x)
	})
),a),[]);
