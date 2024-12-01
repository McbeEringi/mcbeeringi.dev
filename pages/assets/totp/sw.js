//https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps/Offline_Service_workers
//https://developers.google.com/web/fundamentals/primers/service-workers?hl=ja
const
d=[
	{
		id:'totp_index_2412020',
		init:['index.html']
	},
	{
		id:'totp_img_2412020',
		init:['img/icon.svg','img/icon.png']
	},
	{
		id:'totp_misc_0',
		misc:true
	},
];


Object.entries({
	install:e=>Promise.all(d.map(async()=>x.init&&(await caches.open(x.id)).addAll(x.init))),
	activate:e=>Promise.all((async()=>(await caches.keys()).map(x=>d.some(_=>_.id==x)||caches.delete(x)))()),
	fetch:async e=>e.respondWith((async (r,x)=>x?(x.slice(0,6)=='bytes='&&(x=x.slice(6).split(/,\s*/)).length==1?(
		console.log(`RANGE ${x}`),
		x=x.split('-'),
		r=await r.arrayBuffer(),
		x=[
			_=>x.map(x=>+x),
			_=>[+x[0],r.byteLength-1],
			_=>[-x[1],r.byteLength-1],
			_=>[0,r.byteLength-1]
		][!x[0]<<1|!x[1]](),
		new Response(r.slice(x[0],x[1]+1),{
			status:206,statusText:'Partial Content',
			headers:{
				'Content-Type':e.request.headers.get('content-type'),
				'Content-Range':`bytes ${x.join('-')}/${r.byteLength}`
			}
		})
	):Response.error()):r)(
		// (await caches.match(e.request.url,{ignoreSearch:1}))||((r,c)=>(c.put(e.request.url,r),r))(await Promise.all([fetch(e.request.url),caches.open(d.find(x=>x.misc).id)])),
		await fetch(e.request.url).then(
			r=>(caches.open(d.find(x=>x.misc).id).put(e.request.url,r),r),
			_=>caches.match(e.request.url,{ignoreSearch:1})
		),
		e.request.headers.get('range')
	))
}).forEach(([i,x])=>self.addEventListener(i,e=>(console.log(e),e.waitUntil(x(e)))));

console.log('hello from sw');
