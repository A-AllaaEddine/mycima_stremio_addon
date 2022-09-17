const axios = require('axios');
const parser = require('fast-html-parser');
const Host = 'https://mycima.fun';

async function axiosData() {
    const promise = await axios.get(Host);
    const parsed = parser.parse(promise.data);
    //console.log(parsed.querySelectorAll('.fullClick'))
    return parsed;
} 

async function search(type, query) {
    try{
        let URL = `${Host}/search?s=${query}`;
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
            if (id === null){
                var URL = `${Host}/movies`;
            }
            else if (id === 'best'){
                var URL = `${Host}/movies/best`;
            }
            else if (id === 'old') {
                var URL = `${Host}/movies/old`;
            }
            else if (id === 'top') {
                var URL = `${Host}/movies/top`;
            }
            
            var res = encodeURI(URL);
            let promise = (await axios.get(res)).data;
            let parsed = parser.parse(promise).querySelector('.Grid--MycimaPosts').querySelectorAll('.GridItem');
            //console.log(parsed);
            return parsed.map( (movie) => {
                return {
                    id: movie.querySelector('a').rawAttributes['title'].toString(),
                    type: 'movie',
                    title : movie.querySelector('a').rawAttributes['title'].toString(),
                    released: movie.querySelector('.year').rawText.toString(),
                    poster : movie.querySelector('.BG--GridItem').rawAttributes['data-lazy-style'].replace(/\(|\)|;|--image:url/g, ''),
                }
                
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


module.exports = {
    axiosData,
    search,
    catalog,
    meta
};