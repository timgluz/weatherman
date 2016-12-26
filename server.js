var restify = require('restify'),
    fs = require('fs');

var controllers = {},
    controllers_path = process.cwd() + '/app/controllers';

fs.readdirSync(controllers_path).forEach(function (file) {
  if (file.indexOf('.js') != -1) {
      controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
  }
});


function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server
  .use(restify.acceptParser(server.acceptable))
  .use(restify.CORS())
  .use(restify.queryParser())
  .use(restify.bodyParser())
  .use(restify.fullResponse());

//server.pre(restify.pre.sanitizePath());

//-- APP routes
server.get('/cities', controllers.cities.findCities)
server.get('/cities/:city_id', controllers.cities.getCity)
server.get('/cities/:city_id/weather', controllers.cities.getWeather);

module.exports = server
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
