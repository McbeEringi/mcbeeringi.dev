import{HTML as d,tmpl}from'../formats/html.tmpl.mjs';

export default tmpl({title:'index',root:''},[
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
]);
