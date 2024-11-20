const
elem=({tag,type})=>(...arg)=>(
	arg=arg.reduce((a,x)=>(
		Array.isArray(x)?
		a.x+='\n'+x.join(''):
		typeof x=='object'?Object.assign(a.attr,x):a.x+=x,
		a
	),{attr:{},x:''}),
	arg.attr=Object.entries(arg.attr).reduce((a,[i,x])=>a+` ${i}="${x}"`,''),
	({
		normal:_=>`<${tag}${arg.attr}>${arg.x}</${tag}>\n`,
		void:_=>`<${tag}${arg.attr}>\n`,
		empty:_=>arg.x?`<${tag}${arg.attr}>${arg.x}</${tag}>\n`:`<${tag}${arg.attr}/>\n`,
		proc:_=>`<?${tag}${arg.attr}?>\n`,
		marked:_=>`<![${tag}[${arg.x}]]>\n`,
		dtd:_=>`<!${tag} ${arg.x}>\n`
	})[type||'empty']()
);

export{elem};