import {actionTypes as usersActionTypes} from 'actions/users';
import {composeReducers} from 'lib/util';
import createBaseReducer from 'reducers/request-handler';

export default composeReducers(
	createBaseReducer(
		{
			actionTypes: usersActionTypes,
			primaryKey: 'users'
		}
	)
);