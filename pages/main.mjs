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
	dev:async(idir='src')=>Bun.serve({
		async fetch(req){return(
			console.log(req.url),
			console.log(

				req.regexp=new RegExp([...(new URL(req.url).pathname.match(/[^/]+/g)||[]),'index'].map((_,i,a)=>`(?:^${a.slice(0,-i||void 0).join('/')}(?:\\..*)*.mjs$)`).join('|')),
				await(await readdir(idir,{recursive:1,withFileTypes:1}))
				.sort((a,b)=>([a,b]=[a,b].map(x=>x.parentPath.split('/').length),b-a))
				.filter(x=>req.regexp.test([x.parentPath,x.name].join('/').slice(idir.length+1)))
				.reduce(async(a,x)=>(
					a=await a,
					x=(await import('./'+[x.parentPath,x.name].join('/'))).default,
					console.log(x),
					a
				),null)
				
			),

			new Response(new Blob([JSON.stringify({
				method:req.method,
				url:req.url,
				headers:req.headers,
				body:req.body&&await req.body.text()
			},0,'\t')],{type:'application/json'}))
		);},
	})
})[Bun.argv.slice(2)[0]||'build']();
