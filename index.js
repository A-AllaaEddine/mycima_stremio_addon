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
            let metas = [];
            parsed.forEach( (movie) => {
                //const released: {movie.querySelector('.year')!= null ? movie.querySelector('.year').rawText : null};
                metas = {
                    id: movie.rawAttributes['cpd'],
                    title : movie.querySelector('a').rawAttributes['title'],
                    released: movie.querySelector('.year').rawText,
                    thumbnail : movie.querySelector('.BG--GridItem').rawAttributes['data-lazy-style'],
                }
                
                console.log(metas);
            })

            return metas;
        }
    }
    catch(error) {
        console.log(error);
    }
}

catalog('movie', 'top');

module.exports = {
    axiosData,
    search,
    catalog
};