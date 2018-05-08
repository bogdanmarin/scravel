import * as connect from 'connect'
import * as serveStatic from 'serve-static'
import * as qs from 'qs'
import * as fs from 'fs'
import * as path from 'path'

const walkSync = (d: string): any => {
    return fs.statSync(d).isDirectory() ? fs.readdirSync(d).map((f:string) => walkSync(path.join(d, f))) : d 
};

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffle(array: Array<string>) {
    
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}


let pickRandomLocation = (next: any)=>{
    let destinations = walkSync(__dirname + '/destinations');
    
    destinations = shuffle(destinations); //extra shuffle
  
    var destination =  destinations[0];
    var pictureName=  path.basename(destination);

    fs.truncate(__dirname + '/css/random.css', 0,  ()=>{
        fs.writeFile(__dirname + '/css/random.css', "#scratchcard\n{\nbackground: url(../destinations/" + pictureName + ")  no-repeat center center;\n-webkit-background-size: cover;\n-moz-background-size: cover;\n-o-background-size: cover;\nbackground-size: cover;\n}", function(err: any){
            if(err) {
                return console.log(err);
            }
            next();
           
        });
    });

}


connect()
.use('/css/random.css', (req: any, res: any, next: any)=>{
    pickRandomLocation(next);
})
.use('/db', (req: any,res: any,next: any)=>{
    interface IDb {
        [key: string]: string;
    }
    let db : IDb= {
        "barcelona.png":"https://www.tripadvisor.com/Tourism-g187497-Barcelona_Catalonia-Vacations.html",
        "bucharest.jpg": "https://www.tripadvisor.com/Tourism-g294458-Bucharest-Vacations.html",
        "Giola-Thassos-Greece.jpg": "https://www.tripadvisor.com/Travel-g189482-c199072/Thasos:Greece:Giola.The.Natural.Stone.Pool.html",
        "Mykonos-Greece.jpg": "https://www.tripadvisor.com/Tourism-g189430-Mykonos_Cyclades_South_Aegean-Vacations.html",
        "navagio-beach-zakynthos-greece.jpg":"https://www.tripadvisor.com/Attraction_Review-g7777607-d671779-Reviews-Navagio_Beach_Shipwreck_Beach-Anafonitria_Zakynthos_Ionian_Islands.html",
        "new-york-city.jpg":"https://www.tripadvisor.com/Tourism-g60763-New_York_City_New_York-Vacations.html",
        "reykjavik-blue-lagoon.jpg": "https://www.tripadvisor.com/Attraction_Review-g608874-d207805-Reviews-Blue_Lagoon_Iceland-Grindavik_Reykjanes_Peninsula.html",
        "tromso-northern-lights.jpg":"https://www.tripadvisor.com/Attraction_Review-g190475-d6529120-Reviews-Northern_Lights_Tromso_Tours-Tromso_Troms_Northern_Norway.html",
        "Ko-Phi-Phi.jpg": "https://www.tripadvisor.com/Attractions-g303908-Activities-Ko_Phi_Phi_Don_Krabi_Province.html",
        "San-Blas.jpg": "https://www.tripadvisor.com/Attraction_Review-g294479-d1155139-Reviews-San_Blas_Islands-Panama.html",
        "Shanghai.jpg":"https://www.tripadvisor.com/Attractions-g308272-Activities-Shanghai.html",
        "Miniatur-Wunderland.jpg": "http://www.miniatur-wunderland.de",
        "bigar-cascade.jpg": "https://www.tripadvisor.com/Attraction_Review-g7909203-d4572835-Reviews-Cascada_Bigar-Oravita_Caras_Severin_County_Western_Romania_Transylvania.html",
        "sinaia.jpg": "https://www.tripadvisor.com/Tourism-g315907-Sinaia_Prahova_County_Southern_Romania-Vacations.html",
        "maramures-romania.jpg": "https://www.tripadvisor.com/Tourism-g777714-Maramures_County_Northwest_Romania_Transylvania-Vacations.html",
        "Botanical-Garden-Cluj.jpg": "https://www.tripadvisor.com/Attraction_Review-g298474-d1972536-Reviews-Botanical_Garden-Cluj_Napoca_Cluj_County_Northwest_Romania_Transylvania.html",
        "plitvice-croatia.jpg": "https://www.tripadvisor.com/Attraction_Review-g303827-d554038-Reviews-Plitvice_Lakes_National_Park-Plitvice_Lakes_National_Park_Central_Croatia.html",
        "balea-lake-romania.jpg": "https://www.tripadvisor.com/Attraction_Review-g2699691-d775592-Reviews-Balea_Glacier_Lake-Sibiu_County_Central_Romania_Transylvania.html",
        "mamaia-romania.jpg": "https://www.tripadvisor.com/Attraction_Review-g295396-d1846475-Reviews-Mamaia_Beach-Constanta_Constanta_County_Southeast_Romania.html",
        "cluj-napoca-romania.jpg": "https://www.tripadvisor.com/Tourism-g298474-Cluj_Napoca_Cluj_County_Northwest_Romania_Transylvania-Vacations.html",
        "poiana-brasov.jpg": "https://www.tripadvisor.com/Attraction_Review-g616229-d2524216-Reviews-Poiana_Brasov-Poiana_Brasov_Brasov_County_Central_Romania_Transylvania.html",
        "Al-Mamzar-Beach-Park-Dubai.jpg": "https://www.tripadvisor.com/Attraction_Review-g295424-d647125-Reviews-Al_Mamzar_Beach_Park-Dubai_Emirate_of_Dubai.html",
        "jardin-exotique-monaco.jpg": "https://www.tripadvisor.com/Attraction_Review-g190407-d195274-Reviews-Exotic_Garden_Jardin_Exotique-La_Condamine.html",
        "Le-Meridien-Beach-Plaza.jpg":"https://www.tripadvisor.com/Hotel_Review-g190409-d229111-Reviews-Le_Meridien_Beach_Plaza-Monte_Carlo.html",
        "Fairmont-Monte-Carlo.jpg":"https://www.tripadvisor.com/Hotel_Review-g190409-d230423-Reviews-Fairmont_Monte_Carlo-Monte_Carlo.html"
    }    
   var params = qs.parse(req.url.substring(2));
   let path: string = <string>db[params.id]; 
   res.end(path);
    next();

})
.use(serveStatic(__dirname))
.use(serveStatic(__dirname + '/scripts'))
.use(serveStatic(__dirname + '/css'))
.use(serveStatic(__dirname + '/meta'))
.use(serveStatic(__dirname + '/static'))
.use(serveStatic(__dirname + '/destinations'))
.listen(process.env.PORT ||3000, function(){
    console.log('scravel is running on 3000...');
});




