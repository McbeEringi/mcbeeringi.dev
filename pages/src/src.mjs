import { readdir } from 'node:fs/promises';
// export default (await readdir('assets/src',{recursive:1,withFileTypes:1})).reduce((a,x)=>((x.isFile()||x.isSymbolicLink())&&(
// 	x=x.parentPath+'/'+x.name,
// 	a.push({
// 		name:`src/${x.slice('assets/src/'.length)}`,
// 		buffer:Bun.file(x)
// 	})
// ),a),[]);
export default (await readdir('assets/src',{recursive:1,withFileTypes:1})).reduce((a,x)=>(
	x.isFile()&&(
		(x.parentPath.slice('assets/src'.length+1).match(/[^/]+/g)||[]).reduce((b,y)=>(
			b[y]||(b[y]={})
		),a)[x.name]=Bun.file([x.parentPath,x.name].join('/'))
	),
	a
),{});