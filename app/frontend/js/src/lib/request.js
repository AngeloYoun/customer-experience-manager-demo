import fetch from 'isomorphic-fetch';
import {isEmpty, transform} from 'lodash';
import WeDeploy from 'wedeploy';

export const requestActions = {
	DELETE: 'DELETE',
	GET: 'GET',
	POST: 'POST',
	PATCH: 'PATCH'
};

export const requestModifiers = {
	COUNT: 'COUNT',
	OFFSET: 'OFFSET',
	LIMIT: 'LIMIT',
	ORDERBY: 'ORDERBY',
	NONE: 'NONE',
	MATCH: 'MATCH',
	PREFIX: 'PREFIX',
	LT: 'LT',
	LTE: 'LTE',
	GT: 'GT',
	GTE: 'GTE',
	ANY: 'ANY',
	RANGE: 'RANGE',
	WHERE: 'WHERE',
	OR: 'OR'
}

const requestBuilderMap = {
	[requestActions.GET]: requestURL => new Request(
		requestURL,
		Object.assign(
			requestConfig,
			{
				body: undefined,
				method: requestActions.GET
			}
		)
	),
	[requestActions.POST]: (requestURL, payload) => new Request(
		requestURL,
		Object.assign(
			requestConfig,
			{
				body: transform(
					payload,
					(formData, value, key) => {
						formData.append(key, value);

						return formData;
					},
					new FormData()
				),
				method: requestActions.POST
			}
		)
	)
};

const weDeployActionModifiers = {
	[requestModifiers.COUNT]: (weDeployRequest, args) => weDeployRequest.count(...args),
	[requestModifiers.OFFSET]: (weDeployRequest, args) => weDeployRequest.offset(...args),
	[requestModifiers.LIMIT]: (weDeployRequest, args) => weDeployRequest.limit(...args),
	[requestModifiers.ORDERBY]: (weDeployRequest, args) => weDeployRequest.orderBy(...args),
	[requestModifiers.NONE]: (weDeployRequest, args) => weDeployRequest.none(...args),
	[requestModifiers.MATCH]: (weDeployRequest, args) => weDeployRequest.match(...args),
	[requestModifiers.PREFIX]: (weDeployRequest, args) => weDeployRequest.prefix(...args),
	[requestModifiers.LT]: (weDeployRequest, args) => weDeployRequest.lt(...args),
	[requestModifiers.LTE]: (weDeployRequest, args) => weDeployRequest.lte(...args),
	[requestModifiers.GT]: (weDeployRequest, args) => weDeployRequest.gt(...args),
	[requestModifiers.GTE]: (weDeployRequest, args) => weDeployRequest.gte(...args),
	[requestModifiers.ANY]: (weDeployRequest, args) => weDeployRequest.any(...args),
	[requestModifiers.RANGE]: (weDeployRequest, args) => weDeployRequest.range(...args),
	[requestModifiers.WHERE]: (weDeployRequest, args) => weDeployRequest.where(...args),
	[requestModifiers.OR]: (weDeployRequest, args) => weDeployRequest.or(...args)
}

const buildURL = (controller, path) => `${controller}${path ? buildPath(path) : ''}`;

const buildPath = path => path.reduce((url, level) => `${url}/${level}`, '')

const weDeployActions = {
	[requestActions.DELETE]: (wedeployRequest, controller, {path}) => wedeployRequest.delete(buildURL(controller, path)),
	[requestActions.GET]: (wedeployRequest, controller, {path}) => wedeployRequest.get(buildURL(controller, path)),
	[requestActions.POST]: (wedeployRequest, controller, {path, payload}) => wedeployRequest.create(buildURL(controller, path), payload),
	[requestActions.PATCH]: (wedeployRequest, controller, {path, payload}) => wedeployRequest.update(buildURL(controller, path), payload)
}

const requestConfig = {
	credentials: 'include'
};

const createURIComponent = (data, key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;

export default request => {
	const {
		controller,
		controllerMethod = requestActions.GET,
		data = {},
		requestURL,
	} = request;

	const {
		path,
		payload,
		modifiers = [],
		wedeploy = true
	} = data;

	let response;

	if (wedeploy) {
		const wedeploy = WeDeploy.data('https://db-dossiera.wedeploy.io');

		const weDeployModifiersApplied = modifiers.reduce(
			(accum, {key, args}) => {
				return weDeployActionModifiers[key](accum, args)
			},
			wedeploy
		);

		response = weDeployActions[controllerMethod](weDeployModifiersApplied, controller, data).then(
			response => (
				{
					data: response,
					parameters: data
				}
			)
		);
	}
	else {
		response = fetchURL(
			requestBuilderMap[controllerMethod](
				`${window.Dossiera.URLS.API_URL}${buildURL(controller, path)}`,
				payload
			)
		);
	}

	return response
};

export function fetchURL(request) {
	return fetch(request).then(
		response => {
			return response.status === 200 ? response.text() : Promise.reject(
				{
					message: `${response.status} ${response.statusText}`,
					status: response.status
				}
			);
		},
		() => Promise.reject('Could not connect to server.')
	).then(
		text => {
			let retVal = text;

			try {
				retVal = JSON.parse(text);
			}
			finally {
				return retVal;
			}
		},
		errorMessage => Promise.reject(errorMessage || {message: 'Failed to parse response.'})
	);
}

export function readData(request) {
	return request.then(
		response => {
			return response.status === 200 ? response.text() : Promise.reject(
				{
					message: `${response.status} ${response.statusText}`,
					status: response.status
				}
			);
		},
		() => Promise.reject('Could not connect to server.')
	).then(
		text => {
			let retVal = text;

			try {
				retVal = JSON.parse(text);
			}
			finally {
				return retVal;
			}
		},
		errorMessage => Promise.reject(errorMessage || {message: 'Failed to parse response.'})
	);
}

export function serializeQueryString(data) {
	const str = Object.keys(data).map(
		key => {
			const value = data[key];

			let parameter;

			if (Array.isArray(value)) {
				const duplicateParameter = value.map(
					key => createURIComponent(data, key)
				);

				parameter = duplicateParameter.join('&');
			}
			else {
				parameter = createURIComponent(data, key);
			}

			return parameter;
		}
	);

	return str.join('&');
}