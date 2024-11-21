const
unpng=w=>[{bin:[w.slice(0,8)]},...{[Symbol.iterator]:(
	p=8
)=>({next:v=>w.length<=p?{done:1}:(v={},v.bin=[
	(x=>(v.length=[...x].reduce((a,x)=>a<<8|x),x))(w.slice(p,p+=4)),
	(x=>(v.name=String.fromCharCode(...x),x))(w.slice(p,p+=4)),
	w.slice(p,p+=v.length),
	w.slice(p,p+=4),
],{value:v})})}],
be4=x=>[x>>>24&255,x>>>16&255,x>>>8&255,x>>>0&255],

ch=x=>((
	crc=(t=>(buf,crc=0)=>~buf.reduce((c,x)=>t[(c^x)&0xff]^(c>>>8),~crc))([...Array(256)].map((_,n)=>[...Array(8)].reduce(c=>(c&1)?0xedb88320^(c>>>1):c>>>1,n)))// https://www.rfc-editor.org/rfc/rfc1952
)=>new Uint8Array([...be4(x.length-4),...x,...be4(crc(x))]))(),
plte_trns=w=>[ch([80,76,84,69,...w.flatMap(x=>be4(x).slice(0,3))]),w.every(x=>(x&255)==255)?'':ch([116,82,78,83,...w.map(x=>x&255)])],
blend=(a,b,x)=>(
	[a,b]=[a,b].map(x=>(x=be4(x).map(x=>x/255),{rgb:x.slice(0,3),a:x[3]})),a.a*=x,
	(
		b.a?
		(([b,c],d)=>d?[...b.map((x,i)=>x+c[i]*(1-a.a)),d]:[0,0,0,d])([a,b].map(x=>x.rgb.map(y=>y*x.a)),a.a+b.a*(1-a.a)):
		[...a.rgb,a.a]
	).map(x=>x*255|0)
);

export{unpng,ch,plte_trns,blend};