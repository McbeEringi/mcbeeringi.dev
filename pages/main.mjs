import { readdir, mkdir, rmdir } from 'node:fs/promises';

({
	build:async(idir='src',odir='build')=>(
		await rmdir(odir,{recursive:1}),
		await mkdir(odir),
		(await readdir(idir,{recursive:1,withFileTypes:1})).reduce(async(a,x)=>(
			await a,
			x.isFile()&&x.name.slice(-4)=='.mjs'&&(
				x.x=(await import('./'+[x.parentPath,x.name].join('/'))).default,
				console.log([x.parentPath,x.name].join('/'),x.x),
				x.x&&(f=>f(f))(
					f=>(od,w)=>Object.entries(w).forEach(([i,y])=>i.includes('/')||(y instanceof Blob?Bun.write:f(f))([od,i].join('/'),y))
				)([odir,x.parentPath.slice(idir.length+1)].join('/'),{[x.name.slice(0,-4)]:x.x})
			)
		),0)
	),
	dev:(idir='src')=>Bun.serve({
		fetch:async w=>(
			w={
				req:w,
				path:new URL(w.url).pathname,
				src:(await readdir(idir,{recursive:1,withFileTypes:1}))
					.filter(x=>x.name.slice(-4)=='.mjs')
					.map(x=>(x.p=[x.parentPath,x.name].join('/').slice(idir.length),x))
					.sort((a,b)=>([a,b]=[a,b].map(x=>x.p.split('/').length),b-a)),
				search:async(p='')=>(
					p={p:(w.path+p).match(/[^/]+/g)},
					p.rexp=new RegExp(`^${p.p.reduceRight((a,x)=>`/${x}(?:${a})?`,'\\..+')}.mjs$`),
					p.x=await w.src.reduce(async(a,x)=>(
						a=await a,
						a||p.rexp.test(x.p)&&(
							x=p.p.slice(x.p.match(/[^/]+/g).length).reduce((b,y,i,{length:l})=>b&&(
								i==l-1&&(y=Object.keys(b).find(_=>new RegExp(`^${y}(?:\\..+)?$`).test(_))||y),
								b[y]
							),(await import('./'+idir+x.p)).default),
							x instanceof Blob?x:a
						)
					),0),
					console.log(p.p),
					p.x&&new Response(p.x)
				),
				main:async()=>w.path.slice(-1)=='/'?
					await w.search('index'):
					await w.search()||await w.search('/index')&&Response.redirect(w.path+'/')
			},
			console.log(w.req.url),
			await w.main()
		)
	})
})[Bun.argv.slice(2)[0]||'build']();
