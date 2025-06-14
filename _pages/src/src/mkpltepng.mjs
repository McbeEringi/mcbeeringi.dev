const
mkpltepng=w=>((
	crc=(t=>(buf,crc=0)=>~buf.reduce((c,x)=>t[(c^x)&0xff]^(c>>>8),~crc))([...Array(256)].map((_,n)=>[...Array(8)].reduce(c=>(c&1)?0xedb88320^(c>>>1):c>>>1,n))),// https://www.rfc-editor.org/rfc/rfc1952
	adler=data=>{let a=1,b=0,len=data.length,tlen,i=0;while(len>0){len-=(tlen=Math.min(1024,len));do{b+=(a+=data[i++]);}while(--tlen);a%=65521;b%=65521;}return(b<<16)|a;},
	be4=x=>[x>>>24&255,x>>>16&255,x>>>8&255,x>>>0&255],ch=x=>[...be4(x.length-4),...x,...be4(crc(x))],
)=>new Uint8Array([
	137,80,78,71,13,10,26,10,// header
	...ch([73,72,68,82, ...be4(w.length), 0,0,0,1, 8,3, 0,0,0]),// IHDR: w h bitDepth colType 0,0,0
	...ch([80,76,84,69,...w.flatMap(x=>be4(x>>>8).slice(1))]),// PLTE
	...ch([116,82,78,83,...w.map(x=>x&255)]),// tRNS
	...ch([73,68,65,84, 8,29, ...((x,l=w.length+1)=>[1,l>>>0&255,l>>>8&255,~l>>>0&255,~l>>>8&255,...x,...be4(adler(x))])(
		[0,...Array(w.length).keys()]
	)]),// DATA
	0,0,0,0,73,69,78,68,174,66,96,130// IEND
]))();
	

export{mkpltepng};
