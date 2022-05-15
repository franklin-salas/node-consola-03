const fs = require('fs');
const { default: axios } = require("axios");



class Busquedas {
    historial = [];
    pathDB = './db/data.json';

    constructor(){
        //TODO:  leer db si existe
        this.leerDB();
    }
    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'

        }
    }
  
     get paramsOpenWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            lang: 'es',
            units: 'metric',
           

        }
    }

    async ciudad(lugar = ''){

      try {
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params: this.paramsMapbox
        });
        const resp = await instance.get()
        // console.log(resp.data.features);

        return resp.data.features.map(lugar=> ({
            id: lugar.id,
            nombre: lugar.place_name,
            lng: lugar.center[0],
            lat: lugar.center[1]
        }) );
      } catch (error) {
          console.log('erorr:', error);
          return [];
      }
    }

    async climaCiudad(lat,lon){

        try {
          const instance = axios.create({
              baseURL: `https://api.openweathermap.org/data/2.5/weather`,
              params: {...this.paramsOpenWeather,lat,lon}
          });
          const clima = await (await instance.get()).data
        //    console.log(resp.data);
  
          return {
              desc: clima.weather[0].description,
              min: clima.main.temp_min,
              max: clima.main.temp_max,
              temp: clima.main.temp

          }; 
        } catch (error) {
            console.log('erorr:', error);
            return [];
        }
      }

      guardarHistorial(lugar = ""){
          
          if(this.historial.includes(lugar.toLocaleLowerCase()))
            return;
            this.historial = this.historial.splice(0,5)


        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();
          

      }
      get historialCapitalizado(){
          return this.historial.map(ciudad => {
              let palabras = ciudad.split(' ');
              palabras = palabras.map( p => p[0].toUpperCase()+ p.substring(1));
              return palabras.join(' ');
          });
      }
      guardarDB(){

        const playload = {
            historial: this.historial
        }

        fs.writeFileSync(this.pathDB, JSON.stringify(playload));

      }

      leerDB() {
        if(!fs.existsSync(this.pathDB))
            return;

       const info = fs.readFileSync(this.pathDB, {encoding: 'utf-8'});
       const data = JSON.parse(info);
       this.historial = data.historial;
      }
}

module.exports = Busquedas;