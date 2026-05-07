#!/usr/bin/env -S bun --install=force
import Color from'colorjs.io';

const
{n:[n=6],c:[a='#6ca',w='#ffd',k='#223']}=Bun.argv.slice(2).reduce((a,x)=>(
	Bun.color(x)?a.c.push(x):+x?a.n.push(+x):0,
	a
),{n:[],c:[]}),
wa=Bun.color(w,'ansi'),
ka=Bun.color(k,'ansi'),
plte=[...Array(n)].map((x,i)=>(x=new Color(a),x.oklch.h+=360/n*i,x)),
rst='\x1b[0m',bld='\x1b[1m',
f2b=x=>x.replace('[38','[48'),
rhex=x=>`#${x.srgb.map((x,i)=>Math.round(x*15).toString(16)).join('')}`,
pad=(x,l=8)=>`${x}`.padStart(l);

Bun.stdout.write(plte.flatMap((x,{xc,xa})=>(
	x=rhex(x),
	xc=new Color(x),
	xa=Bun.color(x,'ansi'),
	[
		bld,
		f2b(xa),
		wa,pad(x),
		ka,pad(x),
		xa,
		f2b(wa),pad(xc.contrastAPCA(w).toFixed(2)),
		f2b(ka),pad(xc.contrastAPCA(k).toFixed(2)),
		rst,'\n'
	]
)).join(''))
