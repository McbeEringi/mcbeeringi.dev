import{HTML as d}from'../formats/html.mjs';


export default new Blob([
	d.doctype('html'),
	d.html({lang:'ja'},[
		d.head([
			d.meta({charset:'utf-8'}),
			d.meta({name:'viewport',content:'width=device-width,initial-scale=1'}),
			d.title('index')
		]),
		d.body([
			d.h1('mcbeeringi.dev'),
			d.h2('WIP...'),
			'フレームワーク、諸説ある',d.br(),
			'/ == pages.mcbeeringi.dev',d.br(),
			d.a({href:"/petit/"},'/petit/ == petit.mcbeeringi.dev'),d.br(),
			d.a({href:"/dotfiles/"},'/dotfiles/ == dotfiles.mcbeeringi.dev'),d.br(),
			d.a({href:"/ghp/"},'/ghp/ == mcbeeringi.github.io'),d.br(),
			d.br(),
			d.a({href:"//api.mcbeeringi.dev"},'api.mcbeeringi.dev'),d.br(),
		
			d.script(`(${()=>{
				console.log('hello',self);
			}})();`)
		])
	])
]);
