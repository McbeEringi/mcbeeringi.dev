const
svg2png=w=>((
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
					cmd:a.s.toLowerCase(),rel:a.s.toLowerCase()==a.s,
					arg:a.x.slice(i*l||0,++i*l)
				}))))({m:2,l:2,h:1,v:1,c:6,s:4,q:4,t:2,a:7,z:1/0}[a.s.toLowerCase()]),
				a.s=x,a.x=[]
			):(isNaN(a.x.at(-1)+x+0)?a.x=[...a.x.slice(0,-1),+a.x.at(-1),x==','?'':x]:a.x[a.x.length-1]+=x),
			a
		),{x:[],s:'',a:[]}).a:x.k=='style'?
		x.v.split(';').reduce((a,x)=>((x=x.trim())&&(x=x.split(':').map(x=>x.trim()),a[x[0]]=x[1]),a),{}):
		x.v,
	a),{})),
	hcol=w=>w&&w[0]=='#'&&(w=w.slice(1),{
		2:_=>[...Array(3).fill(parseInt(w,16)),255],
		3:_=>[...[...w].map((x,i)=>parseInt(x,16)*17),255],
		4:_=>[...w].map((x,i)=>parseInt(x,16)*17),
		6:_=>[...[...Array(3)].map((_,i)=>parseInt(w.slice(i*2,++i*2),16)),255],
		8:_=>[...Array(4)].map((_,i)=>parseInt(w.slice(i*2,++i*2),16)),
	}[w.length]?.()),
	rev=x=>x.map(x=>-x),
	add=(...w)=>w.reduce((a,x)=>a.map((a,i)=>a+(x[i]??x))),
	sub=(x,...y)=>add(x,...y.map(rev)),
	inv=x=>x.map(x=>1/x),
	mul=(...w)=>w.reduce((a,x)=>a.map((a,i)=>a*(x[i]??x))),
	div=(x,...y)=>mul(x,...y.map(inv)),
	mix=(a,b,x)=>add(mul(a,1-x),mul(b,x)),
	rsw=(r,p,c)=>r?add(p,c):c
)=>(
	svg.width=+svg.width,svg.height=+svg.height,
	svg.viewBox=svg.viewBox.split(' ').map(x=>+x),
	w=[...Array(svg.height)].map(_=>[...Array(svg.width)].map(_=>[255,255,255,255])),
	path.forEach(w=>w.v=w.d.reduce((a,x)=>(
		({
			m:(x,r)=>a.v.push([[...(a.p=rsw(r,a.p,x))]]),
			l:(x,r)=>a.v.at(-1).push([...(a.p=rsw(r,a.p,x))]),
			h:(x,r)=>a.v.at(-1).push([...(a.p=[x[0]+(r&&a.p[0]),a.p[1]])]),
			v:(x,r)=>a.v.at(-1).push([...(a.p=[a.p[0],x[0]+(r&&a.p[1])])]),
			c:(x,r)=>(a.v.at(-1).push(...[...Array(16)].map((_,t,{length:l})=>(t/=l-1,add(
				mul(a.p,(1-t)**3),
				mul(rsw(r,a.p,x.slice(0,2)),3*t*(1-t)**2),
				mul(rsw(r,a.p,x.slice(2,4)),3*t**2*(1-t)),
				mul(rsw(r,a.p,x.slice(4,6)),t**3)
			)))),a.p=rsw(r,a.p,x.slice(4,6))),
			// TODO: cssssss
			s:(x,r)=>(a.v.at(-1).push(...a.m.cmd=='c'?[...Array(16)].map((_,t,{length:l})=>(t/=l-1,add(
				mul(a.p,(1-t)**3),
				mul(add(a.p,sub(a.m.arg.slice(4,6),a.m.arg.slice(2,4))),3*t*(1-t)**2),
				mul(rsw(r,a.p,x.slice(0,2)),3*t**2*(1-t)),
				mul(rsw(r,a.p,x.slice(2,4)),t**3)
			))):[[...rsw(r,a.p,x.slice(2,4))]]),a.p=rsw(r,a.p,x.slice(2,4))),
			q:(x,r)=>(a.v.at(-1).push(...[...Array(16)].map((_,t,{length:l})=>(t/=l-1,add(
				mul(a.p,(1-t)**2),
				mul(rsw(r,a.p,x.slice(0,2)),2*t*(1-t)),
				mul(rsw(r,a.p,x.slice(2,4)),t**2)
			)))),a.p=rsw(r,a.p,x.slice(2,4))),
			// TODO: qtttttt
			t:(x,r)=>(a.v.at(-1).push(...a.m.cmd=='q'?[...Array(16)].map((_,t,{length:l})=>(t/=l-1,add(
				mul(a.p,(1-t)**2),
				mul(add(a.p,sub(a.m.arg.slice(2,4),a.m.arg.slice(0,2))),2*t*(1-t)),
				mul(rsw(r,a.p,x.slice(0,2)),t**2)
			))):[[...rsw(r,a.p,x.slice(0,2))]]),a.p=rsw(r,a.p,x.slice(0,2))),
			
			// TODO: a:(x,r)=>1,
			a:(x,r)=>a.v.at(-1).push([...(a.p=rsw(r,a.p,x.slice(5,7)))]),
			z:(x,r)=>a.v.at(-1).push([...(a.p=[...a.v.at(-1)[0]]),0]),
		}[x.cmd])(x.arg,x.rel),
		a.m=x,
		a
	),{p:[0,0],m:{},v:[[[0,0]]]}).v),

	// console.log(svg,css,...path),
	path.forEach((x,col)=>(
		col=hcol(x.stroke)||hcol(x.fill)||(
			x.style&&(hcol(x.style.stroke)||hcol(x.style.fill))
		)||[0,0,0,255],
		x.v.forEach(p=>p.reduce((p,q,_q)=>(
			_q=q,
			[p,q]=[p,q].map(x=>x.map((x,i)=>//Math.max(0,Math.min(
				Math.floor((x-svg.viewBox[i])/(svg.viewBox[i+2]-svg.viewBox[i])*svg[['width','height'][i]]),
			//svg[['width','height'][i]]-1))
			)),
			[...Array(Math.max(Math.abs(q[0]-p[0]),Math.abs(q[1]-p[1])))].forEach((c,t,{length:l})=>(t/=l-1,isNaN(t)&&(t=0),
				c=mix(p,q,t).map(x=>Math.floor(x)),
				[...Array(4)].forEach((_,i)=>(
					_=[c[0]-(i&1),c[1]-(i>>1)],
					w[_[1]]&&w[_[1]][_[0]]&&(w[_[1]][_[0]]=col)
				))
			)),
			_q
		)
	)))),
	
	console.log(n,svg),

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
	
))();

export{svg2png};
