import{unpng}from'../formats/png.mjs';
console.log(
	unpng(await Bun.file('assets/icon.png').bytes())
);
export default Bun.file('assets/icon.png');
