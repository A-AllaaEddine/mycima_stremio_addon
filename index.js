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
        let Query = query.replace(/\s/g,'-').toString()
        let URL = `${Host}/search/${Query[0].toUpperCase()+ Query.slice(1).toLowerCase()}`;
        //console.log(URL);
        var res = encodeURI(URL);
        const  promise = (await axios.get(res)).data;
        let parsed = parser.parse(promise).querySelector('.Grid--MycimaPosts').querySelectorAll('.GridItem');
        if (type === 'movie') {
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
        }
    }
    catch(error) {
        console.log(error);
    }
}


//search('movie', 'avengers');

async function catalog (type, id) {
    try {
        let Type;
        if(type === 'movie') {
            Type = type;
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
            
            

        }
        else if (type === 'series') {
            Type = type;
            if (id === "MCseries-New"){
                var URL = `${Host}/seriestv/new`;
            }
            else if (id === "MCseries-Best"){
                var URL = `${Host}/seriestv/best`;
            }
            else if (id === "MCseries-Old") {
                var URL = `${Host}/seriestv/old`;
            }
            else if (id === "MCseries-Top") {
                var URL = `${Host}/seriestv/top`;
            }
        }
        var res = encodeURI(URL);
            let promise = (await axios.get(res)).data;
            let parsed = parser.parse(promise).querySelector('.Grid--MycimaPosts').querySelectorAll('.GridItem');
            //console.log(parsed);
            return parsed.map( (movie) => {
                let cat = {
                    id: movie.querySelector('a').rawAttributes['title'].toString(),
                    type: Type,
                    title : movie.querySelector('a').rawAttributes['title'].toString(),
                    poster : movie.querySelector('.BG--GridItem').rawAttributes['data-lazy-style'].replace(/\(|\)|;|--image:url/g, ''),
                }
                if (movie.querySelector('.year')) {
                    cat.released = movie.querySelector('.year').rawText.toString();
                }
                //console.log(cat);
                return cat;
                
            })
    }
    catch(error) {
        console.log(error);
    }
}

//catalog('series', 'MCseries-New');

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
            //console.log(test[1]);
            if (test[1]){
                return test[1].replace(/\//g, '').toString();
            }
        }
    });

    let genre = [];
    
    genre = genres.filter( (elem) => {
        return elem !== undefined;
    })

    console.log(genre);
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


//meta ('movie', 'مشاهدة-فيلم-sharmaji-namkeen-2022-مترجم')



async function stream (type, id) {
    if (type === 'movie'){
        var URL = `${Host}/watch/${id.replace(/ /g, '-')}`;
    }
    //console.log(URL);
    var res = encodeURI(URL);
    let promise = (await axios.get(res)).data;
    let parsed = parser.parse(promise).querySelector('.List--Download--Mycima--Single').querySelectorAll('a');
    //console.log(parsed);

    return parsed.map( stream => {
        return Url = {
            url: stream.rawAttributes['href'],
            name: stream.querySelector('resolution').rawText
        }

    })
}



//stream('movie', 'مشاهدة-فيلم-avengers-infinity-war-2018-مترجم');


module.exports = {
    axiosData,
    search,
    catalog,
    meta,
    stream
};