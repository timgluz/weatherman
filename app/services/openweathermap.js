module.exports = { fetchByCityId }

const restify = require('restify');
const console = require('console');
const config  = require('config');

//TODO: move to ENV vars
const API_URL = 'http://api.openweathermap.org';

console.log("Configs in service: " + JSON.stringify(config.get('WeatherAPI.app_id')));

const API_ID  = config.get('WeatherAPI.app_id') + '';

var client = restify.createJsonClient({
  'url' : API_URL,
  'path': '/data/2.5/weather'
});

//TODO: support additional options like units, language
function fetchByCityId(cityId, onSuccess, onError){
  let path = '/data/2.5/weather?units=metric&id='+ cityId +'&APPID=' + API_ID,
      resultHandler = (err, req, res, obj) => {
      if(err){
        console.error('Failed to pull weather info for: ' + cityId);
        onError && onError(err);
      } else if (res){
        console.log('Got weather information for: ' + cityId);
        if(obj.cod === '0'){
          onError && onError('Failed to fetch latest weather info');
        } else {
          onSuccess && onSuccess(obj);
        }
      } else {
        console.log("Got no error nor result ...");
        onError && onError('No weather information');
      }
    };

  client.get(path, resultHandler);
}
