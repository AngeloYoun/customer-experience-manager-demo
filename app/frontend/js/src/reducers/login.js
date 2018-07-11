import {Map} from 'immutable';

import {actionTypes} from 'actions/login';
import {createReducer} from 'lib/util';

const actionHandlers = {
	[actionTypes.LOGIN]: (state, {loggedIn}) => state.set('loggedIn', loggedIn),
	[actionTypes.LOGOUT]: (state, {loggedIn}) => state.set('loggedIn', loggedIn)
};

export default createReducer(Map(), actionHandlers);