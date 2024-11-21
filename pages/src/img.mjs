import{svg,png}from'../templates/icon.mjs';

export default {
	'icon.svg':svg(),
	'icon_.svg':svg({bg:0}),
	'icon!.svg':svg({fg:'#fff',bg:'#222'}),
	'icon!_.svg':svg({fg:'#fff',bg:0}),
	'icon.png':await png(),
	'icon_.png':await png({bg:0}),
	'icon!.png':await png({fg:0xffffffff,bg:0x222222ff}),
	'icon!_.png':await png({fg:0xffffffff,bg:0}),
};