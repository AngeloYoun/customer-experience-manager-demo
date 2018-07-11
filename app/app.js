var express = require('express');
var {graphqlExpress, graphiqlExpress} = require('graphql-server-express');
var {makeExecutableSchema} = require('graphql-tools');
var app = express();
var bodyParser = require('body-parser');
var http = require('https');
var rp = require('request-promise');
var resolvers = require('./backend/resolvers');
var { graphql, buildSchema } = require('graphql');
var schema = require('./backend/schema');

const dev = process.env.NODE_ENV === 'development';

const executableSchema = makeExecutableSchema({
	resolvers,
	typeDefs: [schema]
})

app.listen(
	7575,
	function() {
		console.log('listening on *:7575');
	}
);

app.use(express.static('frontend'));

app.use('/graphql', bodyParser.json(), graphqlExpress(req => {
	console.log('hit graphql')
	return ({
	schema: executableSchema,
	context: {ip: req.ip}
})}
));

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
}));


// app.use(function(req, res, next) {
// 	if (req.get('origin') === 'http://localhost:8585') {
// 		res.header("Access-Control-Allow-Origin", "http://localhost:8585");
// 	}
// 	else {
// 		res.header("Access-Control-Allow-Origin", "https://dxp-dossiera.wedeploy.io");
// 	}

// 	res.header("Access-Control-Allow-Credentials", 'true');
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });

const apiPath = '/api/*'


app.get(
	'/api/loop/people/*',
	(request, response) => {
		http.request(
			{
				host: 'loop.liferay.com',
				path: `/web/guest/home/-/loop/people/${request.originalUrl.match(/.+(?:\/)(.+)$/)[1]}/view.json`,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjI5ODMxLCJkZXZpY2UiOiJwb29wb28iLCJyZXZva2FibGUiOnRydWUsImlhdCI6MTQ4ODU3OTc0Nn0.rJx2usvMoijukvzsluREhUHa8bT73IPAf8GPc9lXAsU'
				}
			},
			generateCallBack(response)
		).end();
	}
);

app.get('/*', function(req, res){
	res.sendFile(
		'/frontend/index.html',
		{
			root: __dirname
		}
	);
});

var controllers = ['loop', 'projects', 'opportunities', 'builds'];

var methods = ['index'];


generateCallBack = function(originalResponse) {
	return response => {
		var str = '';

		response.on(
			'data',
			chunk => {
				str += chunk;
			}
		);

		console.log(str)

		response.on(
			'end',
			() => {
				originalResponse.send(str);
			}
		);
	}
}

getParameter = function(originalUrl) {
	return originalUrl.slice(originalUrl.indexOf('?'), originalUrl.length);
}

getEntityId = function(originalUrl, controllerName) {
	return originalUrl.slice(originalUrl.indexOf(controllerName) + controllerName.length, originalUrl.length);
}

getControllerName = function(originalUrl, apiPath) {
	const urlAfterApiPath = originalUrl.slice(originalUrl.indexOf(apiPath) + apiPath.length, originalUrl.length);

	const requestParamsIndex = urlAfterApiPath.indexOf('/');

	return requestParamsIndex < 0 ? urlAfterApiPath : urlAfterApiPath.slice(0, requestParamsIndex)
}

createRequest = function(controller, host, response, request) {
	http.request(
		{
			host: host ? host : '',
			path: `/${controller}${getEntityId(request.originalUrl, controller)}`,
			method: 'GET',
			headers: {
				'Dossiera-API-Token': 'token'
			}
		},
		generateCallBack(response)
	).end();
}