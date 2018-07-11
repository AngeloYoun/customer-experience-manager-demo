import {actionTypes as accountsActionTypes} from 'actions/accounts';
import {composeReducers} from 'lib/util';
import createBaseReducer from 'reducers/request-handler';

export default composeReducers(
	createBaseReducer(
		{
			actionTypes: accountsActionTypes,
			primaryKey: 'accounts'
		}
	)
);