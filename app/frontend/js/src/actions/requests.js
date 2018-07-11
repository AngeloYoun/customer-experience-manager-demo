import {createActionTypes} from 'lib/util';
import {requestActions} from 'lib/request';
import {CALL_API} from 'middleware/api';

export default ({controller, name}) => {
	const actionTypes = Object.values(requestActions).reduce(
		(result, next) => (
			{
				...result,
				...createActionTypes(['FAILURE', 'REQUEST', 'SUCCESS'], next, name, true)
			}
		),
		{}
	);

	const actions = {
		[requestActions.DELETE]: (request = {}) => {
			const {
				requestURL,
				...data
			} = request;

			return {
				[CALL_API]: {
					controller,
					controllerMethod: requestActions.DELETE,
					data,
					requestURL,
					types: [actionTypes.DELETE_REQUEST, actionTypes.DELETE_SUCCESS, actionTypes.DELETE_FAILURE]
				}
			};
		},
		[requestActions.GET]: (request = {}) => {
			const {
				requestURL,
				...data
			} = request;

			return {
				[CALL_API]: {
					controller,
					controllerMethod: requestActions.GET,
					data,
					requestURL,
					types: [actionTypes.GET_REQUEST, actionTypes.GET_SUCCESS, actionTypes.GET_FAILURE]
				}
			};
		},
		[requestActions.POST]: (request = {}) => {
			const {
				requestURL,
				...data
			} = request;

			return {
				[CALL_API]: {
					controller,
					controllerMethod: requestActions.POST,
					data,
					requestURL,
					types: [actionTypes.POST_REQUEST, actionTypes.POST_SUCCESS, actionTypes.POST_FAILURE]
				}
			};
		},
		[requestActions.PATCH]: (request = {}) => {
			const {
				requestURL,
				...data
			} = request;

			return {
				[CALL_API]: {
					controller,
					controllerMethod: requestActions.PATCH,
					data,
					requestURL,
					types: [actionTypes.PATCH_REQUEST, actionTypes.PATCH_SUCCESS, actionTypes.PATCH_FAILURE]
				}
			};
		},
	};

	return {
		actionTypes,
		actions
	};
};