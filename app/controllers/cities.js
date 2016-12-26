//export all the functions
module.exports = { findCities, getCity, getWeather };

function findCities(req, res, next){
  res.json([
    {"id": 1, "name" : "Monnem"},
    {"id": 2, "name" : "Luffa"}
  ]);
};

function getCity(req, res, next){
  res.json({
    "id" :  287828929,
    "name" : "Mannheim",
    "lat" : 49.48,
    "lng" : 8.45
  });

  //next();
};

function getWeather(req, res, next){
  res.status(200);
  res.json({
    "type" : "clear",
    "type description": "clear sky"
  });
};
