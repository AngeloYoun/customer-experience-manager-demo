import {applyMiddleware, compose, combineReducers, createStore} from 'redux';
import {fromJS} from 'immutable';
import thunk from 'redux-thunk';

import api from 'middleware/api';
import errorHandler from 'middleware/error-handler';
import normalizer from 'middleware/normalizer';
import sessionHandler from 'middleware/session-handler';

import reducers from 'reducers';

export default function configureStore(apollo) {
	return createStore(
		combineReducers(
			{
				apollo: apollo.reducer(),
				...reducers
			}
		),
		{},
		compose(
			applyMiddleware(
				apollo.middleware(),
				api,
				errorHandler,
				normalizer,
				sessionHandler,
				thunk
			),
			window.devToolsExtension ? window.devToolsExtension() : f => f
		)
	);
}