const { leerInput, inquirerMenu, pausa, listadoLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require('dotenv').config();

// console.log(process.env.MAPBOX_KEY)

const main = async() => {

    
    const busquedas = new Busquedas();
    let opt;

    do {
        
        opt = await inquirerMenu();


        switch (opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('ciudad:' );
                //Buscar lugares
                const lugares= await busquedas.ciudad(termino);
                 //Seleccionar lugar
                 const id = await listadoLugares(lugares);

                 if(id === '0') continue;

                 const lugarsel = lugares.find(l => l.id === id);
                 busquedas.guardarHistorial(lugarsel.nombre);

            //    console.log({lugarsel})
          
                //clima
                const clima = await busquedas.climaCiudad(lugarsel.lat,lugarsel.lng);
                // console.log(clima);

                //Guardar historial

                //Mostrar resultados
                // console.clear();
                console.log('\n Información de la ciudad\n'.green);
                console.log('Ciudad:', lugarsel.nombre.green);
                console.log('Lat:', lugarsel.lat);
                console.log('Lng:',lugarsel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:',clima.min);
                console.log('Máxima:',clima.max);
                console.log('Como esta el clima:',clima.desc.green);
                
                break;
         case 2:
                busquedas.historialCapitalizado.forEach((ciudad, i) => {
                    const idx = `${i +1}.`.green;
                    console.log(idx , ciudad);
                })
        
                break;
            default:
                break;
        }
        // console.log({opt});
        if(opt!== 0)  await pausa();

    } while (opt !== 0);

}

main();