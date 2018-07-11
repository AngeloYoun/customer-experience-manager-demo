import {actionTypes as opportunitiesActionTypes} from 'actions/opportunities';
import {composeReducers} from 'lib/util';
import createBaseReducer from 'reducers/request-handler';

export default composeReducers(
	createBaseReducer(
		{
			actionTypes: opportunitiesActionTypes,
			primaryKey: 'opportunities'
		}
	)
);