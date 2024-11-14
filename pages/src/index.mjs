import{}from'../html.mjs';

export default new Blob([
	doctype(),
	html({lang:'ja'},[
		head([
			meta({charset:'utf-8'}),
			title('Document')
		]),
		body([
			h1('Hello world!')
		])
	])
]);
