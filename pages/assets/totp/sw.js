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
	install:e=>Promise.all(d.map(async x=>x.init&&(await caches.open(x.id)).addAll(x.init))),
	activate:async e=>await Promise.all((await caches.keys()).map(async x=>d.some(_=>_.id==x)||await caches.delete(x))),
	fetch:async e=>e.respondWith(await(async (r,x)=>(console.log(e.request.url,r,await caches.match(e.request.url,{ignoreSearch:1})),x)?(x.slice(0,6)=='bytes='&&(x=x.slice(6).split(/,\s*/)).length==1?(
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
			async r=>(await(await caches.open(d.find(x=>x.misc).id)).put(e.request.url,r.clone()),r),
			async _=>(await caches.match(e.request.url,{ignoreSearch:1}))
		),
		e.request.headers.get('range')
	))
}).forEach(([i,x])=>self.addEventListener(i,e=>(console.log(e),e.waitUntil(x(e)))));

console.log('hello from sw');



// //https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps/Offline_Service_workers
// //https://developers.google.com/web/fundamentals/primers/service-workers?hl=ja
// const cname='2412020',
// cstore=[
// 	'img/icon.svg','img/icon.png',
// 	'index.html'
// ],
// cprev=[
// 	'_.html'
// ];
// /*
// const clist={
// 	common:[
// 		'com.js',
// 		'img/icon.svg','img/icon_.svg','img/icon.png','img/icon192.png',
// 		'index.html'
// 	],
// 	instr$2206081:[

// 	],
// }
// */
// self.addEventListener('install',e=>{
// 	console.log('sw Install');
// 	e.waitUntil(caches.open(cname).then(c=>c.addAll(cstore)));
// });
// self.addEventListener('activate',e=>{
// 	console.log('sw Activate');
// 	e.waitUntil(caches.keys().then(x=>Promise.all(x.map(y=>(y==cname||caches.delete(y))))));
// });

// self.addEventListener('fetch',e=>{
// 	if(cprev.find(x=>e.request.url.includes(x))){console.log('sw Cache canceled: '+e.request.url);return;}
// 	const cacheNew=()=>fetch(e.request.url).then(r=>caches.open(cname).then(c=>{
// 		c.put(e.request.url,r.clone());
// 		console.log(e.request.url+' cached.');
// 		return r;
// 	}));

// 	if(e.request.headers.has('range')){//https://qiita.com/biga816/items/dcc69a265235f1c3f7e0
// 		console.log('sw Fetch (Range): '+e.request.url);
// 		const p=e.request.headers.get('range').slice(6).split('-').map(Number);
// 		e.respondWith(
// 			caches.match(e.request.url,{ignoreSearch:true}).then(r=>r||cacheNew()).then(r=>r.arrayBuffer()).then(b=>{
// 				if(p[1])p[1]++;else p[1]=b.byteLength;
// 				new Response(b.slice(...p),{
// 					status:206,statusText:'Partial Content',
// 					headers:[
// 						['Content-Type',e.request.headers.get('content-type')],
// 						['Content-Range',`bytes ${p[0]}-${p[1]-1}/${b.byteLength}`]
// 					]
// 				});
// 			})
// 		);
// 	}else{
// 		console.log('sw Fetch: '+e.request.url);
// 		e.respondWith(caches.match(e.request.url,{ignoreSearch:true}).then(r=>r||cacheNew()));
// 	}
// });
