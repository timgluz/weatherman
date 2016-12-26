//export all the functions
module.exports = { findCities, getCity, getWeather };

const City = require('../models/city');
const WeatherApi = require('../services/openweathermap');

//TODO: catch edge cases

function findCities(req, res, next){
  //TODO: finish
  let closeCoords = City.findClosest(49.49, 8.5, 50),
      cityIds = closeCoords.map((doc) => { return doc.i; }),
      onResult = (cities) => {
        if(cities.length > 0)
          res.json(cities);
        else
          res.json(404, {
            "message" : "Found no cities"
          });
      },
      onError = (err) => {
        res.json(500, {"message": "Failed to request cities"})
      }

  City.getMany(cityIds, onResult, onError);
};

function getCity(req, res, next){
  City.getOne(
    req.params.city_id,
    (theCity) => {res.json(theCity)}, //TODO: double encode-decode as DB val already in JSON
    (err) => {
      res.json(404, {
        "code": "NotFoundError",
        "message": "not found"
      });
    }
  );
};

function getWeather(req, res, next){
  let onSuccess = (weatherInfo) => {res.json(weatherInfo);},
      onError   = (err) => { res.json({'message' : "Got no info: " + err }) };

  WeatherApi.fetchByCityId('2814469', onSuccess, onError);
};
