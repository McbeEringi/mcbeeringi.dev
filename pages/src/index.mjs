import{HTML as d}from'../formats/html.mjs';

export default new Blob([
	d.doctype(),
	d.html({lang:'ja'},[
		d.head([
			d.meta({charset:'utf-8'}),
			d.meta({name:'viewport',content:'width=device-width,initial-scale=1'}),
			d.title('Document')
		]),
		d.body([
			d.h1('Hello world!'),
			d.p(['aaa','eee']),
			d.br(),
			d.img({src:'favicon.ico'})
		])
	])
]);
