#!/usr/bin/env -S bun

await Bun.write('icon.png',

((
	w,
	svg=[...w.match(/<svg.*?>/s)[0].matchAll(/(?<k>[\w-]+)="(?<v>.*?)"/g)].reduce((a,{groups:x})=>(a[x.k]=x.v,a),{}),
	css=[...[...w.match(/(?<=<style>).+(?=<\/style>)/sg)??[]].join('')].reduce((a,x)=>(({
		query:_=>x=='{'?(a.t.push(a.t.at(-1)[a.x.trim()]={}),a.s='sel',a.x=''):
			a.x+=x,
		sel:_=>x=='}'?(a.t.pop(),a.s='query'):
			x=='@'?(a.x+=x,a.s='query'):
			x=='{'?(a.t.push(a.t.at(-1)[a.x.trim()]={}),a.s='prop',a.x=''):
			a.x+=x,
		prop:_=>x=='}'?(a.t.pop(),a.s='sel'):
			x==':'?(a.t.push(a.x.trim()),a.s='val',a.x=''):
			a.x+=x,
		val:_=>x=='}'?(a.t.at(-2)[a.t.at(-1)]=a.x.trim(),a.t.pop(),a.s='sel',a.x=''):
			x==';'?(a.t.at(-2)[a.t.at(-1)]=a.x.trim(),a.t.pop(),a.s='prop',a.x=''):
			a.x+=x
	}[a.s])(),a),{x:'',s:'sel',t:[{}]}).t[0],
	path=(w.match(/<path(\s+[\w-]+=".*?")*\/>/sg)??[]).map(x=>[
		...x.matchAll(/(?<k>[\w-]+)="(?<v>.*?)"/g)
	].reduce((a,{groups:x})=>(a[x.k]=x.k=='d'?
		[...x.v,0].reduce((a,x)=>(
			/[mlhvcsqtaz]/i.test(x)||!x?(
				a.x=[...a.x.slice(0,-1),+a.x.at(-1)].slice(1),
				(l=>l&&a.a.push(...[...Array(Math.max(Math.ceil(a.x.length/l),1))].map((_,i)=>({
					cmd:a.s,
					arg:a.x.slice(i*l||0,++i*l)
				}))))({m:2,l:2,h:1,v:1,c:6,s:4,q:4,t:2,a:7,z:1/0}[a.s.toLowerCase()]),
				a.s=x,a.x=[]
			):(isNaN(a.x.at(-1)+x+0)?a.x=[...a.x.slice(0,-1),+a.x.at(-1),x==','?'':x]:a.x[a.x.length-1]+=x),
			a
		),{x:[],s:'',a:[]}).a.slice(1):x.k=='style'?
		x.v.split(';').reduce((a,x)=>((x=x.trim())&&(x=x.split(':').map(x=>x.trim()),a[x[0]]=x[1]),a),{}):
		x.v,
	a),{}))
)=>(
	w=[...Array(+svg.height)].map(_=>[...Array(+svg.width)].map(_=>[255,0,255,255])),
	console.log(svg,css,...path),

	path.forEach(({fill,stroke,style,d})=>(
		console.log()
	)),

	((
		crc=(t=>(buf,crc=0)=>~buf.reduce((c,x)=>t[(c^x)&0xff]^(c>>>8),~crc))([...Array(256)].map((_,n)=>[...Array(8)].reduce(c=>(c&1)?0xedb88320^(c>>>1):c>>>1,n))),// https://www.rfc-editor.org/rfc/rfc1952
		adler=data=>{let a=1,b=0,len=data.length,tlen,i=0;while(len>0){len-=(tlen=Math.min(1024,len));do{b+=(a+=data[i++]);}while(--tlen);a%=65521;b%=65521;}return(b<<16)|a;},
		be4=x=>[x>>>24&255,x>>>16&255,x>>>8&255,x>>>0&255],ch=x=>[...be4(x.length-4),...x,...be4(crc(x))],
		map=(x,f,n=65535)=>[...Array(Math.ceil(x.length/n))].flatMap((_,i,{length:l})=>f(x.slice(n*i,n*i+n),i,l))
	)=>new Uint8Array([
		137,80,78,71,13,10,26,10,// header
		...ch([73,72,68,82, ...be4(w[0].length),...be4(w.length), 8,6, 0,0,0]),// IHDR: w h bitDepth colType 0,0,0
		...ch([73,68,65,84, 8,29, ...(x=>[...map(x,(y,i,a,l=y.length)=>[i==a-1,l>>>0&255,l>>>8&255,~l>>>0&255,~l>>>8&255,...y]),...be4(adler(x))])(
			w.flatMap(x=>[0,...x.flat()])
		)]),// DATA
		0,0,0,0,73,69,78,68,174,66,96,130// IEND
	]))()
	
))(await Bun.file("icon.svg").text())

);
