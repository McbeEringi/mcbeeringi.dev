import{HTML as d}from'../../formats/html.mjs';
export default [
	{
		name:'/test/index.html',
		buffer:d.doctype('html')+
		d.html({lang:'ja'},[
			d.head([
				d.meta({charset:'utf-8'}),
				d.meta({name:'viewport',content:'width=device-width,initial-scale=1'}),
				d.title('test')
			]),
			d.body([
				'trailing slash?'
			])
		])
	}
];
