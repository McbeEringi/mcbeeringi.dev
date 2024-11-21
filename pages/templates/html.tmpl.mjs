import{HTML as d}from'../formats/html.mjs';

const
tmpl=({title,root},w)=>new Blob([
	d.doctype('html')+
	d.html({lang:'ja'},[
		d.head([
			d.meta({charset:'utf-8'}),
			d.meta({name:'viewport',content:'width=device-width,initial-scale=1'}),
			d.title(title),
			d.link({rel:'stylesheet',href:root+'src/style.css'})
		]),
		d.body(w)
	])
],{type:'text/html'});

export * from'../formats/html.mjs';
export{tmpl};