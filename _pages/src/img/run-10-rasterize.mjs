#!/usr/bin/env -S bun



((
	w,
	svg=[...w.match(/<svg.*?>/s)[0].matchAll(/(?<k>[\w-]+)="(?<v>.*?)"/g)].reduce((a,{groups:x})=>(a[x.k]=x.v,a),{}),
	css=[...[...w.match(/(?<=<style>).+(?=<\/style>)/sg)??[]].join('')].reduce((a,x)=>(({
		query:_=>x=='{'?(a.t.push(a.t.at(-1)[a.x.trim()]={}),a.s='sel',a.x=''):
			a.x+=x,
		sel:_=>x=='}'?(a.t.pop(),a.s='query'):
			x=='@'?(a.x+=x,a.s='query'):
			x=='{'?(a.t.push(a.t.at(-1)[a.x.trim()]={}),a.s='prop',a.x=''):
			a.x+=x,
		prop:_=>x=='}'?(a.t.pop(),a.s='sel'):
			x==':'?(a.t.push(a.x.trim()),a.s='val',a.x=''):
			a.x+=x,
		val:_=>x=='}'?(a.t.at(-2)[a.t.at(-1)]=a.x.trim(),a.t.pop(),a.s='sel',a.x=''):
			x==';'?(a.t.at(-2)[a.t.at(-1)]=a.x.trim(),a.t.pop(),a.s='prop',a.x=''):
			a.x+=x
	}[a.s])(),a),{x:'',s:'sel',t:[{}]}).t[0],
	path=(w.match(/<path(\s+[\w-]+=".*?")*\/>/sg)??[]).map(x=>[
		...x.matchAll(/(?<k>[\w-]+)="(?<v>.*?)"/g)
	].reduce((a,{groups:x})=>(a[x.k]=x.k=='d'?[...x.v,0].reduce((a,x)=>(
		/[mlhvcsqtaz]/i.test(x)||!x?(
			a.x=[...a.x.slice(0,-1),+a.x.at(-1)].slice(1),
			(l=>l&&a.a.push(...[...Array(Math.max(Math.ceil(a.x.length/l),1))].map((_,i)=>({
				cmd:a.s,
				arg:a.x.slice(i*l||0,++i*l)
			}))))({m:2,l:2,h:1,v:1,c:6,s:4,q:4,t:2,a:7,z:1/0}[a.s.toLowerCase()]),
			a.s=x,a.x=[]
		):(isNaN(a.x.at(-1)+x+0)?a.x=[...a.x.slice(0,-1),+a.x.at(-1),x==','?'':x]:a.x[a.x.length-1]+=x),
		a
	),{x:[],s:'',a:[]}).a.slice(1):x.v,a),{}))
)=>(
	console.log(svg,css,...path),
))(await Bun.file("icon.svg").text())
