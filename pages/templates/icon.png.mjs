import{unpng,plte_trns,blend}from'../formats/png.mjs';

const
icon=async({fg=0x000000ff,bg=0xffffffff}={})=>(
	fg=[fg,0x66ccaa80,0x88888880],
	new Blob(unpng(await Bun.file('assets/icon.png').bytes()).flatMap(x=>(
		x.name=='PLTE'?
			plte_trns([
				...fg.flatMap(x=>[...Array(4)].flatMap((_,i,{length:l})=>blend(x,bg,1-i/l).reduce((a,x)=>a<<8|x))),
				bg
			])
		:x.bin
	)))
);


export{icon};
