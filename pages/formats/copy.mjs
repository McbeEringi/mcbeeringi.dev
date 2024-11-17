import { readdir } from 'node:fs/promises';

const
cp_r=async w=>(await readdir(w,{recursive:1,withFileTypes:1})).reduce((a,x)=>(
	x.isFile()&&(
		(x.parentPath.slice(w.length+1).match(/[^/]+/g)||[]).reduce((b,y)=>(
			b[y]||(b[y]={})
		),a)[x.name]=Bun.file([x.parentPath,x.name].join('/'))
	),
	a
),{});

export{cp_r};