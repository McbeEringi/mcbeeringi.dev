const
svg2png=w=>((
	rev=x=>x.map(x=>-x),
	add=(...w)=>w.reduce((a,x)=>a.map((a,i)=>a+(x[i]??x))),
	sub=(x,...y)=>add(x,...y.map(rev)),
	inv=x=>x.map(x=>1/x),
	mul=(...w)=>w.reduce((a,x)=>a.map((a,i)=>a*(x[i]??x))),
	div=(x,...y)=>mul(x,...y.map(inv)),
	dot=(...w)=>w[0].reduce((a,_,i)=>a+w.reduce((a,x)=>a*x[i],1),0),
	mix=(a,b,x)=>add(mul(a,1-x),mul(b,x)),
	rsw=(r,p,c)=>r?add(p,c):c,
	splcnt=8,
	scale=1,
	hcol=w=>w&&w[0]=='#'&&(w=w.slice(1),{
		2:_=>[...Array(3).fill(parseInt(w,16)),255],
		3:_=>[...[...w].map((x,i)=>parseInt(x,16)*17),255],
		4:_=>[...w].map((x,i)=>parseInt(x,16)*17),
		6:_=>[...[...Array(3)].map((_,i)=>parseInt(w.slice(i*2,++i*2),16)),255],
		8:_=>[...Array(4)].map((_,i)=>parseInt(w.slice(i*2,++i*2),16)),
	}[w.length]?.()),
	{w:[parsed],a:flatten}=(f=>(u=>u(u))(x=>f(y=>x(x)(y))))(re=>w=>((
		m=[...w.w.matchAll(/<(?<tag>\w+)(?<kv>(\s+[\w-]+=".*?")*)\s*?(>(?<content>.*?)<\/\k<tag>>|\/\s*?>)/gs)]
	)=>m.length?{w:(w.w=m.reduce((a,{groups:x},i,s)=>(
		s={
			tag:x.tag,attr:[...x.kv.matchAll(/(?<k>[\w-]+)="(?<v>.*?)"/gs)].reduce((a,{groups:{k,v}})=>(
				a[k]=({
					width:_=>+v,height:_=>+v,viewBox:_=>v.split(/,?\s/).map(x=>+x),
					style:_=>v.split(';').reduce((a,x)=>((x=x.trim())&&(x=x.split(':').map(x=>x.trim()),a[x[0]]=x[1]),a),{}),
					d:_=>[...v,0].reduce((a,x)=>(
						/[mlhvcsqtaz]/i.test(x)||!x?(
							a.x=[...a.x.slice(0,-1),+a.x.at(-1)].slice(1),
							(l=>l&&a.a.push(...[...Array(Math.max(Math.ceil(a.x.length/l),1))].map((_,i)=>({
								cmd:a.s.toLowerCase(),rel:a.s.toLowerCase()==a.s,arg:a.x.slice(i*l||0,++i*l)
							}))))({m:2,l:2,h:1,v:1,c:6,s:4,q:4,t:2,a:7,z:1/0}[a.s.toLowerCase()]),
							a.s=x,a.x=[]
						):(isNaN(a.x.at(-1)+x+0)?a.x=[...a.x.slice(0,-1),+a.x.at(-1),x==','?'':x]:a.x[a.x.length-1]+=x),
						a
					),{x:[],s:'',a:[]}).a
				}[k])?.()??v,
			a),{}),
			parent:w.p,ancients:{[Symbol.iterator]:(x=s)=>({next:_=>({done:!(x=x.parent),value:x})})},
			sibling:a,i,prev:_=>a[i-1],next:_=>a[i+1]
		},
		x.tag=='style'?(s.css=[...x.content].reduce((a,x)=>(({
			query:_=>x=='{'?(a.t.push(a.t.at(-1)[a.x.trim()]={}),a.s='sel',a.x=''):x==';'?(a.t.at(-1)[a.x.trim()]=0,a.s='sel',a.x=''):a.x+=x,
			sel:_=>x=='}'?a.t.pop():x=='@'?(a.x+=x,a.s='query'):x=='{'?(a.t.push(a.t.at(-1)[a.x.trim()]={}),a.s='prop',a.x=''):a.x+=x,
			prop:_=>x=='}'?(a.t.pop(),a.s='sel'):x==':'?(a.t.push(a.x.trim()),a.s='val',a.x=''):a.x+=x,
			val:_=>x=='}'?(a.t.at(-2)[a.t.at(-1)]=a.x.trim(),a.t.pop(),a.s='sel',a.x=''):x==';'?(a.t.at(-2)[a.t.at(-1)]=a.x.trim(),a.t.pop(),a.s='prop',a.x=''):a.x+=x
		}[a.s])(),a),{x:'',s:'sel',t:[{}]}).t[0]):(x.content&&(s.children=re({w:x.content,p:s,a:w.a}).w)),
		x.tag=='path'&&(s.vert=_=>s.attr.d.reduce((a,x)=>(
			({
				m:(x,r)=>a.v.push([[...(a.p=rsw(r,a.p,x))]]),
				l:(x,r)=>a.v.at(-1).push([...(a.p=rsw(r,a.p,x))]),
				h:(x,r)=>a.v.at(-1).push([...(a.p=[x[0]+(r&&a.p[0]),a.p[1]])]),
				v:(x,r)=>a.v.at(-1).push([...(a.p=[a.p[0],x[0]+(r&&a.p[1])])]),
				c:(x,r)=>(a.v.at(-1).push(...[...Array(splcnt)].map((_,t,{length:l})=>(t/=l-1,add(
					mul(a.p,(1-t)**3),
					mul(rsw(r,a.p,x.slice(0,2)),3*t*(1-t)**2),
					mul(rsw(r,a.p,x.slice(2,4)),3*t**2*(1-t)),
					mul(rsw(r,a.p,x.slice(4,6)),t**3)
				)))),a.p=rsw(r,a.p,x.slice(4,6))),
				// TODO: cssssss
				s:(x,r)=>(a.v.at(-1).push(...a.m.cmd=='c'?[...Array(splcnt)].map((_,t,{length:l})=>(t/=l-1,add(
					mul(a.p,(1-t)**3),
					mul(add(a.p,sub(a.m.arg.slice(4,6),a.m.arg.slice(2,4))),3*t*(1-t)**2),
					mul(rsw(r,a.p,x.slice(0,2)),3*t**2*(1-t)),
					mul(rsw(r,a.p,x.slice(2,4)),t**3)
				))):[[...rsw(r,a.p,x.slice(2,4))]]),a.p=rsw(r,a.p,x.slice(2,4))),
				q:(x,r)=>(a.v.at(-1).push(...[...Array(splcnt)].map((_,t,{length:l})=>(t/=l-1,add(
					mul(a.p,(1-t)**2),
					mul(rsw(r,a.p,x.slice(0,2)),2*t*(1-t)),
					mul(rsw(r,a.p,x.slice(2,4)),t**2)
				)))),a.p=rsw(r,a.p,x.slice(2,4))),
				// TODO: qtttttt
				t:(x,r)=>(a.v.at(-1).push(...a.m.cmd=='q'?[...Array(splcnt)].map((_,t,{length:l})=>(t/=l-1,add(
					mul(a.p,(1-t)**2),
					mul(add(a.p,sub(a.m.arg.slice(2,4),a.m.arg.slice(0,2))),2*t*(1-t)),
					mul(rsw(r,a.p,x.slice(0,2)),t**2)
				))):[[...rsw(r,a.p,x.slice(0,2))]]),a.p=rsw(r,a.p,x.slice(0,2))),
				a:(x,r_)=>((// https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
					_1=a.p,_2=rsw(r_,a.p,x.slice(5,7)),r=x.slice(0,2),fl=x[3],fs=x[4],
					t=x[2]*Math.PI/180,ct=Math.cos(t),st=Math.sin(t),
					_1d=(d=>[dot([ct,st],d),dot([-st,ct],d)])(mul(sub(_1,_2),.5)),
					cd=(
						(l=>1<l&&(r=mul(r,l**.5)))(_1d[0]**2/r[0]**2+_1d[1]**2/r[1]**2),
						mul(
							[r[0]*_1d[1]/r[1],-r[1]*_1d[0]/r[0]],
							((r,_1d)=>(fl!=fs||-1)*Math.max((r[0]*r[1]-r[0]*_1d[1]-r[1]*_1d[0])/(r[0]*_1d[1]+r[1]*_1d[0]),0)**.5)(mul(r,r),mul(_1d,_1d))
						)
					),
					c=add([dot([ct,-st],cd),dot([st,ct],cd)],mul(add(_1,_2),.5)),
					angle=(u,v)=>Math.atan2(u[0]*v[1]-u[1]*v[0],dot(u,v)),
					t1=angle([1,0],div(sub(_1d,cd),r)),
					dt=(t=>t+((!fs&&0<t)?-1:(fs&&t<0)?1:0)*2*Math.PI)(angle(div(sub(_1d,cd),r),div(sub(rev(_1d),cd),r)))
				)=>a.v.at(-1).push(...[...Array(splcnt)].map((_,t,{length:l})=>(t/=l-1,
					t=t1+dt*t,
					t=mul(r,[Math.cos(t),Math.sin(t)]),
					add([dot([ct,-st],t),dot([st,ct],t)],c)
				))))(),
				z:(x,r)=>a.v.at(-1).push([...(a.p=[...a.v.at(-1)[0]]),0]),
			}[x.cmd])(x.arg,x.rel),
			a.m=x,a
		),{p:[0,0],m:{},v:[[[0,0]]]}).v),
		a.push(s),a
	),[]),w.a.push(...w.w),w.w),a:w.a}:w)())({w,a:[]}),
	svg=parsed.attr,
	css=w=>(t=>k=>t.flat().reduce((a,x)=>a||x.tag=='style'?Object.entries(x.css).reduce((a,[s,p])=>a||(
		// TODO : selector parser
		1
	),0):(x.attr[k]||x.attr.style?.[k]),0))([...{[Symbol.iterator]:(c=w)=>({next:_=>({done:!c,value:c&&[c,...c.sibling.slice(0,c.i).reverse().filter(x=>x.tag=='style',c=c.parent)]})})}])
)=>(
	svg.width*=scale,svg.height*=scale,
	w=[...Array(svg.height)].map(_=>[...Array(svg.width)].map(_=>[255,255,255,255])),

	console.log({parsed}),
	flatten.filter(x=>x.tag=='path'&&![...x.ancients].find(x=>x.tag=='clipPath')).forEach((x,col,v2p)=>(
		// console.log(css(x)),
		col={
			stroke:hcol(x.attr.stroke)||x.attr.style&&hcol(x.attr.style.stroke)||[0,0,0,255],
			fill  :hcol(x.attr.fill  )||x.attr.style&&hcol(x.attr.style.fill  )||[0,0,0,0]
		},
		v2p=(c=>(x,i)=>(x-c[i].a)*c[i].b)([0,1,2].map(i=>({a:svg.viewBox[i],b:svg[['width','height'][i]]/(svg.viewBox[i+2]-svg.viewBox[i])}))),

		x.vert().forEach(p=>(
			p=p.map(x=>x.map(v2p)),
			2<p.length&&(b=>(// fill
				b={min:b.map(x=>Math.floor(Math.min(...x))),max:b.map(x=>Math.ceil(Math.max(...x)))},
				[b.w,b.h]=[0,1].map(i=>Math.ceil(b.max[i]-b.min[i])),
				b.a=p.reduce((a,w)=>(
					a.q=w,
					(({p:[px,py],q:[qx,qy]})=>(
						a.r={x:y=>(y-py)/(qy-py)*(qx-px)+px,y:[Math.min(py,qy),Math.max(py,qy)]},
						a.s=Math.sign(py-qy)
					))(a),
					a.s&&(a.w=a.w.map((_,y)=>(y+=b.min[1],Math.floor(a.r.y[0])<=y&&y<=Math.floor(a.r.y[1])?_.map((p,x)=>(x+=b.min[0],
						// FIXME : stripe bug | clipped y
						p+a.s*Math.max(0,Math.min(x-a.r.x(y+.5),1))*(y==(a.r.y[0]|0)?1-a.r.y[0]%1:1)*(y==(a.r.y[1]|0)?a.r.y[1]%1:1)
					)):_))),
					a.p=a.q,a
				),{p:p.at(-1),w:[...Array(b.h)].map(_=>Array(b.w).fill(0))}).w,
				console.log(col.fill,b.a),
				b.a.forEach((_,y)=>(
					_.forEach((s,x)=>col.fill[3]&&(
						w[y+b.min[1]][x+b.min[0]]=mix(
							w[y+b.min[1]][x+b.min[0]],
							col.fill,
							s//Math.max(0,Math.min(s,1))
						).map(x=>Math.max(0,Math.min(x|0,255)))
					))
				))
			))([0,1].map(i=>p.map(x=>x[i]))),
			p.map(x=>x.map(x=>Math.floor(x))).reduce((p,q,_q)=>(// stroke
				_q=q,
				[...Array(Math.max(Math.abs(q[0]-p[0]),Math.abs(q[1]-p[1])))].forEach((c,t,{length:l})=>(t/=l-1,isNaN(t)&&(t=0),
					c=mix(p,q,t).map(x=>Math.floor(x)),
					[...Array(4)].forEach((_,i)=>(
						i={x:c[0]-(i&1),y:c[1]-(i>>1)},
						w[i.y]&&w[i.y][i.x]&&(w[i.y][i.x]=col.stroke)
					))
				)),
				_q
			))
		))
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
	
))();

export{svg2png};
