const { addonBuilder } = require("stremio-addon-sdk")
const index= require('./index');

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
	"id": "community.CimaClubAddon",
	"version": "0.0.1",
	"catalogs": [
		{
			"type": "movie",
			"id": ""
		},
		{
			"type": "movie",
			"id": "top",
			"extra":
            [{
                    "name": "search",
                    "isRequired": true
                }
            ]
		},
		{
			"type": "movie",
			"id": "best"
		},
		{
			"type": "movie",
			"id": "old"
		}
	],
	"resources": [
		"catalog",
		"stream",
		"meta"
	],
	"types": [
		"movie",
		"series"
	],
	"name": "CimaClubAddon",
	"description": "an Addon for Cima-Club.bar"
}
const builder = new addonBuilder(manifest)

builder.defineCatalogHandler((args) => {
	console.log("request for catalogs: ", args)
	if (args.extra.search){
		return Promise.resolve(index.search(args.type, args.extra.search))
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
	if (args.type === "movie"){
		return Promise.resolve(index.meta(args.type, args.id))
		.then((meta) => ({meta : meta}));
	}
	else {
		return Promise.resolve({ meta : null});
	}
})



builder.defineStreamHandler(({type, id}) => {
	console.log("request for streams: "+type+" "+id);
	if (type === "movie" && id === "tt1254207") {
		// serve one stream to big buck bunny
		const stream = { url: "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4" }
		return Promise.resolve({ streams: [stream] })
	}

	// otherwise return no streams
	return Promise.resolve({ streams: [] })
})

module.exports = builder.getInterface()