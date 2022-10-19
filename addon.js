const { addonBuilder } = require("stremio-addon-sdk")
const index= require('./index');

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = require('./manifest.json')
const builder = new addonBuilder(manifest)

builder.defineCatalogHandler((args) => {
	console.log("request for catalogs: ", args)
	if (args.extra.search){
		return Promise.resolve(index.search(args.type, args.extra.search))
		.then ((metas) => ({metas: metas}))
	}
	else if (args.extra.genre) {
		return Promise.resolve(index.catalog(args.type, args.id, args.extra.genre))
		.then ((metas) => ({metas: metas}))
	}
	else {
		return Promise.resolve(index.catalog(args.type, args.id))
		.then ((metas) => ({metas: metas}))
	}
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
	
})


builder.defineMetaHandler((args) => {
	console.log("request for meta: "+args.type+" "+args.id);
	if (args.type == 'movie'){
		return Promise.resolve(index.meta(args.type, args.id))
		.then((meta) => ({meta : meta}));
	}
	else if (args.type == 'series'){
		return Promise.resolve(index.meta(args.type, args.id))
		.then((meta) => ({meta : meta}));
	}
	else {
		console.log('meta reject');
		return Promise.resolve({ meta : [] });
	}
})



builder.defineStreamHandler((args) => {
	console.log("request for streams: "+args.type+" "+args.id);
	if (args.type == 'movie') {
		return Promise.resolve(index.stream(args.type,args.id))
		.then((streams) => ({  streams: streams}));
	}
	else if (args.type == 'series'){
		return Promise.resolve(index.stream(args.type,args.id))
		.then((streams) => ({  streams: streams}));
	}
	// else if (args.type == 'series') {
	// 	return Promise.resolve(index.stream(args.type,args.id))
	// 	.then((streams) => ({  streams: streams}));
	// }
	else {
		console.log('stream reject');
  		return Promise.resolve({ streams: [] });
	}
})

module.exports = builder.getInterface()