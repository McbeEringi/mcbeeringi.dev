Bun.serve({
	async fetch(req){return new Response(new Blob([JSON.stringify({
		method:req.method,
		url:req.url,
		headers:req.headers,
		body:req.body&&await req.body.text()
	},0,'\t')],{type:'application/json'}))
;},
});
