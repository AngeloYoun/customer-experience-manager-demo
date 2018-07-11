import {Map} from 'immutable';

import {capitalizeFirstLetter, createReducer} from 'lib/util';

export function updateData(state, {normalized, response}, primaryKey) {
	let data = response;

	if (normalized && normalized.hasOwnProperty(primaryKey)) {
		data = normalized[primaryKey];
	}

	return Map().mergeDeep(
		state,
		{
			[`loading${capitalizeFirstLetter(primaryKey)}`]: false,
			data
		}
	);
}

export function updateLoading(loading, primaryKey) {
	return (state, action) => state.set(`loading${capitalizeFirstLetter(primaryKey)}`, loading);
}

export default ({actionTypes, primaryKey}) => {
	const actionHandlers = {
		[actionTypes.GET_FAILURE]: updateLoading(false, primaryKey),
		[actionTypes.GET_REQUEST]: updateLoading(true, primaryKey),
		[actionTypes.GET_SUCCESS]: (state, action) => {
			return updateData(state, action, primaryKey);
		},
		[actionTypes.PATCH_FAILURE]: updateLoading(false, primaryKey),
		[actionTypes.PATCH_REQUEST]: updateLoading(true, primaryKey),
		[actionTypes.PATCH_SUCCESS]: (state, action) => {
			return updateData(state, action, primaryKey);
		},
		[actionTypes.POST_FAILURE]: updateLoading(false, primaryKey),
		[actionTypes.POST_REQUEST]: updateLoading(true, primaryKey),
		[actionTypes.POST_SUCCESS]: (state, action) => {
			return updateData(state, action, primaryKey);
		}
	};

	return createReducer(Map(), actionHandlers);
};