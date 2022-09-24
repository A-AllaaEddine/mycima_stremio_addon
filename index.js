const axios = require('axios');
const parser = require('fast-html-parser');
const Host = 'https://mycimaa.fun';


client = axios.create({
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"
            }
        });

async function axiosData() {
    const promise = await axios.get(Host);
    const parsed = parser.parse(promise.data);
    //console.log(parsed.querySelectorAll('.fullClick'))
    return parsed;
} 

async function search(type, query) {
    try{
        let URL = `${Host}/search/${query}`;
        //console.log(URL);
        const  promise = await axios.get(URL);
        const parsed  =parser.parse(promise.data);
        const links = parsed.querySelectorAll('.fullClick');
        //console.log(links)
    }
    catch(error) {
        console.log(error);
    }
}

//const metas = [];
async function catalog (type, id) {
    try {
        if(type === 'movie') {
            if (id === "MCmovies-New"){
                var URL = `${Host}/movies`;
            }
            else if (id === "MCmovies-Best"){
                var URL = `${Host}/movies/best`;
            }
            else if (id === "MCmovies-Old") {
                var URL = `${Host}/movies/old`;
            }
            else if (id === "MCmovies-Top") {
                var URL = `${Host}/movies/top`;
            }
            
            var res = encodeURI(URL);
            let promise = (await axios.get(res)).data;
            let parsed = parser.parse(promise).querySelector('.Grid--MycimaPosts').querySelectorAll('.GridItem');
            //console.log(parsed);
            return parsed.map( (movie) => {
                let cat = {
                    id: movie.querySelector('a').rawAttributes['title'].toString(),
                    type: 'movie',
                    title : movie.querySelector('a').rawAttributes['title'].toString(),
                    poster : movie.querySelector('.BG--GridItem').rawAttributes['data-lazy-style'].replace(/\(|\)|;|--image:url/g, ''),
                }
                if (movie.querySelector('.year')) {
                    cat.released = movie.querySelector('.year').rawText.toString();
                }
                return cat;
                
            })

            //return metas;
        }
    }
    catch(error) {
        console.log(error);
    }
}

//catalog('movie', 'top');

async function meta (type, id) {
    if (type === 'movie'){
        var URL = `${Host}/watch/${id.replace(/ /g, '-')}`;
    }
    //console.log(URL);
    var res = encodeURI(URL);
    let promise = (await axios.get(res)).data;
    let parsed = parser.parse(promise);


    let title = parsed.querySelector('.Title--Content--Single-begin').querySelector('h1').rawText.toString();
    let tyPe = type;
    let description = parsed.querySelector('.StoryMovieContent').rawText.toString();

    let bg = parsed.querySelector('.separated--top').rawAttributes['data-lazy-style'].replace(/\(|\)|;|--img:url/g, '');
    
    //console.log(bg);

    let genres = parsed.querySelector('.Terms--Content--Single-begin').querySelectorAll('a')
    .map( (genre) => { 
        return genre.rawAttributes['href'].toString();})
    .map(gen => {
        if (gen.includes('genre')){
            let test = gen.split('-');
            return test[1].replace(/\//g, '').toString();
        }
    });

    let genre = [];
    
    genre = genres.filter( (elem) => {
        return elem !== undefined;
    })

    //console.log(genre);
    return metaObj ={
        id: id,
        name: title,
        posterShape: 'poster',
        type: tyPe,
        genre: genre,
        poster: bg,
        background: bg,
        description: description
    }



    //console.log(metaObj);
}


//meta ('movie', 'مشاهدة-فيلم-ginny-weds-sunny-2020-مترجم')



async function stream (type, id) {
    if (type === 'movie'){
        var URL = `${Host}/watch/${id.replace(/ /g, '-')}`;
    }
    //console.log(URL);
    var res = encodeURI(URL);
    let promise = (await axios.get(res)).data;
    let parsed = parser.parse(promise);
    let URLs = parsed.querySelector('.WatchServersList').querySelectorAll('btn');
    //console.log(URLs);

    var urls = [];
    urls = URLs.map(url => {
        let htmlResLink = url.rawAttributes['data-url'].toString();
        return {
            url: htmlResLink,
            name: url.querySelector('strong').rawText.toString()
        };
        
    })
    //console.log(urls);
    let Links;
    
    for (i = 0; i < urls.length; i++) {
        if (urls[i].name === 'uqload.com'){
            var link1;
            let prom = (await axios.get(urls[i].url)).data;
            let parsed = parser.parse(prom, {script: true});
            let url = parsed.querySelectorAll('script');
            url.map( scr => {
                let children = scr.rawText;
                var expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})mp4/gi;
                var match = children.match(expression);
                if (match) {
                    link1 = {
                        url: match.toString().replace(/[\[\]']+/g, ''),
                        name: urls[i].name.toString(),
                        behaviorHints:{
                            notWebReady: true,
                            proxyHeaders:{ "request": { "Referer": "https://uqload.com/" , "Sec-Fetch-Mode": "no-cors" } }}
                    }
                    //console.log(link1);
                }
                //console.log(match);
            })
        }

        Links = [
            link1
        ];
    }
    
    //console.log(Links);
    return Links

    
    //return URLs.map(url => {
    //     return { 
    //         url : url.rawAttributes['data-url'].toString(),
    //         name: url.querySelector('strong').rawText.toString(),
    //     }
    //})
    
}



//stream('movie', 'مشاهدة-فيلم-ginny-weds-sunny-2020-مترجم');


module.exports = {
    axiosData,
    search,
    catalog,
    meta,
    stream
};