const fs = require('fs');
const split = require('split'); 
const console = require('console');
const Geo = require('geo-nearby');

const citiesPath = '../resources/city.list.json';
const indexPath  = '../resources/city.compact.json';

createIndex(citiesPath, indexPath);

//turns Newline-delimited JSON stream into list of Geocoords 
// and saves result to the file
function createIndex(citiesFilePath, targetFilePath){
  let coords = [],
      expectedLines = 209579, // wc -l resources/city.list.json
      totalLines = 0,
      dbDir = '../data/weatherman_db';

  //create DB folder if it still doesnt exist
  if (!fs.existsSync(dbDir)){
    fs.mkdirSync('../data');
    fs.mkdirSync(dbDir);
    console.log('Created folder for weathermanDB' + dbDir);
  }

  //delay importing as DB may not exists at the beginning
  const City  = require('../app/models/city');


  //create sorted optimized geoIndex and save city data into levelDB
  //from new-line separated JSON stream
  fs.createReadStream(citiesFilePath)
    .pipe(split(JSON.parse))
    .on('data', (theCity) => {
      //collect geopoints into list
      coords.push([theCity.coord.lat, theCity.coord.lon, theCity['_id']]);
      totalLines += 1
      //save cities meta data into database
      City.putOne(
        theCity['_id'],
        {
          "id" : theCity["_id"],
          "name": theCity["name"],
          "lat" : theCity.coord.lat,
          "lng" : theCity.coord.lon
        }
      );
    })
    .on('error', (err) => { 
      if( totalLines != expectedLines){
        console.error(
          "Failed to parse source file after line " + totalLines +
          "Reason: \n" + err
        );
      }

    })
    .on('close', () => {
      //save coordinates as compacted GeoIndex
      Geo.createCompactSet(coords, { file: targetFilePath, sort: true });
      console.log(
        "Done! Processed " + totalLines + "items and saved results " +
        targetFilePath
      );
    });

}

