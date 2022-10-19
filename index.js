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
            return parsed.map( (movie) => {
                let cat = {
                    id: movie.querySelector('a').rawAttributes['href'].toString(),
                    type: Type,
                    title : movie.querySelector('a').rawAttributes['title'].toString(),
                    poster : movie.querySelector('.BG--GridItem').rawAttributes['data-lazy-style'].replace(/\(|\)|;|--image:url/g, ''),
                }
                if (movie.querySelector('.year')) {
                    cat.released = movie.querySelector('.year').rawText.toString();
                }
                return cat;
                
            })
    }
    catch(error) {
        console.log(error);
    }
}

// catalog('series', 'MCseries-New');

async function meta (type, id) {

    if (type === 'movie'){
        try {
            var URL = id;
            var res = encodeURI(URL);
            let promise = (await axios.get(res)).data;
            var link = res;
        }catch (error) {

            try {
                let promise = (await axios.get(URL)).data;
                var link = URL;
            }catch(error) {
                console.log(error);
            }
            
        }
    }
    if (type == 'series') {
        let id1 = 'مسلسل';
        try {
            var URL = id;
            var res = encodeURI(URL);
            let promise = (await axios.get(res)).data;
            var link = res;
        }catch (error) {

            try {
                let promise = (await axios.get(URL)).data;
                var link = URL;
            }catch(error) {
                console.log(error);
            }
            
        }
        
    }
    
    
    let promise = (await axios.get(link)).data;
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
    


    let genres = parsed.querySelector('.Terms--Content--Single-begin').querySelectorAll('a')
    .map( (genre) => { 
        return genre.rawText.toString();})

    

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
        if (seasons) {
            metaObj.videos = seasons;
        }
    }

    return metaObj;


}


// meta ('series', 'https://mycimaa.makeup/series/midnight-at-pera-palace/');


async function seasonlist(id) {

    try {
        var URL = id;
        var res = encodeURI(URL);
        let promise = (await axios.get(res)).data;
        var link = res;
    }catch (error) {

        try {
            let promise = (await axios.get(URL)).data;
            var link = URL;
        }catch(error) {
            console.log(error);
        }
        
    }

    var promise = (await axios.get(link)).data;
    let parsed = parser.parse(promise);
    var seasonsEpisodes = parsed.querySelector('.Seasons--Episodes');

    var seasonarray =  [];

    try {
        
        if (seasonsEpisodes.querySelector('.List--Seasons--Episodes')) {
            var seasonsList = seasonsEpisodes.querySelector('.List--Seasons--Episodes').querySelectorAll('a');
            
            for (i = 0; i < seasonsList.length; i++) {
               
                var seasonUrl = seasonsList[i].rawAttributes['href'];
                var seasonData = (await axios.get(seasonUrl)).data;
        
        
                let pars = parser.parse(seasonData);
                 var eplist = pars.querySelector('.Episodes--Seasons--Episodes').querySelectorAll('a');
        
                eplist.reverse();
        
                for (j = 0; j < eplist.length; j++) {
                    var epUrl = eplist[j].rawAttributes['href'];
                    var epData =  (await axios.get(epUrl)).data;
                    let edDataParsed = parser.parse(epData);
        
                    let epTitle = edDataParsed.querySelector('.Title--Content--Single-begin').querySelector('h1').rawText.toString();
        
                    seasonarray.push({
                        id: epUrl,
                        name: epTitle,
                        season: i+1,
                        episode: j+1,
                        available: true
                    })
        
                }
        
                }
    
        }
         else if (!seasonsList) {
            var eplist = parsed.querySelector('.Episodes--Seasons--Episodes').querySelectorAll('a');
        
                eplist.reverse();
        
                for (j = 0; j < eplist.length; j++) {
                    var epUrl = eplist[j].rawAttributes['href'];
                    var epData =  (await axios.get(epUrl)).data;
                    let edDataParsed = parser.parse(epData);
        
                    let epTitle = edDataParsed.querySelector('.Title--Content--Single-begin').querySelector('h1').rawText.toString();
        
                    seasonarray.push({
                        id: epUrl,
                        name: epTitle,
                        season: 1,
                        episode: j+1,
                        released: '2010-12-06T05:00:00.000Z',
                        available: true
                    })
         }
        }
    } catch( error) {
        console.log(error);
     }


    
    return seasonarray;

}


// seasonlist('https://mycimaa.cfd/series/loki/');

async function stream (type, id) {
    if (type === 'movie'){
        try {
            var URL = id;
            var res = encodeURI(URL);
            let promise = (await axios.get(res)).data;
            var link = res;
        }catch (error) {

            try {
                let promise = (await axios.get(URL)).data;
                var link = URL;
            }catch(error) {
                console.log(error);
            }
            
        }

        let promise = (await axios.get(link)).data;
        let parsed = parser.parse(promise).querySelector('.List--Download--Mycima--Single').querySelectorAll('a');

        var streamList =  parsed.map( stream => {
            return {
                url: stream.rawAttributes['href'],
                name: stream.querySelector('resolution').rawText
            }

        })

        return streamList;
    }
    else if (type === 'series') {

        try {
            var URL = id;
            var res = encodeURI(URL);
            let promise = (await axios.get(res)).data;
            var link = res;
        }catch (error) {

            try {
                let promise = (await axios.get(URL)).data;
                var link = URL;
            }catch(error) {
                console.log(error);
            }
            
        }
        let promise = (await axios.get(link)).data;
        let parsed = parser.parse(promise).querySelector('.List--Download--Mycima--Single').querySelectorAll('a');

        var epStreamList =  parsed.map( stream => {
            return  {
                url: stream.rawAttributes['href'],
                name: stream.querySelector('resolution').rawText
            }

        })

        return epStreamList;
    }
    
}



// stream('series', 'https://mycimaa.cfd/watch/%d9%85%d8%b4%d8%a7%d9%87%d8%af%d8%a9-%d9%85%d8%b3%d9%84%d8%b3%d9%84-pivoting-%d9%85%d9%88%d8%b3%d9%85-1-%d8%ad%d9%84%d9%82%d8%a9-1/');


module.exports = {
    axiosData,
    search,
    catalog,
    meta,
    stream
};