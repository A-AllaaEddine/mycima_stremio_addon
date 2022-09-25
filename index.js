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
        let Query = query.replace(/\s/g,'+').toString();
        if (type == 'movie ') {
            URL = `${Host}/search/${Query}`;
        }
        else if (type == 'series') {
            URL = `${Host}/search/${Query}/list/series/`;
        }
        
        var res = encodeURI(URL);
        const  promise = (await axios.get(res)).data;
        let parsed = parser.parse(promise).querySelector('.Grid--MycimaPosts').querySelectorAll('.GridItem');

            return parsed.map( (movie) => {
                if (movie) {
                    let cat = {
                        id: movie.querySelector('a').rawAttributes['title'].toString(),
                        type: type,
                        title : movie.querySelector('a').rawAttributes['title'].toString(),
                        poster : movie.querySelector('.BG--GridItem').rawAttributes['data-lazy-style'].replace(/\(|\)|;|--image:url/g, ''),
                    }
                    if (movie.querySelector('.year')) {
                        cat.released = movie.querySelector('.year').rawText.toString();
                    }
                    return cat;
                }
                
            })
    }
    catch(error) {
        console.log(error);
    }
}


//search('', 'the blacklist');

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
    if (type == 'series') {
        let id1 = 'مسلسل';
        try {
            var URL = `${Host}/series/${id.replace(/\s/g, '-')}`;
            // console.log(URL)
            var res = encodeURI(URL);
            let promise = (await axios.get(res)).data;
        }catch {
            try {
                URL = `${Host}/series/${id1}-${id.replace(/\s/g, '-')}`;
                // console.log("2nd", URL);
                var res = encodeURI(URL);
                let promise = (await axios.get(res)).data;

            }catch(error) {
                console.log(error);
            }
            
        }
        
    }
    // console.log(URL);
    
    
    var res = encodeURI(URL);
    let promise = (await axios.get(res)).data;
    let parsed = parser.parse(promise);

    var description;
    var bg;

    let title = parsed.querySelector('.Title--Content--Single-begin').querySelector('h1').rawText.toString();
    
    if (type == 'movie') {
        description = parsed.querySelector('.StoryMovieContent').rawText.toString();
        bg = parsed.querySelector('.separated--top').rawAttributes['data-lazy-style'].toString().replace(/\(|\)|;|--img:url/g, '');
    }
    if (type == 'series') {
        description = parsed.querySelector('.PostItemContent').rawText.toString();
        bg = parsed.querySelector('.separated--top').rawAttributes['style'].toString().replace(/\(|\)|;|--img:url/g, '');
    }
    

    
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

    let metaObj ={
        id: id,
        title: title,
        posterShape: 'poster',
        type: type,
        poster: bg,
        background: bg,
        description: description,
    }

    if (genre) {
        metaObj.genre = genre;
    }

    if (type == 'series') {
        var seasons = await seasonlist(id);
    }
    if (type == 'series') {
        metaObj.videos = seasons;
    }

    // console.log(metaObj);
    return metaObj;


}


// meta ('series', 'مسلسل Vikings');


async function seasonlist(id) {
    let id1 = 'مسلسل';
    try {
        var URL = `${Host}/series/${id1}-${id.replace(/ /g, '-')}`;
        // console.log('1st',URL)
        let res = encodeURI(URL);
        let promise = (await axios.get(res)).data;
    }catch(error) {
        try {
            URL = `${Host}/series/${id.replace(/ /g, '-')}`;
            // console.log('2nd', URL);
            let res = encodeURI(URL);
            let promise = (await axios.get(res)).data;

        }catch(error){
            console.log(error);
        }
        
    }

    // console.log(URL)
    var res = encodeURI(URL);
    var promise = (await axios.get(res)).data;
    let parsed = parser.parse(promise);
    // console.log(parsed);
    var list = parsed.querySelector('.List--Seasons--Episodes').querySelectorAll('a');

    // console.log(list.length);
    var seasonarray =  [];
    for (i = 0; i < list.length; i++) {
        //let test = list[i].querySelector('a').rawText.split(' ');
        let seasonId = i+1;
        let id2 = 'موسم';
        let id3 = 'مشاهدة';
        let id4 = 'حلقة'
        
        try {
            
            var epsurl = `${Host}/series/${id.replace(/\s/g, '-')}-${id2}-${seasonId}`;
            let epsurlURI = encodeURI(epsurl);
            // console.log(epsurl);
            var eps = (await axios.get(epsurlURI)).data;
        }catch(error) {
            try {
                epsurl = `${Host}/series/${id2}-${seasonId}-${id1}-${id.replace(/ /g, '-')}`;
                // console.log(epsurl);
                epsurlURI = encodeURI(epsurl);
                eps = (await axios.get(epsurlURI)).data;
            
            }catch(error){
                console.log(error);
            }
            
        }
        // console.log(epsurl);

        

        let pars = parser.parse(eps);
        var eplist = pars.querySelector('.Episodes--Seasons--Episodes').querySelectorAll('a');

        //eplist.map( srs => console.log(srs));
        eplist.reverse();

        for (j = 0; j < eplist.length; j++) {
            let epId = j+1;
            var epurl = eplist[j].rawAttributes['href'];
            var test = epurl.split('-');
            let Url = (await axios.get(epurl)).data;
            let epParsed = parser.parse(Url);
            // console.log(epurl);
            let epTitle = epParsed.querySelector('.Title--Content--Single-begin').querySelector('h1').rawText.toString();
            // console.log(epTitle);
            seasonarray.push({
                id: epTitle,
                name: epTitle,
                season: i+1,
                episode: j+1,
                available: true
            })
            
        }
    }
    return seasonarray;
    // console.log(seasonarray);

}


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