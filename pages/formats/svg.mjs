import{elem}from'./xml.mjs';

const
SVG=`a,animate,animateMotion,animateTransform,circle,clipPath,defs,desc,ellipse,
feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,
feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,
feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,
g,image,line,linearGradient,marker,mask,metadata,mpath,
path,pattern,polygon,polyline,radialGradient,rect,script,set,stop,style,switch,symbol,text,textPath,title,tspan,use,view
`.match(/\w+/g).reduce((a,x)=>(
	a[x]=elem({tag:x}),
	a
),{
	svg:(...w)=>elem({tag:'svg'})({xmlns:'http://www.w3.org/2000/svg'},...w)
});

export{elem}from'./xml.mjs';
export{SVG};