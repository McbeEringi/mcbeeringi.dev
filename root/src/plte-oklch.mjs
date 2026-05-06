#!/usr/bin/env -S bun --install=force
import{colordx,extend}from'@colordx/core';
import a11y from '@colordx/core/plugins/a11y';

extend([a11y]);
const
{n:[n=6],c:[a='#6ca',w='#ffd',k='#223']}=Bun.argv.slice(2).reduce((a,x)=>(
	Bun.color(x)?a.c.push(x):+x?a.n.push(+x):0,
	a
),{n:[],c:[]}),
wa=Bun.color(w,'ansi'),
ka=Bun.color(k,'ansi'),
plte=[...Array(n)].fill(
	colordx(a).toOklch()
).map((x,i)=>colordx({...x,h:x.h+360/n*i})),
rst='\x1b[0m',bld='\x1b[1m',
f2b=x=>x.replace('[38','[48'),
rhex=x=>`#${Object.values(x.toRgb()).map((x,i)=>(i<3?Math.round(x/17):x*15).toString(16)).join('')}`,
	pad=(x,l=8)=>x.padStart(l);

Bun.stdout.write(plte.flatMap((x,{xc,xa})=>(
	x=rhex(x),
	xc=colordx(x),
	xa=Bun.color(x,'ansi'),
	[
		bld,
		f2b(xa),
		wa,pad(x),
		ka,pad(x),
		xa,
		f2b(wa),pad(xc.readableScore(w)),
		f2b(ka),pad(xc.readableScore(k)),
		rst,'\n'
	]
)).join(''))
