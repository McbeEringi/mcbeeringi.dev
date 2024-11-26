import {Glob,$} from 'bun';

const cfg={idir:'src',odir:'build'};

({
	build:async({idir,odir})=>(
		await $`rm -rf ${odir};mkdir ${odir}`,
		await(await Array.fromAsync(new Glob(`${idir}/**/*.mjs`).scan('.'))).reduce(async(a,x)=>(
			await a,
			x={w:(await import(`./${x}`)).default,x:x.match(new RegExp(`^${idir}/?(.*)/(.+)$`)).slice(1)},
			console.log(x),
			x.w&&(f=>f(f))(
				f=>(od,w)=>Object.entries(w).forEach(([i,y])=>i.includes('/')||(y instanceof Blob?Bun.write:f(f))([od,i].join('/'),y))
			)([odir,x.x[0]].join('/'),{[x.x[1].slice(0,-4)]:x.w})
		),0)
	),
	dev:({idir})=>Bun.serve({
		development:1,
		fetch:async w=>(
			Object.keys(require.cache).forEach(x=>(x.includes(import.meta.dir)&&delete require.cache[x])),
			w={
				req:w,
				path:new URL(w.url).pathname,
				src:(await Array.fromAsync(new Glob(`${idir}/**/*.mjs`).scan('.'),x=>x.slice(idir.length)))
					.sort((a,b)=>([a,b]=[a,b].map(x=>x.split('/').length),b-a)),
				search:async(p='')=>(
					p={p:p.match(/[^/]+/g)},
					p.rexp=new RegExp(`^${p.p.reduceRight((a,x)=>`/${x}(?:${a})?`,'\\..+')}.mjs$`),
					p.x=await w.src.reduce(async(a,x)=>(
						a=await a,
						a||p.rexp.test(x)&&(
							x=p.p.slice(x.match(/[^/]+/g).length).reduce((b,y,i,{length:l})=>b&&(
								i==l-1&&(y=Object.keys(b).find(_=>new RegExp(`^${y}(?:\\..+)?$`).test(_))||y),
								b[y]
							),(await import('./'+idir+x)).default),
							x instanceof Blob?x:a
						)
					),0),
					console.log(p.p,p.x&&p.x.type),
					p.x&&new Response(p.x)
				),
				main:async()=>(
					w.path.slice(-1)=='/'?
					await w.search(w.path+'index'):
					await w.search(w.path)||await w.search(w.path+'/index')&&Response.redirect(w.path+'/')
				)||await w.search('/404')
			},
			console.log(w.req.url),
			await w.main()
		)
	})
})[Bun.argv.slice(2)[0]||'build'](cfg);
