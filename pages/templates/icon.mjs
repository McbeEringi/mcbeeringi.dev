import{SVG as d}from'../formats/svg.mjs';
import{unpng,plte_trns,blend}from'../formats/png.mjs';

const
svg=({bg='#fff',fg='#000'}={})=>new Blob([d.svg({width:512,height:512,viewBox:[0,0,64,64]},[
	d.style(`
		.f,.s{stroke-dasharray:49 49;stroke:${fg};stroke-linecap:round;stroke-linejoin:round;stroke-width:1;animation:anm 1s;}
		.f{stroke-width:0;opacity:.5;}
		@keyframes anm{0%{stroke-dashoffset:-49;}0%,80%{fill:none;stroke-width:inherit;}80%{stroke-dashoffset:0;}}
	`),
	bg?d.path({fill:bg,d:'M0,0v64h64v-64z'}):'',
	d.path({fill:'#6ca',class:'f',d:'M47,48c-1-1,2-2,3-1c5,5-17,11-9,7c6-3,7-5,6-6z'}),
	d.path({fill:'#888',class:'f',d:'M52,28c2,2,4,7,2,8m-5-13c1,2-4,2-5,2m-29,1c0-2,4-7,6-5m25,1c2,2-6,3-9,2'}),
	d.path({fill:'none',class:'s',d:'M52,46c9-16-2-18-2-25m-17-6c-29,1-27,34-17,30m36-2c6,3,9-20-10-25m-14,28c-3,5,2,5,1,3m11-10c0,0-1,1,0,5m-12-5c0,0-1,2,0,5m17-6c-2-2-8-2-7-1m-16,3c-1-1,3-4,7-4m8-22c-10-2-25,6-23,14m32,4c7,4,2,4,7,9m-25-12c-8,0-15,8-12,12m31-11c-4,1-10,0-11-1m-15-9c-2-3-16,6-13,19m23-24c4-15,11-9,4-4m13,11c0-4-13-10-22-4m1,10c-4,5,4,3,8-2'})
])],{type:'image/svg+xml'}),
png=async({fg=0x000000ff,bg=0xffffffff}={})=>(
	fg=[fg,0x66ccaa80,0x88888880],
	new Blob(unpng(await Bun.file('assets/icon.png').bytes()).flatMap(x=>(
		x.name=='PLTE'?
			plte_trns([
				...fg.flatMap(x=>[...Array(4)].flatMap((_,i,{length:l})=>blend(x,bg,1-i/l).reduce((a,x)=>a<<8|x))),
				bg
			])
		:x.bin
	)),{type:'image/png'})
);


export{svg,png};
