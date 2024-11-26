import {Glob} from 'bun';

const
cp_r=async w=>(await Array.fromAsync(new Glob(`${w}/**/*`).scan('.'))).reduce((a,x)=>(
	x={x,p:x.match(new RegExp(`^${w}/?(.*)/(.+)$`)).slice(1)},
	(x.p[0].match(/[^/]+/g)||[]).reduce((b,y)=>b[y]||(b[y]={}),a)[x.p[1]]=Bun.file(x.x),
	a
),{});

export{cp_r};