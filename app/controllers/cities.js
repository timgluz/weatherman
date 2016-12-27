//export all the functions
module.exports = { findCities, getCity, getWeather };

const validator = require('validator');
const City = require('../models/city');
const WeatherApi = require('../services/openweathermap');

function findCities(req, res, next){
  let lat = req.query['lat'],
      lng = req.query['lng'],
      errs = validateCoords(lat, lng);
  
  //validate user inputs
  if(errs.length > 0){
    console.log("User attached not valid coordinates. " + errs.join('\n'));
    res.json(400,{
      'code': "BadRequestError",
      'message':  errs.join('\n')
    });
    return next(errs.join('\n'));
  }

  //find the IDs of the closest cities
  let closeCoords = City.findClosest(lat, lng, 10),
      cityIds = closeCoords.map((doc) => { return doc.i; }),
      onResult = (cities) => {
        if(cities.length > 0)
          res.json(cities);
        else
          res.json(404, {
            'code'    : "NotFoundError",
            "message" : "Found no cities"
          });
      },
      onError = (err) => {
        res.json(500, {"message": "Failed to request cities"})
      }

  //fetch Cities data by their ids and render response
  City.getMany(cityIds, onResult, onError);
};

function getCity(req, res, next){
  let cityId  = req.params.city_id,
      errs    = validateCityId(cityId);

  //validate user input
  if(errs.length > 0){
    res.json(400, {
      code: 'BadRequestError',
      message: errs.join('\n')
    });
    return next(errs.join('\n'));
  }
  
  //fetch city details and render response
  City.getOne(
    cityId,
    (theCity) => {res.json(theCity)}, //TODO: fix double encode-decode as DB val already in JSON
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


//-- VALIDATORS ---------------------------------------------------------------
function validateCoords(lat, lng){
  let errs = [],
      lat_ = lat + '', //validator expects string values and way to turn Nan into String
      lng_ = lng + '';

  if (lat){
    if(!validator.isFloat(lat_, {min: -90.0, max: 90.0 }) ){
      errs.push('Latitude('+ lat_ +') must be in the valid range(-90, 90).');
    }
  } else {
    errs.push('Latitude is missing, add the lat param to the url;');
  } 
  
  if(lng){
    if(!validator.isFloat(lng_, {min: -180.0, max: 180.00})){
      errs.push('Longitude('+ lng_ +') must be in the valid range(-180,180)');
    }
  } else {
    errs.push('Longitude is missing, add the lng param to the url;')
  }

  return errs;
}

function validateCityId(cityId){
  let errs = [],
      cityId_ = cityId + '';

  if(cityId){
    if(validator.isEmpty(cityId_ )){
      errs.push('CityId can not be empty'); 
    } else if( !validator.isInt(cityId_) ){
      errs.push('CityId must be number');
    } 
  } else {
    errs.push('cityId is missing');
  }

  return errs;
}
