import{HTML as d}from'../formats/html.mjs';
export default [
	{
		name:'404.html',
		buffer:d.doctype('html')+
		d.html({lang:'ja'},[
			d.head([
				d.meta({charset:'utf-8'}),
				d.meta({name:'viewport',content:'width=device-width,initial-scale=1'}),
				d.title('404')
			]),
			d.body([
				d.h1('404dayo')
			])
		])
	}
];
