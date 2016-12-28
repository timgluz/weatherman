module.exports = { findClosest, getOne, putOne, getMany, sortLocations }

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

//sorts a list of cities by absolute difference from user location 
//args:
//  targetPoint = {lat: Float, lng: Float}
//  closestCities = [{id: Int, name: String, lat: Float, lng: Float}]
// returns: Float, absolute difference from target point
function sortLocations(targetPoint, closestCities){
  let diffFromUser = function(coords1, coords2){
    return Math.abs(coords1.lat - coords2.lat) + Math.abs(coords1.lng - coords2.lng)
  };

  return closestCities.sort((city1, city2) => {
    return (diffFromUser(targetPoint, city1) < diffFromUser(targetPoint, city2)) ? -1 : 1;
  });
}

function deleteOne(cityId, onSuccess, onError){
  //TODO: finish it
}

function findClosest(lat = 0 , lng = 0, radius = 10, maxN = 10){
  let lat_ = Number(lat).toFixed(7),
      lng_ = Number(lng).toFixed(7);

  return geo.limit(maxN).nearBy(lat_, lng_, radius * 1000);
}

function loadIndex(){
  const geoIndex = require('../../resources/city.compact.json');
  return new Geo(geoIndex, { sort: true, sorted: true, limit: 20 });
}


