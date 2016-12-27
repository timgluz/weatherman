module.exports = { findClosest, getOne, putOne, getMany }

const console = require('console');
const Geo = require('geo-nearby');
const db = require('../../db');

let geo = loadIndex();

function getOne(cityId, onSuccess, onError){
  db.get(cityId.toString(), (err, val) => {
    if(err){
      console.error("Failed to fetch city" + cityId +".Reason: \n" + err);
      onError && onError(err);
    } else {
      console.log("Found city: "+  val);
      onSuccess && onSuccess(JSON.parse(val));
    }
  });
}

//:TODO: use promises to get more robust code
function getMany(cityIds, onSuccess, onError){
  let results = [],
      onGoodFetch = (res) => {
        results.push(res);
        if(results.length === cityIds.length){
          console.log("Got all results: " + results.length);
          onSuccess && onSuccess(results);
        } 
      };

  cityIds.forEach((cityId) => {
    console.log("getMany: fetching id: " + cityId);
    getOne(cityId, onGoodFetch)
  });
}

function putOne(cityId, cityData, onSuccess, onError){
  encodedCity = JSON.stringify(cityData);

  db.put(
    cityId.toString(), 
    encodedCity, 
    (err) => {
      if(err){
        console.error("Failed to save " + encodedCity + "\n" + err);
        onError && onError(err);
      } else {
        onSuccess && onSuccess(cityData);
      }
    }
  );
}

function deleteOne(cityId, onSuccess, onError){
  //TODO: finish it
}

function findClosest(lat, lng, radius = 10, maxN = 10){ 
  return geo.limit(maxN).nearBy(lat, lng, radius * 1000);
}

function loadIndex(){
  const geoIndex = require('../../resources/city.compact.json');
  return new Geo(geoIndex, { sorted: true, limit: 10 });
}


