import{unpng,ch}from'../formats/png.mjs';

export default new Blob([].concat(...unpng(await Bun.file('assets/icon.png').bytes()).map(x=>(
	x.name=='PLTE'?[
		ch([80,76,84,69,...[
			0x00ffff,0x40ffff,0x80ffff,0xc0ffff,
			0xff00ff,0xff40ff,0xff80ff,0xffc0ff,
			0xffff00,0xffff40,0xffff80,0xffffc0,
			0xffffff
		].flatMap(x=>[x>>16&255,x>>8&255,x&255])])		
	]:x.bin
))))
