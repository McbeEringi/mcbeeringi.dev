const
unpng=w=>[{bin:[w.slice(0,8)]},...{[Symbol.iterator]:(
	p=8
)=>({next:v=>w.length<=p?{done:1}:(v={},v.bin=[
	(x=>(v.length=[...x].reduce((a,x)=>a<<8|x),x))(w.slice(p,p+=4)),
	(x=>(v.name=String.fromCharCode(...x),x))(w.slice(p,p+=4)),
	w.slice(p,p+=v.length),
	w.slice(p,p+=4),
],{value:v})})}],
ch=x=>((
	crc=(t=>(buf,crc=0)=>~buf.reduce((c,x)=>t[(c^x)&0xff]^(c>>>8),~crc))([...Array(256)].map((_,n)=>[...Array(8)].reduce(c=>(c&1)?0xedb88320^(c>>>1):c>>>1,n))),// https://www.rfc-editor.org/rfc/rfc1952
	be4=x=>[x>>>24&255,x>>>16&255,x>>>8&255,x>>>0&255],
)=>new Uint8Array([...be4(x.length-4),...x,...be4(crc(x))]))()

export{unpng,ch};