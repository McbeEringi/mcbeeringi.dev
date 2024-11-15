const
elem=({tag,is_void})=>(...arg)=>(
	arg=arg.reduce((a,x)=>(
		Array.isArray(x)?
		a.x+='\n'+x.join(''):
		typeof x=='object'?Object.assign(a.attr,x):a.x+=x,
		a
	),{attr:{},x:''}),
	arg.attr=Object.entries(arg.attr).reduce((a,[i,x])=>a+` ${i}="${x}"`,''),
	`<${tag}${arg.attr}>${is_void?'':`${arg.x}</${tag}>`}\n`
),

HTML=`html,
#base,head,#link,#meta,style,title,
body,
address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,main,nav,section,search,
blockquote,dd,div,dl,dt,figcaption,fiigure,#hr,li,menu,ol,p,pre,ul,
a,abbr,b,bdi,dbo,#br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,#wbr,
#area,audio,#img,map,#track,video,
#embed,fencedframe,iframe,object,picture,portal,#source,
svg,math,
canvas,noscript,script,
del,ins,
caption,#col,colgroup,table,tbody,td,tfoot,th,thead,tr,
button,datalist,fieldset,form,#input,label,legend,meter,optgroup,option,output,progress,select,textarea,
details,dialog,summary,
slot,template
`.match(/#?\w+/g).reduce((a,x)=>(
	x={tag:x[0]=='#'?x.slice(1):x,is_void:x[0]=='#'},
	a[x.tag]=elem(x),
	a
),{
	doctype:(w='html')=>`<!DOCTYPE ${w}>\n`,
	custom:elem
});

export{elem,HTML};