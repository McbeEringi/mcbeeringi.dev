#!/usr/bin/env -S bun



((
	w,
	svg=[...w.match(/<svg.*?>/s)[0].matchAll(/(?<k>[\w-]+)="(?<v>.*?)"/g)].reduce((a,{groups:x})=>(a[x.k]=x.v,a),{}),
	css=[...[...w.match(/(?<=<style>).+(?=<\/style>)/sg)??[]].join('')].reduce((a,x)=>(
		({
			query:_=>x=='{'?(a.t.push(a.t.at(-1)[a.x.trim()]={}),a.s='sel',a.x=''):
				a.x+=x,
			sel:_=>x=='}'?(a.t.pop(),a.s='query'):
				x=='@'?(a.x+=x,a.s='query'):
				x=='{'?(a.t.push(a.t.at(-1)[a.x.trim()]={}),a.s='prop',a.x=''):
				a.x+=x,
			prop:_=>x=='}'?(a.t.pop(),a.s='sel'):
				x==':'?(a.t.push(a.x.trim()),a.s='val',a.x=''):
				a.x+=x,
			val:_=>x==';'?(a.t.at(-2)[a.t.at(-1)]=a.x.trim(),a.t.pop(),a.s='prop',a.x=''):
				a.x+=x
		}[a.s])(),
		a
	),{x:'',s:'sel',t:[{}]}).t[0],
	path=(w.match(/<path(\s+[\w-]+=".*?")*\/>/sg)??[]).map(x=>[
		...x.matchAll(/(?<k>[\w-]+)="(?<v>.*?)"/g)
	].reduce((a,{groups:x})=>(a[x.k]=x.k=='d'?[...x.v,'_'].reduce((a,x)=>(
		/[A-z_]/.test(x)?(
			a.path.push({cmd:a.state,arg:a.window}),
			a.state=x,a.window=''
		):(
			a.window+=x
		),
		a
	),{window:'',state:'',p:[0,0],path:[]}).path.slice(1):x.v,a),{}))
)=>(
	console.log(svg),
	console.log(css),
	console.log(path[0])
))(await Bun.file("icon.svg").text())
