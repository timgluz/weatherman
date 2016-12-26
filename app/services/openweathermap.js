module.exports = { fetchByCityId }

const restify = require('restify');
const console = require('console');

//TODO: move to ENV vars
const API_URL = 'http://api.openweathermap.org';
const API_ID  = '';

var client = restify.createJsonClient({
  'url' : API_URL,
  'path': '/data/2.5/weather'
});

function fetchByCityId(cityId, onSuccess, onError){
  let path = '/data/2.5/forecast/city?id='+ cityId +'&APPID=' + API_ID,
      resultHandler = (err, req, res, obj) => {
      if(err){
        console.error('Failed to pull weather info for: ' + cityId);
        onError && onError(err);
      } else if (res){
        console.log('Got weather information for: ' + cityId);
        console.log('%j', obj);

        onSuccess && onSuccess(obj);
      } else {
        console.log("Got no error nor result ...");
      }
    };

  client.get(path, resultHandler);
}
