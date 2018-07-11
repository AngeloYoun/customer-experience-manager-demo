import sendRequest from 'lib/request';

export const CALL_API = 'CALL_API';

export function toAction(type, ...objs) {
	return Object.assign({type}, ...objs);
}

export default store => next => action => {
	const request = action[CALL_API];

	if (typeof request === 'undefined') {
		return next(action);
	}

	const [requestType, successType, failureType] = request.types;

	next(
		toAction(requestType, action)
	);

	return sendRequest(request).then(
		response => {
			next(
				toAction(
					successType,
					action,
					{
						requestParameters: request.data
					},
					{
						response
					}
				)
			);

			return {response};
		},
		error => {
			next(
				toAction(
					failureType,
					action,
					{
						error
					}
				)
			);

			return Promise.reject(error.status);
		}
	);
};