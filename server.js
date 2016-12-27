var restify = require('restify'),
    fs = require('fs');

var controllers = {},
    controllers_path = process.cwd() + '/app/controllers';

//import controllers
fs.readdirSync(controllers_path).forEach(function (file) {
  if (file.indexOf('.js') != -1) {
      controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
  }
});

//load configs
var env = process.env.NODE_ENV || 'development',
		server = restify.createServer();

//configure server instance
server
  .use(restify.acceptParser(server.acceptable))
  .use(restify.CORS())
  .use(restify.queryParser())
  .use(restify.bodyParser())
  .use(restify.fullResponse());

server.pre(restify.pre.sanitizePath()); //remove trailing slashes 

//-- APP routes
server.get('/cities', controllers.cities.findCities)
server.get('/cities/:city_id', controllers.cities.getCity)

//TODO: add cache handler after checkCity
server.get(
  '/cities/:city_id/weather',
  controllers.cities.checkCity,
  controllers.cities.fetchWeather
);

//-- the entrypoint
var port = process.env.PORT || 3000;
server.listen(port, function (err) {
  if (err)
    console.error(err)
  else
    console.log('WeatherMan is listening at : ' + port)
});
 
if (process.env.environment == 'production') {
  process.on('uncaughtException', function (err) {
    console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
  })
}

module.exports = server;


